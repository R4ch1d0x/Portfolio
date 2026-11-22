import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Adds a per-page Content-Security-Policy <meta> tag. Inline <script> blocks are
// allowed by SHA-256 hash (computed here at build time), so no 'unsafe-inline' for scripts.
function cspHashes() {
  const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
  async function* walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) yield* walk(p);
      else if (e.name.endsWith('.html')) yield p;
    }
  }
  return {
    name: 'csp-hashes',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        for await (const file of walk(fileURLToPath(dir))) {
          let html = await readFile(file, 'utf8');
          const hashes = new Set();
          for (const m of html.matchAll(INLINE_SCRIPT)) {
            if (m[1].trim()) hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
          }
          const policy = [
            "default-src 'self'",
            `script-src 'self' ${[...hashes].join(' ')}`.trim(),
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data:",
            "connect-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join('; ');
          html = html.replace(/<head([^>]*)>/, `<head$1><meta http-equiv="Content-Security-Policy" content="${policy}">`);
          await writeFile(file, html);
        }
      }
    }
  };
}

export default defineConfig({
  site: 'https://0xr4sh.vercel.app',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') && !page.includes('/projects/dos-dns-spoofing-presentation') }), cspHashes()],
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' }
});
