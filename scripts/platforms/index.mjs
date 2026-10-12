/**
 * Every platform the shared calendar is released for. A platform module exports:
 *   setVersion(version)  write the version into platform files that need it
 *   versionedFiles()     files changed by setVersion/build, committed on release
 *   build(version)       package the release from dist/, returns the zip path
 * To add a platform, add a folder under platforms/ and a module here.
 */

import * as wordpress from './wordpress.mjs';
import * as hubspot from './hubspot.mjs';

export const platforms = { wordpress, hubspot };

export function getPlatform(name) {
  const platform = platforms[name];
  if (!platform) {
    throw new Error(`Unknown platform "${name}". Use one of: ${Object.keys(platforms).join(', ')}`);
  }
  return platform;
}
