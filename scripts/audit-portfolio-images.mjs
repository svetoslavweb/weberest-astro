#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORTFOLIO_DIR = path.join(ROOT, 'src/content/portfolio');
const UPLOADS_DIR = path.join(ROOT, 'public/images/uploads');

function fullFromThumb(relativePath) {
  return relativePath.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
}

const files = fs.readdirSync(PORTFOLIO_DIR).filter((name) => name.endsWith('.md'));
const refs = new Set();
const re = /\/bg\/images\/uploads\/([^\s"'<>)\]]+)/g;

for (const file of files) {
  const text = fs.readFileSync(path.join(PORTFOLIO_DIR, file), 'utf8');
  let match;
  while ((match = re.exec(text)) !== null) {
    refs.add(match[1].split('?')[0]);
  }
}

const allPaths = new Set(refs);
for (const relativePath of refs) {
  if (/-\d+x\d+\.[a-z0-9]+$/i.test(relativePath)) {
    allPaths.add(fullFromThumb(relativePath));
  }
}

const missing = [];
const present = [];

for (const relativePath of [...allPaths].sort()) {
  const dest = path.join(UPLOADS_DIR, ...relativePath.split('/'));
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    present.push(relativePath);
  } else {
    missing.push(relativePath);
  }
}

console.log(`Referenced: ${refs.size}, With full-size variants: ${allPaths.size}`);
console.log(`Present: ${present.length}, Missing: ${missing.length}`);
if (missing.length) {
  console.log('Missing:');
  for (const item of missing) console.log(`  ${item}`);
  process.exitCode = 1;
}
