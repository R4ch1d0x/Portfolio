# Portfolio Audit — Full Analysis

> [!NOTE]
> This audit covers the entire portfolio project at `c:\Users\rachidch\Desktop\rachid\Portfolio` as of 2026-11-19. Issues are sorted by priority within each category.

> [!IMPORTANT]
> **Status update (2026-11-19, evening).** Checked against the latest project zip (Astro migration + "Blood on steel" palette). Hosting is **Vercel**, not GitHub Pages.
> Legend: ✅ done · 🔶 partly done · ⬜ still open · ➖ no longer applies.
>
> - **Done:** full Astro migration (no hybrid copy script, shared `SiteNav`/`SiteFooter`), lowercase routes, `withBase` paths, extensionless URLs, meta description, favicon, every `target="_blank"` has `rel="noopener noreferrer"`, GitHub link fixed, lockfile committed, Notes PNG duplicates removed, **Google Fonts now loaded with `preconnect` + `<link>` instead of `@import` (fixed in this pass)**.
> - **No longer applies:** GitHub Actions / `.nojekyll` / `dist/` deploy (1.3–1.5), SRI for Three.js (2.4, `lab-ddos` was removed).
> - **Next best picks:** 5.2 Open Graph tags, 5.4 `<main>` landmark and skip link, 6.5 `404` page, 6.4 case-study links, 4.1 image optimization.
> - Not re-verified: 4.5, 5.6, 5.10, 6.x layout items, 7.x code-quality items. They stay open until checked.

---

## Table of Contents

