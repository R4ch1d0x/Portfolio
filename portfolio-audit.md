# Portfolio Audit — Open Items

> [!NOTE]
> Remaining work for the portfolio (Astro, hosted on Vercel). Items that are finished or no longer apply have been removed. Last updated 2026-11-22.
>
> Legend: ⬜ still open · 🔶 partly done.

> [!IMPORTANT]
> **Done since the previous audit (removed from this list):** **Education section on the home page** (ENSIASD and EST Safi with dates), **Content Security Policy** (per-page `<meta>` with script hashes generated at build time, plus `frame-ancestors`, `nosniff` and referrer headers in `vercel.json`), **image optimization** (all images converted to WebP, about 60% smaller; `width`/`height`, `loading="lazy"` and `decoding="async"` added; `og.png` stays PNG for social crawlers), `<main id="main">` landmark and skip-to-content link on every page except the presentation deck, **CV download button** on the home page (`public/CV_Rachid_Chokrani.pdf`, phone number removed from the public copy), `robots.txt` and `sitemap-index.xml` (via `@astrojs/sitemap`), terminal rework (`ls` now opens sections, hidden CTF challenge with `hint` / `submit`), new R4 favicon (white fill, transparent inner holes), `cat education.txt` reformatted with dates, removal of the public `meta/` folder (the zip file was never in the repo), Astro migration with shared `SiteNav`/`SiteFooter`, lowercase routes, `withBase` paths, meta descriptions, favicon, `rel="noopener noreferrer"` on every external link, GitHub link, lockfile committed, duplicate Notes images removed, Google Fonts via `preconnect` + `<link>`, **email obfuscation** (base64 + runtime reveal), **Open Graph / Twitter Card tags with `og.png`**, **canonical URLs**, **custom 404 page**, **mobile hamburger menu**, **separate `/writeups` page with search and HackTheBox / TryHackMe filters** (the `/writeups/htb` and `/writeups/thm` index routes were removed), **writeup and note cards driven by `src/data/writeups.ts` and `src/data/notes.ts`** (with shared card components; the notes filter now shows only categories that have notes), **home page limited to the 3 latest writeups plus an "Explore more writeups" card** (the "More coming soon" placeholder is gone), **color-coded difficulty badges**, **nav background matched to the site background**, **rebrand to `0xR4sh`**, and a **synchronized set of social links** on the contact page.
>
> **No longer applies:** GitHub Actions / `.nojekyll` / `dist/` deploy (hosting is Vercel), SRI for Three.js (`lab-ddos` was removed).
>
> **Next best picks:** 6.4 case-study links.
>
> Not re-verified: 5.6, 5.10, 7.x items. They stay open until checked.

---

## Table of Contents

