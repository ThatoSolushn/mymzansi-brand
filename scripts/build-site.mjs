#!/usr/bin/env node
/**
 * Builds the design system website into docs/.
 *
 * Static, multi-page, clean URLs, generated entirely from tokens.json.
 * Zero dependencies, no external requests, deployable to GitHub Pages by
 * pointing Pages at the docs/ folder on main.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './site/lib.mjs';
import { stylesheet } from './site/layout.mjs';
import { pages } from './site/pages.mjs';

const OUT = path.join(ROOT, 'docs');

mkdirSync(path.join(OUT, 'assets'), { recursive: true });
writeFileSync(path.join(OUT, 'assets/site.css'), stylesheet());

// GitHub Pages runs Jekyll by default, which skips files it does not expect.
writeFileSync(path.join(OUT, '.nojekyll'), '');

for (const p of pages) {
  const dest = path.join(OUT, p.path);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, p.html);
}

console.log(`Generated site → docs/ (${pages.length} pages)`);
for (const p of pages) console.log('  ' + p.path);
