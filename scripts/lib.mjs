/**
 * Helpers shared by the package and release scripts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const releaseDir = resolve(root, 'release');

const versionsFile = resolve(root, 'versions.json');

export function readVersions() {
  return JSON.parse(readFileSync(versionsFile, 'utf8'));
}

export function writeVersion(platform, version) {
  const versions = readVersions();
  versions[platform] = version;
  writeFileSync(versionsFile, JSON.stringify(versions, null, 2) + '\n');
}

/** Reads the shared calendar bundle that `npm run build` writes to dist/. */
export function readBundle() {
  const js = resolve(root, 'dist/churchtools-calendar.iife.js');
  const css = resolve(root, 'dist/churchtools-calendar.css');
  if (!existsSync(js) || !existsSync(css)) {
    throw new Error('dist/ is missing. Run `npm run build` first.');
  }
  return { js: readFileSync(js, 'utf8'), css: readFileSync(css, 'utf8') };
}

/**
 * Writes a zip to release/<name>.
 * files maps the path inside the zip to a string, Buffer or a file path ({ from }).
 */
export function writeZip(name, files) {
  const entries = {};
  for (const [path, content] of Object.entries(files)) {
    const data = typeof content === 'object' && 'from' in content
      ? readFileSync(content.from)
      : content;
    entries[path] = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  }
  mkdirSync(releaseDir, { recursive: true });
  const out = resolve(releaseDir, name);
  writeFileSync(out, zipSync(entries, { level: 9 }));
  return out;
}
