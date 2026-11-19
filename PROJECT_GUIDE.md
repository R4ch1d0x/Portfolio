# Portfolio Project Guide

## What this project is

This is a static, browser-rendered cybersecurity portfolio. It is built from HTML pages, shared CSS and JavaScript, and a small number of page-specific inline scripts. There is no application server, database, package manifest, bundler, or build step in the project source.

The site can be opened from `index.html`. For the most consistent behavior, serve the portfolio folder with any static HTTP server and open it at its root. Page links and local assets use relative paths, so preserve the directory layout when hosting or moving files.

## File map

```text
Portfolio/
├── index.html                     # Home page and interactive terminal
├── Projects/
│   ├── projects.html              # Project summaries
│   └── DoS_DNS_Spoofing_Presentation.html
├── contact.html                   # Contact links
├── site.js                        # Terminal script loaded by the home page
├── assets/
│   ├── css/
│   │   ├── style.css              # Main layout, components, responsive rules
│   │   └── theme.css              # Light-theme overrides and injected-control styles
│   ├── img/
│   │   ├── certs/                 # Certificate images
│   │   ├── logos/                 # Presentation and institutional logos
│   │   ├── projects/
│   │   │   ├── thumbnails/        # Project preview SVGs
│   │   │   └── dos-dns-spoofing/  # Project screenshots
│   │   └── writeups/
│   │       └── thm/               # TryHackMe screenshots
│   └── js/
│       ├── theme.js               # Theme toggle and back-to-top behavior
│       └── site.js                # Copy of the home terminal script
├── Notes/
│   ├── index.html                 # Notes directory and search
│   ├── sql-injection.html         # SQL fundamentals course
│   ├── lab-ddos.html              # Retained, unlisted DDoS course and browser simulation
│   ├── lab-jwt.html               # Retained, unlisted JWT scenario and remediation demo
│   ├── lab-metasploit.html        # Metasploit Framework cheatsheet
│   └── linux-privesc-enum.html    # Linux privilege escalation enumeration
├── writeups/
│   ├── index.html                 # Writeups directory
│   ├── HTB/
│   │   ├── index.html             # HTB writeup directory
│   │   └── touch-writeup.html     # Touch machine writeup
│   └── THM/
│       └── index.html             # TryHackMe directory placeholder
├── meta/
│   ├── htb-touch-writeup.md       # Markdown notes/source for the Touch writeup
│   └── prompt.txt                 # Course-page authoring prompt/template
└── graphify-out/                  # Generated graph, report, and extraction/cache data
```

`graphify-out/` is generated analysis output. The portfolio pages do not load it.

## Page and dependency map