1. [Git & Repository](#1-git--repository)
2. [Security](#2-security)
3. [Architecture & Code Organization](#3-architecture--code-organization)
4. [Performance](#4-performance)
5. [SEO & Accessibility](#5-seo--accessibility)
6. [Design & UX](#6-design--ux)
7. [Code Quality](#7-code-quality)
8. [Content](#8-content)
9. [Maintenance & Scalability](#9-maintenance--scalability)
10. [Summary Action Plan](#10-summary-action-plan)

---

## 1. Git & Repository

No open items.

---|-------|---------|-----|
| 1.2 ⬜ | **`Portfolio.zip` (77 MB) is not in `.gitignore`** | If it is ever committed it bloats the repo permanently. `.gitignore` currently lists only `node_modules/`, `dist/`, `.astro/` and `graphify-out/`. | Add `Portfolio.zip` (and `*.zip`) to `.gitignore`. |

---

## 2. Security

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 2.7 ⬜ | **Old commits still contain the plaintext email** | The email was removed from the source, but it still exists in git history. | Only matters if you want it fully gone: rewrite history, or accept that the address is already public. A contact form (Formspree / Netlify Forms) would remove the need to publish it at all. |

---

## 3. Architecture & Code Organization

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 3.4 ⬜ | **`site.js` hardcodes all page URLs** | The `PAGES` object lists every navigable page. Adding content means editing it by hand. | Generate the map from `src/data/writeups.ts` or another shared data file. |
| 3.5 ⬜ | **Projects defined in JS, not data** | The project array in `site.js` mixes data and presentation logic. | Move project data to a JSON/TS file or an Astro content collection and render it from the template. |

---

## 4. Performance

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 4.3 🔶 | **`style.css` and `site.js` are not minified** | Astro minifies its own bundles, but `public/assets/css/style.css` (about 1500 lines), `theme.js` and `theme.css` are copied as-is. | Move the stylesheet into `src/` and import it so Astro bundles and minifies it. |
| 4.4 ⬜ | **Presentation page is a monolith** | `dos-dns-spoofing-presentation.astro` carries about a thousand lines of inline CSS and JS plus extra Google Font families. | Split into external CSS/JS, or at least defer non-critical scripts. |

---

## 5. SEO & Accessibility

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 5.6 ⬜ | **Heading hierarchy not audited** | The presentation page uses non-semantic heading levels. | Audit heading levels on every page. |
| 5.10 ⬜ | **Terminal input lacks a visible focus indicator** | The terminal `<input>` uses `outline: 0` with no replacement, failing WCAG 2.4.7. | Add a visible focus style (border color or box-shadow). |
| 5.11 🔶 | **Color contrast** | `--text-dim` on the dark background is borderline for small text, and several labels use 10–11px fonts. | Brighten `--text-dim` or raise the minimum font size to 12–14px. |

---

## 6. Design & UX

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 6.2 ⬜ | **Carousel arrows clip on narrow desktop screens** | `.projects-prev { left: -52px }` and `.projects-next { right: -52px }` sit outside the container. | Move the arrows inside the carousel or use `calc()` with visible overflow. |
| 6.4 ⬜ | **Two of three project cards link back to `#projects`** | Projects 02 and 03 have `caseStudyUrl: withBase('#projects')` in `site.js`, so "Read the case study" just scrolls to the same section. | Create case-study pages, or hide the link and show a "Coming soon" label. |
| 6.6 ⬜ | **Terminal prompt says `root@0xR4sh:~#`** | `root` and `#` imply running as root, which can look like poor security practice on a cybersecurity portfolio. | Use a regular user prompt such as `0xR4sh@portfolio:~$` (in `index.astro` and `site.js`). |
| 6.7 ⬜ | **No page transitions** | Navigation is an instant full page load. | Optional: use Astro's `ClientRouter` / View Transitions. |

---

## 7. Code Quality

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 7.1 ⬜ | **Duplicate / conflicting CSS rules** | `style.css` repeats `.project-case-link`, `.term-line input` and `.terminal-body` declarations. | Deduplicate and consolidate. |
| 7.2 ⬜ | **Inline styles in templates** | Many elements use `style="text-decoration:none;"`, `style="color:var(--accent);"`, `style="padding-top:0;"` and similar. | Move them to CSS classes. |
| 7.3 ⬜ | **`var` instead of `const`/`let`** | `site.js` and `theme.js` use ES5 `var` throughout. | Modernize to `const`/`let`. |
| 7.4 ⬜ | **Unused command-palette CSS** | `style.css` defines `.palette-btn`, `.pal*` and related rules, but nothing in the project creates those elements. | Remove the dead CSS or implement the feature. |
| 7.5 ⬜ | **No linting or formatting config** | No `.editorconfig`, Prettier or ESLint config. | Add basic configs for consistency. |

---

## 8. Content

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 8.4 ⬜ | **Duplicate commits from an abandoned React migration** | Commits `823ce45` and `140efbb` both say "Last changes before moving to react". | Clean up the history before promoting the repo, or leave it. |
| 8.5 ⬜ | **XML listed as a "Language"** | XML is a markup language, and it sits next to C/C++ and Python. | Move it to tools, or replace it with JavaScript/TypeScript or HTML/CSS. |

---

## 9. Maintenance & Scalability

| # | Issue | Details | Fix |
|---|-------|---------|-----|
| 9.2 ⬜ | **No automated checks** | No HTML validation, link checking or Lighthouse CI, so a broken link can go live unnoticed. | Add `html-validate` or `htmlhint`, a link checker, and Lighthouse CI. |
| 9.3 ⬜ | **Presentation page is a standalone monolith** | It has its own styling system and doesn't use the shared layout. | Fine for a one-off. Document it, or build a reusable presentation layout if more are planned. |

---

## 10. Summary Action Plan

### Quick wins (under an hour each)

⬜ 1. **Show a focus ring on the terminal input** (5.10).
⬜ 2. **Switch the terminal prompt to a non-root user** (6.6).

### High-priority improvements

⬜ 3. **Fix the project case-study links** (6.4).

### Medium-term refactoring

⬜ 4. **Move project data and the `PAGES` map out of `site.js`** (3.4, 3.5).
⬜ 5. **Bundle `style.css` through Astro; remove dead and duplicate CSS** (4.3, 7.1, 7.4).
⬜ 6. **Add linting and automated checks** (7.5, 9.2).
