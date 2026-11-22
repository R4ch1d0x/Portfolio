# Portfolio Project Guide

## Architecture

This is a static Astro site. Every page is authored under `src/pages/`; Astro builds extensionless routes into `dist/`. The build does not copy legacy HTML pages.

- `src/layouts/Base.astro` provides the document shell, shared styles, SEO tags (including favicon), and standard page chrome.
- `src/layouts/Article.astro` wraps `Base.astro` and provides dedicated article navigation, back-links, and article footer for CTF and machine writeups.
- `src/styles/writeup.css` provides the shared typography, callouts, steps, tags, and syntax-highlight styling across all writeup articles.
- `src/utils/paths.ts` provides the `withBase()` helper so all links and asset paths automatically adapt to a base path or custom domain.
- `src/data/writeups.ts` and `src/data/notes.ts` are the single source of truth for writeup and note cards. `src/components/WriteupCard.astro` and `NoteCard.astro` render them on the home page and on `/writeups` and `/notes`.
- `src/scripts/reveal-email.js` decodes the base64 email stored in `data-mail` / `data-mail-text` attributes. Never write the email address in plain text in a page.

Static assets are in `public/assets/` and are served from `/assets/`. The home-page terminal is `src/scripts/site.js`; it handles terminal commands, project cards, and certificate previews. `public/assets/js/theme.js` applies the saved theme and creates the theme toggle/back-to-top controls.

Install dependencies with `npm install`, run the dev server with `npm run dev`, build with `npm run build`, and preview the production output with `npm run preview`. Node.js 22.23.4 or newer is required.

## Route map

| URL | Astro source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Home, project carousel, terminal, skills, certifications, and contact |
| `/contact` | `src/pages/contact.astro` | Contact links and profile summary |
| `/notes` | `src/pages/notes/index.astro` | Searchable/filterable note directory (cards come from `src/data/notes.ts`) |
| `/notes/sql-injection` | `src/pages/notes/sql-injection.astro` | SQL fundamentals notes |
| `/notes/lab-metasploit` | `src/pages/notes/lab-metasploit.astro` | Metasploit reference |
| `/notes/linux-privesc-enum` | `src/pages/notes/linux-privesc-enum.astro` | Linux enumeration notes |
| `/writeups` | `src/pages/writeups/index.astro` | Searchable writeup directory with HackTheBox / TryHackMe filters (cards come from `src/data/writeups.ts`) |
| `/writeups/htb/touch-writeup` | `src/pages/writeups/htb/touch-writeup.astro` | HTB Touch article |
| `/writeups/thm/pickle-rick-writeup` | `src/pages/writeups/thm/pickle-rick-writeup.astro` | Pickle Rick article |
| `/writeups/thm/library-writeup` | `src/pages/writeups/thm/library-writeup.astro` | Library article |
| `/404` | `src/pages/404.astro` | Custom not-found page (Vercel serves it for unknown URLs) |
| `/projects/dos-dns-spoofing-presentation` | `src/pages/projects/dos-dns-spoofing-presentation.astro` | Interactive full-screen presentation |

Route directories and URLs are lowercase. Astro's `trailingSlash: 'never'` and directory output settings preserve these extensionless paths.

## Shared layout and page behavior

- `Base.astro` loads the portfolio styles and theme script by default. Page-specific global styles go in its `head` slot.
- `SiteNav.astro` renders the standard portfolio navigation or the compact article navigation. Use absolute lowercase URLs for internal links.
- `SiteFooter.astro` renders the standard footer or the article back-link/footer.
- The presentation disables portfolio styles, theme behavior, navigation, and footer to preserve its slide-deck viewport.
- The notes and writeups directories filter their cards in the browser; they do not fetch data. The notes filter buttons are generated from the categories present in `src/data/notes.ts`.
- The terminal script only initializes the interactive terminal when `#term-body`, `#term-out`, and `#term-in` are present.

## Adding a new writeup

