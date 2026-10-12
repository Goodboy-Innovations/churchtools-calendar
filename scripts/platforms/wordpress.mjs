/**
 * WordPress plugin: platforms/wordpress + the shared bundle in dist/.
 * Release: release/churchtools-calendar-wordpress-<version>.zip, installable from
 * WordPress (Plugins → Add New → Upload Plugin).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, readBundle, writeZip } from '../lib.mjs';

const pluginDir = resolve(root, 'platforms/wordpress');
const pluginFile = resolve(pluginDir, 'churchtools-calendar.php');

/** WordPress reads the version from the plugin header, so it is kept in sync with versions.json. */
export function setVersion(version) {
  const php = readFileSync(pluginFile, 'utf8')
    .replace(/^( \* Version:\s*).*$/m, `$1${version}`)
    .replace(/define\('CHURCHTOOLS_CALENDAR_VERSION', '[^']*'\)/, `define('CHURCHTOOLS_CALENDAR_VERSION', '${version}')`);
  writeFileSync(pluginFile, php);
}

export function versionedFiles() {
  return ['platforms/wordpress/churchtools-calendar.php'];
}

export function build(version) {
  const header = readFileSync(pluginFile, 'utf8').match(/^ \* Version:\s*(.*)$/m)?.[1].trim();
  if (header !== version) {
    throw new Error(`Plugin header says ${header}, versions.json says ${version}. Run the release script to bump versions.`);
  }

  const { js, css } = readBundle();
  const dir = 'churchtools-calendar';
  return writeZip(`churchtools-calendar-wordpress-${version}.zip`, {
    [`${dir}/churchtools-calendar.php`]: { from: pluginFile },
    [`${dir}/admin/settings.php`]: { from: resolve(pluginDir, 'admin/settings.php') },
    [`${dir}/dist/churchtools-calendar.iife.js`]: js,
    [`${dir}/dist/churchtools-calendar.css`]: css,
    [`${dir}/README.md`]: { from: resolve(root, 'README.md') },
    [`${dir}/docs/GUIDE.md`]: { from: resolve(root, 'docs/GUIDE.md') },
    [`${dir}/LICENSE`]: { from: resolve(root, 'LICENSE') },
  });
}
