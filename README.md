# Rachid Chokrani — Cybersecurity Portfolio

A static, browser-rendered portfolio featuring cybersecurity projects, notes, and writeups. Built with HTML, CSS, and vanilla JavaScript; there is no package manager, build step, backend, or database.

## Features

- Interactive terminal on the home page with command history, tab completion, and page navigation
- Light/dark theme toggle and responsive layouts
- Project summaries, cybersecurity notes and reference guides, and an HTB writeup
- Native smooth scrolling on the home page

## Run locally

Open `index.html` in a browser, or serve the project root over HTTP for more consistent behavior with relative links:

```powershell
py -m http.server 8000
```

Then visit <http://localhost:8000>.

## Pages

- `index.html` — home page and interactive terminal
- `Projects/projects.html` — project summaries and presentation links
- `contact.html` — contact and profile links
- `Notes/` — SQL injection fundamentals, Metasploit reference, and Linux privilege-escalation enumeration
- `writeups/` — HTB Touch writeup and writeup directories

Shared styles and scripts are in `assets/`. The home-page terminal script is `site.js`.

## External resources

The site uses Google Fonts. The retained, unlisted DDoS page also loads Three.js from a CDN.

## Project notes

See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for the file map, page dependencies, and maintenance guidance. Generated `graphify-out/` analysis files are excluded from Git.