1. Create the article page at `src/pages/writeups/<platform>/<name>-writeup.astro`, where `<platform>` is `htb` or `thm`. Copy an existing article such as `src/pages/writeups/thm/library-writeup.astro` and edit the content. Keep `backHref={withBase('/writeups')}`.
2. Put screenshots in `public/assets/img/writeups/<platform>/` and reference them with `withBase('/assets/img/writeups/<platform>/<file>.jpg')`. Remove any email address, IP you don't want public, or flag values from screenshots.
3. Add one object to the **end** of the array in `src/data/writeups.ts`:

   ```ts
   {
     platform: 'TryHackMe',            // 'HackTheBox' or 'TryHackMe'
     title: 'THM: Room Name',
     slug: 'thm/room-name-writeup',    // path under /writeups
     difficulty: 'easy',               // 'easy' | 'medium' | 'hard' | 'insane'
     desc: 'One or two sentences shown on the card.',
     tags: ['Tag one', 'Tag two']
   }
   ```

4. Run `npm run build`, then commit and push. The card appears on `/writeups` automatically. The home page shows the 3 entries at the end of the list, newest first, followed by the "Explore More Writeups" card, so always append new entries at the end.

Do not edit `src/pages/index.astro` or `src/pages/writeups/index.astro` to add a writeup.

## Adding a new note

1. Create the page at `src/pages/notes/<slug>.astro`. Copy an existing note such as `src/pages/notes/sql-injection.astro` for the layout and styles.
2. Add one object to the **end** of the array in `src/data/notes.ts`:

   ```ts
   {
     title: 'Note Title',
     slug: 'my-note',                  // path under /notes, matches the file name
     category: 'Web',                  // shown as the badge and used as a filter
     desc: 'One or two sentences shown on the card.',
     tags: ['Tag one', 'Tag two']
   }
   ```

3. Run `npm run build`, then commit and push. The card appears on `/notes` automatically, and a new category gets its own filter button. The home page shows the 3 latest notes plus the "Explore More Notes" card.

## Adding or changing pages

- Add Astro pages under `src/pages/` using lowercase route names. An `index.astro` inside a folder creates that folder's route.
- Use `Base.astro` for standard pages. Use `Article.astro` for writeups.
- Put images, stylesheets, and browser scripts under `public/assets/`; reference them with `withBase('/assets/...')`.
- Update internal links and the `PAGES` map in `src/scripts/site.js` whenever a route changes.
- Add project cards to the project array in `src/scripts/site.js` and place their previews under `public/assets/img/projects/thumbnails/`.
- Edit `public/assets/css/style.css` and `theme.css` for shared visual behavior; edit `public/assets/js/theme.js` for theme controls.

`dist/` and `graphify-out/` are generated output, not page source.

## Terminal hidden challenge

The home page terminal has a small CTF. The pieces live in `src/scripts/site.js`:

- `SECRET` is the base64 text printed by `cat .secret.txt` (visible only after `ls -a`). Decoding it gives a Caesar cipher (shift 3) of the flag.
- `FLAG_HASH` is the SHA-256 of the flag. Only the hash is stored, so the flag is not in the source. `submit <flag>` compares against it.
- `HINTS` is the list of clues printed one at a time by `hint`.

To change the flag: Caesar-shift its letters by +3, base64-encode the result into `SECRET`, and put the SHA-256 of the plain flag into `FLAG_HASH`.

## Updating the CV

The home page "Download CV" button links to `public/CV_Rachid_Chokrani.pdf`. To update it, replace that file keeping the same name. Before publishing, remove any phone number or home address from the PDF with real redaction (covering text with a box is not enough, the text stays inside the file).

## Images

Store images as WebP (quality about 80, max width 1600 px) under `public/assets/img/`. For every `<img>` add `width` and `height` (the real pixel size), `loading="lazy"` and `decoding="async"`, except for images at the very top of a page. Keep `public/og.png` as PNG, because social networks do not reliably read WebP for preview images.

