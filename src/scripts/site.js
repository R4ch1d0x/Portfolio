import { withBase } from '../utils/paths';

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
    home: { label: 'Home', url: withBase('/'), group: 'Pages' },
    projects: { label: 'Projects', url: withBase('#projects'), group: 'Pages' },
    writeups: { label: 'Writeups', url: withBase('/writeups'), group: 'Pages' },
    notes: { label: 'Notes', url: withBase('/notes'), group: 'Pages' },
    skills: { label: 'Skills', url: withBase('#skills'), group: 'Pages' },
    certs: { label: 'Certs', url: withBase('#certs'), group: 'Pages' },
    contact: { label: 'Contact', url: withBase('/contact'), group: 'Pages' },
    sqlinjection: { label: 'SQL Injection Fundamentals', url: withBase('/notes/sql-injection'), group: 'Notes' },
    metasploit: { label: 'Metasploit Framework Cheatsheet', url: withBase('/notes/lab-metasploit'), group: 'Notes' },
    linuxprivesc: { label: 'Linux Privilege Escalation Enumeration', url: withBase('/notes/linux-privesc-enum'), group: 'Notes' },
    github: { label: 'GitHub', url: 'https://github.com/R4ch1d0x', group: 'Links', external: true },
    htb: { label: 'Hack The Box', url: 'https://app.hackthebox.com/users/3997830', group: 'Links', external: true }
  };
  var EMAIL = atob('Y2hva3JhbmkucmFjaGlkMTBAZ21haWwuY29t');

  var projectsGrid = $('#projects-grid');
  if (projectsGrid) {
    var projects = [
      {
        image: withBase('/assets/img/projects/thumbnails/thumb-dos-dns-spoofing.svg'),
        category: 'Network Security · Lab',
        index: '01',
        title: 'Virtualized DoS & DNS/ARP Spoofing Attack Lab',
        subtitle: 'OCP internship · ENSIASD Taroudant',
        description: 'Slowloris DoS and DNS/ARP spoofing with defensive controls.',
        caseStudyUrl: withBase('/projects/dos-dns-spoofing-presentation')
      },
      {
        image: withBase('/assets/img/projects/thumbnails/thumb-safe-shelter.svg'),
        category: 'Application Security · Audit',
        index: '02',
        title: 'Safe Shelter Connect — Comparative Security Audit',
        subtitle: 'Personal project · ENSIASD Taroudant',
        description: 'AI-assisted and human code compared through a practical security audit.',
        caseStudyUrl: withBase('#projects')
      },
      {
        image: withBase('/assets/img/projects/thumbnails/thumb-aes-ctr.svg'),
        category: 'Cryptography · Engineering',
        index: '03',
        title: 'Symmetric Cryptographic Algorithms for Network Security',
        subtitle: 'PFE · EST Safi',
        description: 'AES in CTR mode with secure key establishment and network analysis.',
        caseStudyUrl: withBase('#projects')
      }
    ];

    projects.forEach(function (project) {
      var card = document.createElement('article');
      card.className = 'project-card';

      var visual = document.createElement('div');
      visual.className = 'project-visual';
      if (project.image) {
        var image = document.createElement('img');
        image.src = project.image;
        image.alt = project.title + ' project preview';
        visual.appendChild(image);
      } else {
        visual.classList.add('project-placeholder');
      }

      var divider = document.createElement('div');
      divider.className = 'project-progress';
      card.appendChild(visual);
      card.appendChild(divider);

      var content = document.createElement('div');
      content.className = 'project-content';

      var meta = document.createElement('div');
      meta.className = 'project-meta';
      var category = document.createElement('span');
      category.className = 'project-category';
      var dot = document.createElement('span');
      dot.className = 'project-category-dot';
      category.appendChild(dot);
      category.appendChild(document.createTextNode(project.category));
      var index = document.createElement('span');
      index.className = 'project-index';
      index.textContent = project.index;
      meta.appendChild(category);
      meta.appendChild(index);

      var title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.title;
      var subtitle = document.createElement('p');
      subtitle.className = 'project-subtitle';
      subtitle.textContent = project.subtitle;
      var description = document.createElement('p');
      description.className = 'project-description';
      description.textContent = project.description;

      content.appendChild(meta);
      content.appendChild(title);
      content.appendChild(subtitle);
      content.appendChild(description);

      var footer = document.createElement('div');
      footer.className = 'project-footer';
      var caseLink = document.createElement('a');
      caseLink.className = 'project-case-link';
      caseLink.href = project.caseStudyUrl;
      caseLink.textContent = 'Read the case study';
      var caseArrow = document.createElement('span');
      caseArrow.setAttribute('aria-hidden', 'true');
      caseArrow.textContent = ' \u2192';
      caseLink.appendChild(caseArrow);

      footer.appendChild(caseLink);
      card.appendChild(content);
      card.appendChild(footer);
      card.addEventListener('click', function (event) {
        if (event.target.closest('a')) return;
        window.location.href = project.caseStudyUrl;
      });
      projectsGrid.appendChild(card);
    });

    var projectCards = Array.prototype.slice.call(projectsGrid.querySelectorAll('.project-card'));
    var projectsDots = $('.projects-dots');
    var projectsPrev = $('.projects-prev');
    var projectsNext = $('.projects-next');
    var projectPage = 0;

    function cardsPerView() {
      return window.matchMedia('(max-width: 900px)').matches ? 1 : 3;
    }

    function pageCount() {
      return Math.ceil(projectCards.length / cardsPerView());
    }

    function goToProjectPage(index) {
      projectPage = (index + pageCount()) % pageCount();
      var cardOffset = projectPage * cardsPerView() * (projectCards[0].offsetWidth + 20);
      projectsGrid.scrollTo({ left: cardOffset, behavior: 'smooth' });
      var dots = projectsDots.querySelectorAll('.projects-dot');
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === projectPage);
        dots[i].setAttribute('aria-current', i === projectPage ? 'true' : 'false');
      }
    }

    for (var page = 0; page < pageCount(); page++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'projects-dot' + (page === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Show project page ' + (page + 1));
      dot.setAttribute('aria-current', page === 0 ? 'true' : 'false');
      (function (pageIndex) {
        dot.addEventListener('click', function () { goToProjectPage(pageIndex); });
      })(page);
      projectsDots.appendChild(dot);
    }

    if (projectsPrev) projectsPrev.addEventListener('click', function () { goToProjectPage(projectPage - 1); });
    if (projectsNext) projectsNext.addEventListener('click', function () { goToProjectPage(projectPage + 1); });
    projectsGrid.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') goToProjectPage(projectPage - 1);
      if (event.key === 'ArrowRight') goToProjectPage(projectPage + 1);
    });
  }

  var certGrid = $('.certs-grid'), certDialog = $('#cert-preview');
  var certPreviewImage = certDialog && $('.cert-preview img', certDialog);
  var certPreviewClose = certDialog && $('.cert-preview-close', certDialog);
  if (certGrid && certDialog && certPreviewImage && certPreviewClose && typeof certDialog.showModal === 'function') {
    certGrid.addEventListener('click', function (e) {
      var button = e.target.closest('.cert-img');
      if (!button || !certGrid.contains(button)) return;
      var image = $('img', button);
      if (!image) return;
      certPreviewImage.src = image.currentSrc || image.src;
      certPreviewImage.alt = image.alt;
      certDialog.showModal();
    });
    certPreviewClose.addEventListener('click', function () { certDialog.close(); });
    certDialog.addEventListener('click', function (e) {
      if (e.target === certDialog) certDialog.close();
    });
    certDialog.addEventListener('close', function () {
      certPreviewImage.removeAttribute('src');
      certPreviewImage.alt = '';
    });
  }

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

  var TARGETS = ['sqlinjection', 'metasploit', 'linuxprivesc', 'projects', 'writeups', 'notes', 'skills', 'certs', 'contact', 'github', 'htb'];
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
    line('0xR4sh', 'ok');
    line('Rachid Chokrani, cybersecurity engineering student at ENSIASD (2025–2028).');
    line('Focus: offensive security & privilege escalation. Morocco.', 'dim');
  },
  pwd: function () { line('/home/0xR4sh'); },
  date: function () { line(new Date().toString()); },
  echo: function (a) { line(a.join(' ')); },
  sudo: function () { line('0xR4sh is not in the sudoers file. This incident will be reported.', 'err'); },
  clear: function () { out.textContent = ''; },
  ls: function (a) {
    var d = (a[0] || '').replace(/\/$/, '').toLowerCase();
    if (!d) { line('projects/  writeups/  notes/  skills.txt  certs.txt  contact.txt  education.txt'); return; }
    if (d === 'projects') {
      line('safe-shelter-connect-audit/   2026');
      line('symmetric-crypto-aes-ctr/     Dec 2024 – Apr 2025');
      line('open them on the Projects page: cd projects', 'dim');
    } else if (d === 'writeups') {
      line('HackTheBox:   Touch');
      line('TryHackMe:    Pickle Rick, Library');
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
      line('EST Safi — DUT Génie Informatique   2023–2025');
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
    var pr = el('span', 'ps', 'root@0xR4sh:~# '); prompt.appendChild(pr); prompt.appendChild(document.createTextNode(raw));
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

