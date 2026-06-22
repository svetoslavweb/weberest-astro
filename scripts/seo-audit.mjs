#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditPath = path.join(__dirname, '../data/seo-audit.json');
const contentDir = path.join(__dirname, '../src/content');

if (!fs.existsSync(auditPath)) {
  console.error('Run npm run migrate first.');
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const collections = ['pages', 'blog', 'portfolio'];

const titles = new Map();
for (const dir of collections) {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) continue;
  for (const file of fs.readdirSync(fullDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(fullDir, file), 'utf8');
    const titleMatch = raw.match(/^title:\s*(.+)$/m);
    const slug = file.replace(/\.md$/, '');
    if (titleMatch) titles.set(slug, titleMatch[1].replace(/^"|"$/g, ''));
  }
}

const mismatches = [];
for (const row of audit) {
  if (!row.indexable || !row.slug) continue;
  if (row.slug.includes('?') || row.slug.startsWith('scripts/')) continue;
  const expected = row.title;
  const actualSlug = row.slug.replace(/^website-klienti\//, '');
  const actual = titles.get(actualSlug);
  if (actual && actual !== expected) {
    mismatches.push({ slug: row.slug, expected, actual });
  }
}

console.log(`Checked ${audit.length} URLs`);
console.log(`Title mismatches: ${mismatches.length}`);
if (mismatches.length) {
  console.table(mismatches.slice(0, 20));
}
