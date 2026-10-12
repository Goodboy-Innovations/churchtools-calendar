/**
 * Copies the Vite build into the HubSpot module:
 *   dist/churchtools-calendar.iife.js        -> module.js
 *   dist/churchtools-calendar.css + themes/* -> module.css
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const moduleDir = resolve(root, 'hubspot/churchtools-calendar.module');
const themesDir = resolve(root, 'hubspot/themes');

const js = readFileSync(resolve(root, 'dist/churchtools-calendar.iife.js'), 'utf8');
const css = readFileSync(resolve(root, 'dist/churchtools-calendar.css'), 'utf8');
const themes = readdirSync(themesDir)
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(resolve(themesDir, file), 'utf8'));

writeFileSync(resolve(moduleDir, 'module.js'), js);
writeFileSync(resolve(moduleDir, 'module.css'), [css, ...themes].join('\n'));

console.log('HubSpot module updated: hubspot/churchtools-calendar.module');
