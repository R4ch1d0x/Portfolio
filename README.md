# Rachid Chokrani — Cybersecurity Portfolio

A static portfolio built with Astro. All site pages are Astro routes; shared navigation and footer components live in `src/components/`, and static assets are served from `public/assets/`.

## Run locally

Requires Node.js 22.23.4 or newer and npm 9.6.5 or newer.

```powershell
npm install
npm run dev
```

For a production build:

```powershell
npm run build
npm run preview
```

## Routes

- `/` — portfolio home, terminal, projects, writeups, notes, skills, certifications, and contact
- `/contact`
- `/notes` and `/notes/{sql-injection,lab-metasploit,linux-privesc-enum}`
- `/writeups`, `/writeups/htb`, `/writeups/htb/touch-writeup`
- `/writeups/thm`, `/writeups/thm/pickle-rick-writeup`
- `/projects/dos-dns-spoofing-presentation`

All route paths use lowercase names and omit `.html`.

## Project notes

See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for the route map, shared layout, and maintenance guidance. Generated `dist/` and `graphify-out/` directories are excluded from Git.
