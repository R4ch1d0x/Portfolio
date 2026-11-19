/* site.js — interactive terminal (hero).
   Loaded on every page. The terminal only starts if #term-body exists. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Where things live (edit URLs here) ---------- */
  var PAGES = {
    home: { label: 'Home', url: 'index.html', group: 'Pages' },
    projects: { label: 'Projects', url: '../index.html#projects', group: 'Pages' },
    writeups: { label: 'Writeups', url: 'writeups/index.html', group: 'Pages' },
    notes: { label: 'Notes', url: 'Notes/index.html', group: 'Pages' },
    skills: { label: 'Skills', url: 'skills.html', group: 'Pages' },
    certs: { label: 'Certs', url: 'certs.html', group: 'Pages' },
    contact: { label: 'Contact', url: 'contact.html', group: 'Pages' },
    sqlinjection: { label: 'SQL Injection Fundamentals', url: 'Notes/sql-injection.html', group: 'Notes' },
    metasploit: { label: 'Metasploit Framework Cheatsheet', url: 'Notes/lab-metasploit.html', group: 'Notes' },
    linuxprivesc: { label: 'Linux Privilege Escalation Enumeration', url: 'Notes/linux-privesc-enum.html', group: 'Notes' },
    touch: { label: 'HTB: Touch', url: 'writeups/HTB/touch-writeup.html', group: 'Writeups' },
    github: { label: 'GitHub', url: 'https://github.com/', group: 'Links', external: true },
    htb: { label: 'Hack The Box', url: 'https://app.hackthebox.com/', group: 'Links', external: true }
  };
  var EMAIL = 'chokrani.rachid10@gmail.com';

  function go(url, external) {
    if (external) window.open(url, '_blank', 'noopener');
    else window.location.href = url;
  }

  /* =====================================================
     INTERACTIVE TERMINAL
     ===================================================== */
  var body = $('#term-body'), out = $('#term-out'), inp = $('#term-in');
  if (!body || !out || !inp) return;

  var history = [], hIdx = 0;
  function line(text, cls) { var d = el('div', 'line' + (cls ? ' ' + cls : ''), text); out.appendChild(d); return d; }
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }
  function linkLine(prefix, text, url) {
    var d = el('div', 'line'); if (prefix) d.appendChild(document.createTextNode(prefix));
    var a = el('a', '', text); a.href = url; d.appendChild(a); out.appendChild(d);
  }
  function scroll() { body.scrollTop = body.scrollHeight; }

  var TARGETS = ['sqlinjection', 'metasploit', 'linuxprivesc', 'touch', 'projects', 'writeups', 'notes', 'skills', 'certs', 'contact', 'github', 'htb'];
var FILES = ['skills.txt', 'contact.txt', 'certs.txt', 'education.txt'];
var DIRS = ['projects', 'writeups', 'notes', 'certs'];
var NAMES = ['help', 'whoami', 'ls', 'cat', 'cd', 'clear', 'pwd', 'date', 'echo', 'sudo'];

