import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://0xr4sh.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' }
});
