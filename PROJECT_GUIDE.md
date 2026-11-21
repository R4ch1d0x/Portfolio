# Portfolio Project Guide

## Architecture

This is a static Astro site. Every page is authored under `src/pages/`; Astro builds extensionless routes into `dist/`. The build does not copy legacy HTML pages.

- `src/layouts/Base.astro` provides the document shell, shared styles, SEO tags (including favicon), and standard page chrome.
- `src/layouts/Article.astro` wraps `Base.astro` and provides dedicated article navigation, back-links, and article footer for CTF and machine writeups.
- `src/styles/writeup.css` provides the shared typography, callouts, steps, tags, and syntax-highlight styling across all writeup articles.
- `src/utils/paths.ts` provides the `withBase()` helper so all links and asset paths automatically adapt to GitHub Pages (`/portfolio/`) or custom domains.

Static assets are in `public/assets/` and are served from `/assets/`. The home-page terminal is `src/scripts/site.js`; it handles terminal commands, project cards, and certificate previews. `public/assets/js/theme.js` applies the saved theme and creates the theme toggle/back-to-top controls.

Install dependencies with `npm install`, run the dev server with `npm run dev`, build with `npm run build`, and preview the production output with `npm run preview`. Node.js 22.23.4 or newer is required.

## Route map

| URL | Astro source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Home, project carousel, terminal, skills, certifications, and contact |
| `/contact` | `src/pages/contact.astro` | Contact links and profile summary |
| `/notes` | `src/pages/notes/index.astro` | Searchable/filterable note directory |
| `/notes/sql-injection` | `src/pages/notes/sql-injection.astro` | SQL fundamentals notes |
| `/notes/lab-metasploit` | `src/pages/notes/lab-metasploit.astro` | Metasploit reference |
| `/notes/linux-privesc-enum` | `src/pages/notes/linux-privesc-enum.astro` | Linux enumeration notes |
| `/writeups` | `src/pages/writeups/index.astro` | Searchable writeup directory with HackTheBox / TryHackMe filters |
| `/writeups/htb/touch-writeup` | `src/pages/writeups/htb/touch-writeup.astro` | HTB Touch article |
| `/writeups/thm/pickle-rick-writeup` | `src/pages/writeups/thm/pickle-rick-writeup.astro` | Pickle Rick article |
| `/writeups/thm/library-writeup` | `src/pages/writeups/thm/library-writeup.astro` | Library article |
| `/projects/dos-dns-spoofing-presentation` | `src/pages/projects/dos-dns-spoofing-presentation.astro` | Interactive full-screen presentation |

Route directories and URLs are lowercase. Astro's `trailingSlash: 'never'` and directory output settings preserve these extensionless paths.

## Shared layout and page behavior

- `Base.astro` loads the portfolio styles and theme script by default. Page-specific global styles go in its `head` slot.
- `SiteNav.astro` renders the standard portfolio navigation or the compact article navigation. Use absolute lowercase URLs for internal links.
- `SiteFooter.astro` renders the standard footer or the article back-link/footer.
- The presentation disables portfolio styles, theme behavior, navigation, and footer to preserve its slide-deck viewport.
- The notes directory filters its existing cards in the browser; it does not fetch note data.
- The terminal script only initializes the interactive terminal when `#term-body`, `#term-out`, and `#term-in` are present.

## Adding or changing pages

- Add Astro pages under `src/pages/` using lowercase route names. An `index.astro` inside a folder creates that folder's route.
- Use `Base.astro` for standard pages. Use `Article.astro` for writeups.
- Put images, stylesheets, and browser scripts under `public/assets/`; reference them with `withBase('/assets/...')`.
- Update internal links and `src/scripts/site.js` whenever a route changes.
- Add project cards to the project array in `src/scripts/site.js` and place their previews under `public/assets/img/projects/thumbnails/`.
- Edit `public/assets/css/style.css` and `theme.css` for shared visual behavior; edit `public/assets/js/theme.js` for theme controls.

`meta/` contains authoring notes. `dist/` and `graphify-out/` are generated output, not page source.
