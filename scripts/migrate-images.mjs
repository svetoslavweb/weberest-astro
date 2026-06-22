#!/usr/bin/env node
/**
 * Copy WordPress uploads to Astro public folder.
 * Usage: node scripts/migrate-images.mjs [sourcePath]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SOURCE = path.resolve(ROOT, '../wp-content/uploads');
const TARGET = path.join(ROOT, 'public/images/uploads');

const source = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SOURCE;

function copyRecursive(from, to) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });
  let count = 0;

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);

    if (entry.isDirectory()) {
      count += copyRecursive(src, dest);
    } else if (/\.(jpe?g|png|gif|webp|svg|avif)$/i.test(entry.name)) {
      fs.copyFileSync(src, dest);
      count += 1;
    }
  }

  return count;
}

if (!fs.existsSync(source)) {
  console.warn(`Source not found: ${source}`);
  console.warn('Copy wp-content/uploads manually to public/images/uploads/');
  process.exit(0);
}

const copied = copyRecursive(source, TARGET);
console.log(`Copied ${copied} image files to ${TARGET}`);
