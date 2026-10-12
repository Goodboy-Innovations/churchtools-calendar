/**
 * Packages one platform (or all) from the shared bundle in dist/.
 *   node scripts/package.mjs wordpress|hubspot|all
 */

import { relative } from 'node:path';
import { root, readVersions } from './lib.mjs';
import { platforms, getPlatform } from './platforms/index.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Usage: node scripts/package.mjs <wordpress|hubspot|all>');
  process.exit(1);
}

const names = target === 'all' ? Object.keys(platforms) : [target];
const versions = readVersions();

try {
  for (const name of names) {
    const zip = getPlatform(name).build(versions[name]);
    console.log(`${name} ${versions[name]}: ${relative(root, zip)}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
