// Add a new writeup HERE only. Home page and /writeups both read this list.
export interface Writeup {
  platform: 'HackTheBox' | 'TryHackMe';
  title: string;                 // card title, e.g. "THM: Library"
  slug: string;                  // path under /writeups, e.g. "thm/library-writeup"
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  desc: string;                  // short summary shown on the card
  tags: string[];
}

export const writeups: Writeup[] = [
  {
    platform: 'HackTheBox',
    title: 'HTB: Touch',
    slug: 'htb/touch-writeup',
    difficulty: 'easy',
    desc: 'Windows kiosk breakout into MySQL UDF privilege escalation. Chained a leaked serial number → plaintext creds → kiosk escape → file-dialog-to-shell → SYSTEM via UDF.',
    tags: ['Kiosk Escape', 'Credential Hunting', 'MySQL UDF', 'SYSTEM Privesc']
  },
  {
    platform: 'TryHackMe',
    title: 'THM: Pickle Rick',
    slug: 'thm/pickle-rick-writeup',
    difficulty: 'easy',
    desc: 'Web credential leaks and command-panel RCE lead to a reverse shell, then unrestricted sudo provides a direct path to root.',
    tags: ['Information Disclosure', 'Reverse Shell', 'Sudo NOPASSWD']
  },
  {
    platform: 'TryHackMe',
    title: 'THM: Library',
    slug: 'thm/library-writeup',
    difficulty: 'easy',
    desc: 'Robots.txt hint → SSH brute force with rockyou → symlink attack on a root-run backup script to read root.txt.',
    tags: ['Credential Brute Force', 'Sudo NOPASSWD', 'Symlink Attack']
  }
];
