import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const hex = {
  '#f04b38': '#ff3344', '#4fd6e0': '#9aa4b2', '#ff8a7a': '#ff7a85',
  '#0b0a10': '#0a0a0c', '#15131d': '#131316', '#08070e': '#070708',
  '#eae7f0': '#e6e4e1', '#9a95a8': '#8e8e98'
};

const files = [...walk('src'), ...walk('public')]
  .filter((f) => /\.(astro|css|svg|js|ts)$/.test(f));

for (const f of files) {
  let s = readFileSync(f, 'utf8');
  const o = s;
  s = s.replace(/rgba\(\s*240,\s*75,\s*56,/g, 'rgba(255, 51, 68,');
  s = s.replace(/rgba\(\s*79,\s*214,\s*224,/g, 'rgba(154, 164, 178,');
  for (const [a, b] of Object.entries(hex)) s = s.replace(new RegExp(a, 'gi'), b);
  if (s !== o) { writeFileSync(f, s); console.log('updated', f); }
}