var CMDS = {
  help: function () {
    line('available commands', 'key');
    [['help', 'show this list'],
     ['whoami', 'who is behind this site'],
     ['ls [dir]', 'list directories'],
     ['cat <file>', 'open files'],
     ['cd <target>', 'eg: cd projects'],
     ['clear', 'clear the screen (or Ctrl+L)']
    ].forEach(function (r) { line('  ' + pad(r[0], 15) + r[1]); });
    line('tip: Tab completes, ↑ ↓ browse history.', 'dim');
  },
  whoami: function () {
    line('0xr4sh', 'ok');
    line('Rachid Chokrani, cybersecurity engineering student at ENSIASD (2025–2028).');
    line('Focus: offensive security & privilege escalation. Morocco.', 'dim');
  },
  pwd: function () { line('/home/0xr4sh'); },
  date: function () { line(new Date().toString()); },
  echo: function (a) { line(a.join(' ')); },
  sudo: function () { line('0xr4sh is not in the sudoers file. This incident will be reported.', 'err'); },
  clear: function () { out.textContent = ''; },
  ls: function (a) {
    var d = (a[0] || '').replace(/\/$/, '').toLowerCase();
    if (!d) { line('projects/  writeups/  Notes/  skills.txt  certs.txt  contact.txt  education.txt'); return; }
    if (d === 'projects') {
      line('safe-shelter-connect-audit/   2026');
      line('symmetric-crypto-aes-ctr/     Dec 2024 – Apr 2025');
      line('open them on the Projects page: cd projects', 'dim');
    } else if (d === 'writeups') {
      line('HTB/   Medium   kiosk escape → MySQL UDF → SYSTEM');
      line('THM/   Coming soon   machine notes and rooms');
      line('read it: cd touch', 'dim');
    } else if (d === 'notes') {
      line('sql-injection   SQL fundamentals, injection awareness, and prevention');
      line('metasploit       Framework commands, modules, sessions, and payloads');
      line('linux-privesc    Linux privilege escalation enumeration');
      line('open notes: cd sqlinjection | cd metasploit | cd linuxprivesc', 'dim');
    } else if (d === 'certs') {
      line('CCNA 1 & 2 (SRWE)   Cisco Networking Academy');
      line('Cybersecurity Bootcamp   CyberTalents');
      line('Problem Solving (Basic)   HackerRank');
    } else line('ls: cannot access \'' + d + '\': No such directory', 'err');
  },
  cat: function (a) {
    var name = a[0] || '';
    if (!name) { line('usage: cat <file>   (try: cat skills.txt)', 'err'); return; }
    if (!/\.txt$/.test(name)) { line('cat: ' + name + ': No such file', 'err'); return; }
    var f = name.replace(/\.txt$/, '');
    if (f === 'skills') {
      [['languages', 'C/C++  Python  Java  Bash  PHP  XML'],
       ['offensive', 'Nmap  Gobuster  Burp Suite  Metasploit  Wireshark  John'],
       ['defensive', 'Wazuh  ELK  Suricata  iptables  fail2ban  DNSSEC'],
       ['devsecops', 'AWS (fundamentals)  Docker  GitHub Actions  Ansible'],
       ['databases', 'MySQL  PostgreSQL'],
       ['platforms', 'Git  Linux  Windows  Active Directory  Laravel  Odoo']
      ].forEach(function (r) { var d = line(pad(r[0], 11)); d.classList.add('key'); d.textContent = pad(r[0], 11); var s = el('span', 'echo', r[1]); d.appendChild(s); });
    } else if (f === 'contact') {
      line('email    ' + EMAIL);
      linkLine('github   ', 'github.com', PAGES.github.url);
      linkLine('htb      ', 'app.hackthebox.com', PAGES.htb.url);
    } else if (f === 'certs') CMDS.ls(['certs']);
    else if (f === 'education') {
      line('ENSIASD — Cybersecurity & Digital Trust Engineering   2025–2028');
      line('DUT Génie Informatique — EST Safi');
    } else line('cat: ' + name + ': No such file', 'err');
  },
  cd: function (a) {
    var t = (a[0] || '').toLowerCase();
    if (!t) { line('usage: cd <target>   (' + TARGETS.join(' | ') + ')', 'err'); return; }
    var p = PAGES[t];
    if (!p) { line('cd: unknown target \'' + t + '\'', 'err'); return; }
    line('opening ' + p.label + '...', 'ok');
    setTimeout(function () { go(p.url, p.external); }, 300);
  }
};

  function run(raw) {
    var prompt = el('div', 'line echo');
    var pr = el('span', 'ps', 'root@0xr4sh:~# '); prompt.appendChild(pr); prompt.appendChild(document.createTextNode(raw));
    out.appendChild(prompt);
    var parts = raw.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return;
    var name = parts[0].toLowerCase(), args = parts.slice(1);
    if (CMDS.hasOwnProperty(name)) CMDS[name](args);
    else line(name + ': command not found. Type "help".', 'err');
  }

  function complete() {
    var v = inp.value, sp = v.lastIndexOf(' ');
    var pool, head, tail;
    if (sp < 0) { pool = NAMES; head = ''; tail = v; }
    else {
      var cmd = v.slice(0, v.indexOf(' ')).toLowerCase();
      head = v.slice(0, sp + 1); tail = v.slice(sp + 1);
      pool = cmd === 'cd' ? TARGETS : cmd === 'cat' ? FILES : cmd === 'ls' ? DIRS : [];
    }
    var m = pool.filter(function (x) { return x.indexOf(tail.toLowerCase()) === 0; });
    if (m.length === 1) inp.value = head + m[0] + ' ';
    else if (m.length > 1) line(m.join('  '), 'dim');
  }

  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var v = inp.value; inp.value = '';
      if (v.trim()) { history.push(v); hIdx = history.length; }
      run(v); scroll();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); if (hIdx > 0) { hIdx--; inp.value = history[hIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < history.length - 1) { hIdx++; inp.value = history[hIdx]; } else { hIdx = history.length; inp.value = ''; }
    } else if (e.key === 'Tab') {
      e.preventDefault(); complete(); scroll();
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault(); CMDS.clear();
    }
  });
  
  body.addEventListener('click', function () {
    var sel2 = window.getSelection && window.getSelection().toString();
    if (!sel2) inp.focus({ preventScroll: true });
  });
})();