| Page | Local runtime dependencies | Main connections |
|---|---|---|
| [`index.html`](./index.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js`, root `site.js` | Main entry point. Links to the project, writeup, notes, and contact pages; cards link to Touch and the three listed note pages. |
| [`Projects/projects.html`](./Projects/projects.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js` | Reachable from the main navigation. Contains project summaries and links to the DoS/DNS spoofing presentation. |
| [`contact.html`](./contact.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js` | Reachable from the main navigation. Contains email and external profile links. |
| [`Notes/index.html`](./Notes/index.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js`, `assets/js/site.js`, inline search and category filters | Notes directory. Its cards link to the SQL, Metasploit, and Linux enumeration pages. The inline script filters cards already present in the page; it does not fetch note data. |
| [`Notes/sql-injection.html`](./Notes/sql-injection.html) | `assets/css/theme.css`, `assets/js/theme.js`, inline styles/scripts, Google Fonts stylesheet | Self-contained SQL fundamentals course with in-page navigation and browser-side interactions. It does not load the main `style.css` or `site.js`. |
| [`Notes/lab-ddos.html`](./Notes/lab-ddos.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js`, `assets/js/site.js`, inline styles/scripts, Three.js r128 CDN script | DDoS course and simulation. The inline code handles the course interactions and visualization; Three.js supplies the 3D library. |
| [`Notes/lab-jwt.html`](./Notes/lab-jwt.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js`, `assets/js/site.js`, inline styles/scripts | JWT demonstration and remediation content. Its scenario logic is in the page itself. |
| [`writeups/index.html`](./writeups/index.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js` | Writeups directory. Links to the HTB and THM subdirectories, and directly to the Touch writeup. |
| [`writeups/HTB/index.html`](./writeups/HTB/index.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js` | HTB directory. Links to the Touch writeup. |
| [`writeups/HTB/touch-writeup.html`](./writeups/HTB/touch-writeup.html) | `assets/css/theme.css`, `assets/js/theme.js`, page-local styles, Google Fonts stylesheet | Standalone Touch article. Links back to the writeup directory and home page. It does not load the main `style.css` or `site.js`. |
| [`writeups/THM/index.html`](./writeups/THM/index.html) | `assets/css/style.css`, `assets/css/theme.css`, `assets/js/theme.js` | Placeholder directory for future TryHackMe writeups. |

The common page navigation uses regular HTML links; there is no client-side router. Navigation paths are written relative to each page's directory.

## Shared assets

### `assets/css/style.css`

The main visual foundation: color variables, typography, navigation, page containers, cards, sections, responsive breakpoints, terminal styling, and reusable lab components. It imports JetBrains Mono from Google Fonts.

### `assets/css/theme.css`

Adds the light-theme variable values and overrides dark-specific component styles. It also styles controls created by `theme.js`, including the theme button and back-to-top button. Pages using `theme.js` should generally include this stylesheet.

### `assets/js/theme.js`

Runs in the document head so it can set `data-theme` before the page is painted. It reads and saves the selected theme in `localStorage`, creates the theme toggle inside the navigation, and creates a back-to-top button after the document loads. The CSS for the resulting controls is in `theme.css`.

### `site.js` and `assets/js/site.js`

These two files are currently identical copies of the interactive terminal script. The home page loads the root `site.js`; the Notes index and two interactive Notes pages load `assets/js/site.js`.

The script exits immediately unless the page contains all three terminal elements: `#term-body`, `#term-out`, and `#term-in`. The home page provides them; the other pages that load the script currently do not, so it has no terminal behavior there. On the home page, it handles command input, history, tab completion, `help`, `ls`, `cat`, `cd`, and navigation to the listed pages.

**Maintenance note:** edits to one copy do not update the other. Keep them synchronized or consolidate them to one file and update the script references.

### Home-page project cards

The Projects section on `index.html` is now a horizontal carousel rendered by `site.js` from a JavaScript project array. Each project object provides the preview image, category, index, title, subtitle, description, and case-study URL.

The cards use:

- Three cards visible on desktop and one card visible on narrow screens.
- Arrow and dot controls that advance by full pages.
- Equal-height card layout with a framed SVG/image preview.
- `object-fit: contain` for previews so SVG diagrams are fully visible.
- A progress line that expands from 15% to 100% on card hover.
- A grey “Read the case study” link that becomes green while its card is hovered.
- Whole-card click behavior: clicking any non-link area opens the same case-study URL.
- Real `<a>` links for keyboard access, visible focus styles, reduced-motion support, and no nested links.

To add or reorder a project, update the project array in `site.js` and place its preview under `assets/img/projects/thumbnails/`. Project cards are created with DOM methods and text content rather than injected HTML.

## How the main sections connect

```text
index.html
├── Projects/projects.html
├── contact.html
├── writeups/index.html
│   ├── writeups/HTB/index.html
│   │   └── writeups/HTB/touch-writeup.html
│   ├── writeups/THM/index.html
│   └── writeups/HTB/touch-writeup.html
└── Notes/index.html
    ├── Notes/sql-injection.html
    ├── Notes/lab-metasploit.html
    └── Notes/linux-privesc-enum.html
```

The home page also links directly to the Touch article and each of the three listed Notes pages. The DDoS and JWT pages remain in the source tree but are no longer listed. Individual content pages link back to the main site or their section directory.

### Adding content

- **Add a project card:** add the project object to the project array in `site.js`, add its SVG or image under `assets/img/projects/thumbnails/` or `assets/img/projects/`, and set a valid relative `caseStudyUrl`. Keep card links real and avoid embedding tags or extra nested links.
- **Add a note:** create its HTML page in `Notes/`, then add a card to `Notes/index.html`. Add a home-page card in `index.html` if it should appear there too. If the home terminal's `cd`/`ls notes` listing should include it, update both `site.js` copies.
- **Add a writeup:** create the article under `writeups/`, link it from `writeups/index.html`, and optionally add it to the relevant HTB/THM directory and the home page. Update both terminal-script copies if adding a terminal `cd` target.
- **Change site-wide styling:** edit `assets/css/style.css` for shared layout/components or `assets/css/theme.css` for theme-specific overrides.
- **Change theme behavior:** edit `assets/js/theme.js`; check the corresponding selectors in `assets/css/theme.css`.

## External services and runtime notes

- Data URIs should be extracted into real image files under `assets/img/`; update relative links in HTML and Markdown after moving or renaming files.
- Google Fonts is requested by `style.css` and by some standalone pages. Without network access, the pages use their local monospace fallback fonts.
- The unlisted `Notes/lab-ddos.html` loads Three.js r128 from cdnjs. Its interactive 3D scene depends on that external script.
- `Notes/sql-injection.html` loads JetBrains Mono from Google Fonts and uses its own page styles and scripts.
- Contact and profile URLs are outbound links, not application dependencies.
- There is no site-wide data API or backend in the listed source. The notes and demos are authored in the HTML and run in the browser.

## Audit starting points

1. Start at `index.html` to understand the page navigation and the portfolio sections.
2. Read `assets/css/style.css` and `assets/css/theme.css` for shared presentation and theme behavior.
3. Read `assets/js/theme.js` for global browser behavior.
4. Read `site.js` alongside `assets/js/site.js` before changing terminal behavior; they are duplicates.
5. For a feature, trace its directory index card to the linked page, then inspect that page's inline scripts and explicit asset imports.
6. Treat `meta/` as authoring material and `graphify-out/` as generated analysis data, not code required to serve the site.
