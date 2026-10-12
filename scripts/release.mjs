/**
 * Bumps one platform's version, builds it, commits and tags <platform>-v<version>.
 *   node scripts/release.mjs wordpress|hubspot patch|minor|major|<x.y.z>
 * Pushing the tag makes GitHub Actions publish a GitHub Release with the zip.
 */

import { execSync } from 'node:child_process';
import { root, readVersions, writeVersion } from './lib.mjs';
import { getPlatform } from './platforms/index.mjs';

const [name, bump] = process.argv.slice(2);
if (!name || !bump) {
  console.error('Usage: node scripts/release.mjs <wordpress|hubspot> <patch|minor|major|x.y.z>');
  process.exit(1);
}

const run = (command) => execSync(command, { cwd: root, stdio: 'inherit' });
const output = (command) => execSync(command, { cwd: root, encoding: 'utf8' }).trim();

function nextVersion(current, bump) {
  if (/^\d+\.\d+\.\d+$/.test(bump)) return bump;
  const [major, minor, patch] = current.split('.').map(Number);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  if (bump === 'patch') return `${major}.${minor}.${patch + 1}`;
  throw new Error(`Unknown bump "${bump}"`);
}

try {
  const platform = getPlatform(name);
  if (output('git status --porcelain')) {
    throw new Error('Working tree has uncommitted changes. Commit or stash them first.');
  }

  const version = nextVersion(readVersions()[name], bump);
  const tag = `${name}-v${version}`;
  if (output(`git tag --list ${tag}`)) {
    throw new Error(`Tag ${tag} already exists.`);
  }

  writeVersion(name, version);
  platform.setVersion(version);
  run(`npm run build:${name}`);

  run(`git add versions.json ${platform.versionedFiles().join(' ')}`);
  run(`git commit -m "Release ${name} ${version}"`);
  run(`git tag -a ${tag} -m "${name} ${version}"`);

  console.log(`\nTagged ${tag}. Publish it with:\n  git push origin HEAD ${tag}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
