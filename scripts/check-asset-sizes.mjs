// Cloudflare Workers static assets reject files larger than 25 MiB.
// Fails the build if dist/ contains one, unless it is listed in .assetsignore
// (kept out of deploys; see MIGRATION-TODO.md), which only prints a warning.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const MAX_BYTES = 25 * 1024 * 1024;
const ignored = new Set(
  (await readFile(join(DIST, '.assetsignore'), 'utf8').catch(() => ''))
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
);

const walk = async (dir) => {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
};

const mib = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MiB`;

let failed = false;
for (const file of await walk(DIST)) {
  const { size } = await stat(file);
  if (size <= MAX_BYTES) continue;
  const path = relative(DIST, file).split(sep).join('/');
  if (ignored.has(path)) {
    console.warn(
      `⚠️  ${path} is ${mib(size)} (> 25 MiB) and is excluded from deploys by .assetsignore. See MIGRATION-TODO.md.`
    );
  } else {
    console.error(
      `✖ ${path} is ${mib(size)}; Cloudflare static assets are limited to 25 MiB per file.`
    );
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Asset size check passed.');
