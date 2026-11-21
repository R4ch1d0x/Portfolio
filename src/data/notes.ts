// Add a new note HERE (append to the END of the list). The /notes page and the
// home page both read this list; the home page shows the 3 latest entries.
export interface Note {
  title: string;                 // card title
  slug: string;                  // path under /notes, e.g. "sql-injection"
  category: string;              // filter category and badge, e.g. "Web", "Pwn", "Misc"
  desc: string;                  // short summary shown on the card
  tags: string[];
}

export const notes: Note[] = [
  {
    title: 'SQL Injection Fundamentals',
    slug: 'sql-injection',
    category: 'Web',
    desc: 'Build a foundation in SQL, learn how injection changes query logic, and see how parameterized queries prevent it.',
    tags: ['MySQL', 'SQL Injection', 'Prevention']
  },
  {
    title: 'Metasploit Framework Cheatsheet',
    slug: 'lab-metasploit',
    category: 'Pwn',
    desc: 'A practical msfconsole reference covering databases, modules, payloads, sessions, Meterpreter, msfvenom, and resource scripts.',
    tags: ['Metasploit', 'msfconsole', 'Post-exploitation']
  },
  {
    title: 'Linux Privilege Escalation Enumeration',
    slug: 'linux-privesc-enum',
    category: 'Misc',
    desc: 'A manual enumeration reference for Linux hosts, users, processes, permissions, SUID binaries, cron jobs, and privilege-escalation checks.',
    tags: ['Linux', 'Enumeration', 'Privilege escalation']
  }
];
