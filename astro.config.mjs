import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://0xr4sh.vercel.app',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') && !page.includes('/projects/dos-dns-spoofing-presentation') })],
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' }
});