1. [Git & Deployment (GitHub Pages)](#1-git--deployment-github-pages)
2. [Security](#2-security)
3. [Architecture & Code Organization](#3-architecture--code-organization)
4. [Performance](#4-performance)
5. [SEO & Accessibility](#5-seo--accessibility)
6. [Design & UX](#6-design--ux)
7. [Code Quality](#7-code-quality)
8. [Content & Conception](#8-content--conception)
9. [Maintenance & Scalability](#9-maintenance--scalability)
10. [Summary Action Plan](#10-summary-action-plan)

---

## 1. Git & Deployment (GitHub Pages)

### 🔴 Critical

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 1.1 ✅ | **Uncommitted Astro migration** | `astro.config.mjs`, `package.json`, entire `src/` directory, and `scripts/` are **untracked**. The old HTML files (`Notes/sql-injection.html`, etc.) are marked **deleted** but the new Astro replacements aren't committed. If you push now, those pages will be missing online. | `git add` all new files (`astro.config.mjs`, `package.json`, `package-lock.json`, `scripts/`, `src/`) and commit. |
| 1.2 ⬜ | **`Portfolio.zip` (77 MB) is untracked** | A 77 MB zip file is sitting in the repo root. If accidentally committed, it bloats the repo permanently. | Add `Portfolio.zip` to `.gitignore` immediately. Never commit it. |
| 1.3 ➖ | **No GitHub Actions CI/CD for Astro** | Your site uses Astro (`npm run build`) but GitHub Pages doesn't run Node by default. You need a build workflow. | Add `.github/workflows/deploy.yml` that runs `npm ci && npm run build` and deploys `dist/` to GitHub Pages. |
| 1.4 ➖ | **`dist/` is gitignored** | Correct if using CI to build, but means GitHub Pages can't deploy from the repo directly — you **must** use GitHub Actions or deploy the `dist/` folder separately. | Use GitHub Actions deploy (recommended) or switch to deploying from a `gh-pages` branch. |
| 1.5 ➖ | **No `.nojekyll` file** | GitHub Pages runs Jekyll by default, which ignores folders starting with `_` and can interfere with the Astro build output. | Add an empty `.nojekyll` file to the `dist/` output (or configure the deploy workflow to include one). |

### 🟡 Important

| # | Issue | Fix |
|---|-------|-----|
| 1.6 ✅ | **`graphify-out/` not in `.gitignore`** | The `.gitignore` lists it, but verify it isn't already tracked. It's generated analysis data (21 files, 0.13 MB) — should never be committed. |
| 1.7 ✅ | **`.astro/` directory** | Already gitignored ✅ — good. |
| 1.8 ✅ | **`package-lock.json` should be committed** | It's currently untracked. CI builds need it for reproducible installs (`npm ci`). Commit it. |
| 1.9 ✅ | **`node_modules/` is in the repo directory** | Already gitignored ✅, but confirm it isn't tracked (`git ls-files node_modules` should return nothing). |

---

## 2. Security

### 🔴 Critical

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 2.1 ✅ | **Missing `rel="noopener noreferrer"` on external links** | Most `target="_blank"` links (LinkedIn, HTB on `index.html` and `contact.html`) lack `rel="noopener noreferrer"`. Only the TryHackMe link has it. This is a [tabnapping vulnerability](https://owasp.org/www-community/attacks/Reverse_Tabnapping). | Add `rel="noopener noreferrer"` to **every** `target="_blank"` link. |
| 2.2 ✅ | **Personal email exposed in plaintext** | Email is no longer in HTML or JS source; it is stored base64-encoded and revealed at runtime by `src/scripts/reveal-email.js`. | Done. For stronger protection, consider a contact form via Formspree/Netlify Forms. |

### 🟡 Important

| # | Issue | Fix |
|---|-------|-----|
| 2.3 ⬜ | **No Content Security Policy (CSP)** | The site loads Google Fonts and Three.js from CDN with no CSP headers or `<meta>` tag, leaving it open to injection if the CDN is compromised. | Add a `<meta http-equiv="Content-Security-Policy">` tag restricting `script-src`, `style-src`, and `font-src` to known origins. |
| 2.4 ➖ | **No Subresource Integrity (SRI)** | The Three.js CDN script in `lab-ddos.html` has no `integrity` attribute. If the CDN serves a tampered file, your visitors execute it. | Add `integrity="sha384-..."` and `crossorigin="anonymous"` to all CDN `<script>` tags. |
| 2.5 ⬜ | **`meta/prompt.txt` may leak internal prompts** | Contains an authoring prompt/template. If pushed to a public repo, it reveals internal tooling details. | Add `meta/` to `.gitignore` or remove sensitive content before pushing. |
| 2.6 ✅ | **Terminal input is not sanitized for display** | The terminal in `site.js` uses `textContent` (safe ✅) for most output, but `linkLine()` creates `<a>` elements with `href` from JS constants, which is controlled — **low risk** but worth noting if the terminal is extended to accept user-provided URLs. |

---

## 3. Architecture & Code Organization

### 🔴 Critical

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 3.1 ✅ | **Hybrid static+Astro architecture is fragile** | The project mixes raw HTML files with Astro-built pages, glued together by a custom `copy-legacy-site.mjs` script. This means two parallel systems, duplicated nav bars, duplicated footers, and risk of URL breakage. | **Migrate all pages to Astro** components/layouts. This eliminates the copy script, centralizes the nav/footer, and uses one build pipeline. |
| 3.2 ✅ | **Nav bar duplicated ~10 times** | Every HTML page has a hand-coded `<nav>` block. Changing a link means editing 10+ files. | Extract nav into an Astro component or use a shared HTML include system. |
| 3.3 ✅ | **Footer duplicated ~10 times** | Same problem as nav — the footer with copyright notice is copied into every page. | Same fix: Astro component. |

### 🟡 Important

| # | Issue | Fix |
|---|-------|-----|
| 3.4 ⬜ | **`site.js` hardcodes all page URLs** | The `PAGES` object at the top of `site.js` lists every navigable page. Adding content requires updating this map manually. | Generate the page map from Astro's content collections or a shared JSON data file. |
| 3.5 ⬜ | **Projects defined in JS, not data** | The project array in `site.js` (lines 34-62) mixes data and presentation logic. | Move project data to a JSON/YAML file or Astro content collection and render from the template. |
| 3.6 ✅ | **Case-sensitivity in paths** | `Notes/` uses uppercase, `writeups/` uses lowercase. GitHub Pages on Linux is case-sensitive; a link to `notes/` won't find `Notes/`. | Standardize all directories to lowercase (`notes/`, `writeups/`, `projects/`). |
| 3.7 ✅ | **Inconsistent asset loading** | `index.html` loads `assets/css/style.css` (root-relative), while `Notes/index.html` loads `../assets/css/style.css` (relative). This works but is error-prone. | Use Astro's built-in asset handling or a consistent `/assets/...` base path with a configured `base` in Astro. |

---

## 4. Performance

### 🔴 Critical

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 4.1 ⬜ | **No image optimization** | Certificate images are uncompressed JPEGs (168-349 KB each). Project screenshots are large PNGs. No WebP/AVIF variants, no `<picture>` elements, no `srcset` for responsive loading. | Convert images to WebP, provide `srcset` with multiple sizes, and use `<picture>` with fallback. Astro has a built-in `<Image>` component. |
| 4.2 ✅ | **Google Fonts blocking render** *(fixed: `@import` removed from `style.css`; `preconnect` + `<link>` added in `Base.astro`)* | `style.css` line 1 used `@import url(...)` for Google Fonts, which is render-blocking. The page can't paint until the font downloads. | Use `<link rel="preconnect">` + `<link rel="stylesheet">` in the `<head>` with `display=swap`, or self-host the font. |

### 🟡 Important

| # | Issue | Fix |
|---|-------|-----|
| 4.3 🔶 | **No CSS/JS minification (for static pages)** | Astro handles its own pages, but `style.css` (1474 lines), `theme.css`, `site.js`, and `theme.js` are served unminified for the legacy static pages. | Migrate everything to Astro (which bundles & minifies) or add a post-build minification step. |
| 4.4 ⬜ | **`DoS_DNS_Spoofing_Presentation.html` is 1268 lines of inline everything** | The presentation page has ~1000 lines of inline CSS, inline JS with canvas animations, and loads 3 Google Font families. It's a single monolithic file. | Consider splitting into external CSS/JS or using a presentation framework. At minimum, defer non-critical scripts. |
| 4.5 ⬜ | **No `loading="lazy"` on most images** | Only cert images have `loading="lazy"`. Project thumbnails (SVGs rendered by JS) and presentation screenshots don't. | Add `loading="lazy"` to all below-the-fold images. |
| 4.6 ✅ | **Notes page images (`arpspoof2.png`, `dnsspoof.png`) are duplicated** | `Notes/arpspoof2.png` (130 KB) and `Notes/dnsspoof.png` (92 KB) are identical files to `assets/img/projects/dos-dns-spoofing/arp-spoof-replies.png` and `dnsspoof-dns-query.png`. | Remove duplicates; reference the canonical copies under `assets/img/`. |

---

## 5. SEO & Accessibility

### 🔴 Critical

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 5.1 ✅ | **No `<meta name="description">` on any page** | Search engines won't have a summary to display in results. | Add a unique `<meta name="description" content="...">` to every page's `<head>`. |
| 5.2 ⬜ | **No Open Graph / Twitter Card tags** | When shared on LinkedIn, Twitter, or Discord, the preview will be blank or ugly — terrible for a portfolio. | Add `og:title`, `og:description`, `og:image`, `og:url`, and `twitter:card` meta tags. |
| 5.3 ✅ | **No favicon** | The browser tab shows a generic icon. Unprofessional for a portfolio site. | Create a favicon (`.ico`, `.png`, `.svg`) and add `<link rel="icon">` to every page. |
| 5.4 ⬜ | **No `<main>` landmark** | Screen readers can't identify the primary content area. The page uses `<div class="container">` as the main wrapper. | Replace the outer `<div class="container">` with `<main class="container">` or add a `<main>` wrapper. |
| 5.5 ⬜ | **No skip-to-content link** | Keyboard users must tab through the entire nav on every page load. | Add a visually-hidden "Skip to main content" `<a>` as the first element in `<body>`. |

### 🟡 Important

| # | Issue | Fix |
|---|-------|-----|
| 5.6 ⬜ | **No `<h1>` hierarchy in some pages** | `writeups/HTB/index.html` and `writeups/THM/index.html` have proper hierarchy, but the presentation page uses non-semantic heading levels. | Audit heading levels across all pages for proper semantic hierarchy. |
| 5.7 ✅ | **No `lang` attribute fallback** | All pages correctly have `lang="en"` ✅ — good. |
| 5.8 ⬜ | **No `sitemap.xml` or `robots.txt`** | Search engines won't discover all pages efficiently. | Generate a sitemap (Astro has `@astrojs/sitemap` integration) and add a `robots.txt`. |
| 5.9 ⬜ | **No canonical URLs** | Duplicate content issues if the site is accessible via multiple URLs (`www` vs non-`www`, trailing slashes). | Add `<link rel="canonical" href="...">` to every page. |
| 5.10 ⬜ | **Terminal input lacks visible focus indicator** | The terminal `<input>` has `outline: 0` with no custom focus replacement, failing WCAG 2.4.7. | Add a visible focus style (border-color change or box-shadow). |
| 5.11 🔶 | **Color contrast issues** | `--text-dim: #9a95a8` on `--bg: #0b0a10` has a contrast ratio of ~4.6:1 — passes AA for normal text but fails for small text (< 14px bold). Some labels use 10-11px font sizes. | Increase `--text-dim` brightness or increase minimum font sizes to 14px. |

---

## 6. Design & UX

### 🟡 Important

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 6.1 ⬜ | **No mobile hamburger menu** | On mobile (< 640px), the nav links horizontally overflow and scroll. This is functional but unconventional and easy to miss. | Add a hamburger/toggle menu for mobile viewports. |
| 6.2 ⬜ | **Carousel arrows clip on desktop** | `.projects-prev { left: -52px }` and `.projects-next { right: -52px }` position arrows outside the container, which clips on narrower screens. | Move arrows inside the carousel container or use CSS `calc()` with overflow-visible. |
| 6.3 ⬜ | **"Coming soon" placeholder card** | The dashed "More coming soon..." writeup card with `opacity:0.35; pointer-events:none` looks unfinished. | Remove it until there's real content, or give it a proper "Subscribe for updates" CTA. |
| 6.4 ⬜ | **Two of three project cards link back to `#projects`** | Projects 02 and 03 have `caseStudyUrl: 'index.html#projects'` — clicking "Read the case study" just scrolls back to the same section. Users expect actual content. | Either create case-study pages for these projects or disable/hide the link with a "Coming soon" label. |
| 6.5 ⬜ | **No 404 page** | A missing URL shows the browser/server default error. | Add a custom `404.html` page (GitHub Pages uses this automatically if present in root). |
| 6.6 ⬜ | **Terminal root prompt says `root@0xr4sh:~#`** | Using `root` and `#` implies running as root, which could be seen as bad security practice for a cybersecurity professional's portfolio. | Consider using a regular user prompt: `0xr4sh@portfolio:~$`. |
| 6.7 ⬜ | **No loading/transition animation between pages** | Navigation is instant HTML page loads — fine, but adding a subtle page transition (via View Transitions API or Astro's built-in transitions) would feel more polished. | Use Astro's `ViewTransitions` component. |

### 🟢 Nice to Have

| # | Issue | Fix |
|---|-------|-----|
| 6.8 ⬜ | **Category filter buttons on Notes index** | Cryptography, Reverse Engineering, OSINT, Forensics, Other — none of these categories have any notes yet. Showing empty categories feels incomplete. | Only show categories that have content, or add "0 notes" count. |
| 6.9 ⬜ | **Contact page doesn't include GitHub link** | The main `index.html` contact section has LinkedIn, HTB, and TryHackMe but `contact.html` omits TryHackMe and GitHub. | Synchronize social links across all contact sections. |

---

## 7. Code Quality

### 🟡 Important

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 7.1 ⬜ | **Duplicate CSS rules** | In `style.css`, `.project-case-link` color is declared twice (lines 713-716 and 719-721). `.term-line input { font-size: 16px; }` appears twice (lines 1429-1431 and 1465). `.terminal-body` has conflicting property sets (lines 1192-1196 vs 1450-1458). | Deduplicate and consolidate conflicting rules. |
| 7.2 ⬜ | **Inline styles scattered through HTML** | Multiple elements use `style="text-decoration:none;"`, `style="color:var(--accent);"`, `style="padding-top:0;"`, `style="opacity:0.35; pointer-events:none; border-style:dashed;"`. | Move all styles to CSS classes. |
| 7.3 ⬜ | **`var` used instead of `const`/`let` in JS** | Both `site.js` and `theme.js` use `var` throughout. This is ES5 — not a bug, but outdated for 2026. | Since you're already using ES modules in `astro.config.mjs`, modernize to `const`/`let`. |
| 7.4 ⬜ | **Command palette CSS exists but no code uses it** | `style.css` lines 1262-1386 define `.palette-btn`, `.pal`, `.pal-backdrop`, `.pal-list`, `.pal-item` etc. — a full command palette UI. But no HTML or JS in the project creates these elements. This is dead code. | Remove unused CSS or implement the command palette feature. |
| 7.5 ⬜ | **No code linting or formatting** | No `.editorconfig`, no `.prettierrc`, no ESLint config. | Add basic linting and formatting configs for consistency. |
| 7.6 ⬜ | **No `type="module"` on inline scripts** | Notes/index.html and other pages use `<script>` with IIFEs. Not a bug, but inconsistent with the `"type": "module"` in `package.json`. | Consider using module scripts for new code. |

---

## 8. Content & Conception

### 🟡 Important

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 8.1 ✅ | **Missing GitHub profile link** | For a portfolio intended to be on GitHub, there's no link to your actual GitHub profile anywhere on the main page. The terminal's `github` command links to `https://github.com/` (the homepage), not your profile. | Link to `https://github.com/R4ch1d0x` in the contact section and fix the terminal. |
| 8.2 ⬜ | **No resume/CV download** | Recruiters visiting a portfolio typically expect a downloadable PDF resume. | Add a "Download CV" button in the hero or contact section. |
| 8.3 ⬜ | **Education dates may confuse** | "ENSIASD (2025–2028)" as an engineering student, but earlier "DUT Génie Informatique — EST Safi" has no dates. | Add date range for DUT to give a complete timeline. |
| 8.4 ⬜ | **Two duplicate git commits** | `823ce45` and `140efbb` both say "Last changes before moving to react" — the commit messages suggest an abandoned React migration. | Clean up commit history before making the repo public (interactive rebase or fresh start). |
| 8.5 ⬜ | **XML listed as a "Language"** | XML is a markup language, not a programming language. Including it alongside C/C++ and Python looks odd. | Move XML to "Tools & Platforms" or remove it. Replace with JavaScript/TypeScript or HTML/CSS if relevant. |

---

## 9. Maintenance & Scalability

### 🟡 Important

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 9.1 ⬜ | **No content collection or data-driven pages** | Adding a new writeup requires editing 3-4 HTML files manually (`index.html`, `writeups/index.html`, `writeups/HTB/index.html`, plus creating the new page). | Use Astro content collections: write Markdown/MDX, and have cards auto-generated. |
| 9.2 ⬜ | **No testing** | No automated tests (HTML validation, link checking, lighthouse CI, visual regression). A broken link will go live unnoticed. | Add at minimum: `htmlhint` or `html-validate`, a link checker in CI, and Lighthouse CI for performance budgets. |
| 9.3 ⬜ | **Presentation page is a standalone monolith** | `DoS_DNS_Spoofing_Presentation.html` is 1268 lines with its own styling system (OCP green theme, viewport-locked 1920×1080 stage). It doesn't use the shared site layout. | This is acceptable if it's a one-off presentation export, but document it clearly. If more presentations are planned, create a reusable presentation layout. |
| 9.4 ⬜ | **`meta/` directory contains raw authoring material** | `htb-touch-writeup.md`, `pickle_rick_writeup.md`, and `prompt.txt` are source material. If the repo goes public, `prompt.txt` reveals internal prompt engineering. | Decide if `meta/` should be public. If not, add it to `.gitignore`. |

---

## 10. Summary Action Plan

### Before Going Live on GitHub Pages

> [!IMPORTANT]
> These must be done before deploying:

✅ 1. **Commit all Astro files** — `git add` the new `src/`, `scripts/`, `astro.config.mjs`, `package.json`, `package-lock.json`.
🔶 2. **Update `.gitignore`** — add `Portfolio.zip`, verify `meta/` policy, verify `graphify-out/` and `dist/` are ignored.
➖ 3. **Create a GitHub Actions workflow** — `.github/workflows/deploy.yml` to build and deploy `dist/` to GitHub Pages.
✅ 4. **Add `rel="noopener noreferrer"`** to all `target="_blank"` links.
🔶 5. **Add meta tags** — description, Open Graph, Twitter Cards on every page.
✅ 6. **Add a favicon**.
⬜ 7. **Add a `404.html` page**.
✅ 8. **Fix the GitHub link** in the terminal (`site.js`) to point to your actual profile.

### High-Priority Improvements

⬜ 9. **Optimize images** — convert to WebP, add `srcset`, `loading="lazy"`.
✅ 10. **Fix Google Fonts loading** — `<link>` with `preconnect` instead of CSS `@import`.
⬜ 11. **Add a CSP meta tag** for basic security headers.
⬜ 12. **Add skip-to-content link** and `<main>` landmark for accessibility.
✅ 13. **Standardize paths** to lowercase (`Notes/` → `notes/`).

### Medium-Term Refactoring

✅ 14. **Migrate all pages to Astro** — eliminate the `copy-legacy-site.mjs` hack and duplicated nav/footer.
⬜ 15. **Use Astro content collections** for writeups and notes.
⬜ 16. **Add a mobile hamburger menu**.
⬜ 17. **Remove dead CSS** (command palette, duplicate rules).
⬜ 18. **Clean up project cards** — either create case study pages or don't link "Read the case study" for incomplete projects.

---

> [!TIP]
> The quickest path to deployment: items 1–8 above are ~2 hours of work and get you a live, professional-looking portfolio on GitHub Pages. The rest can be done incrementally after launch.
