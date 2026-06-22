#!/usr/bin/env node
/**
 * Sync portfolio categories from WordPress SQL dump.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SQL_PATH = path.resolve(ROOT, '../weberest_new.sql');
const PORTFOLIO_DIR = path.join(ROOT, 'src/content/portfolio');
const META_PATH = path.join(__dirname, 'portfolio-project-meta.json');

/** Ръчни корекции по ниша — заменят категориите от WordPress SQL */
const CATEGORY_OVERRIDES = Object.fromEntries(
  Object.entries(JSON.parse(fs.readFileSync(META_PATH, 'utf8'))).map(([wpId, meta]) => [
    Number(wpId),
    meta.categories,
  ]),
);

function decodeSlug(slug) {
  if (!slug.includes('%')) return slug;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function parseSql() {
  const sql = fs.readFileSync(SQL_PATH, 'utf8');

  const terms = {};
  const termsBlock = sql.match(/INSERT INTO `wp_terms`[\s\S]*?;/);
  for (const match of termsBlock[0].matchAll(/\((\d+), '((?:\\'|[^'])*)', '((?:\\'|[^'])*)',/g)) {
    terms[match[1]] = { name: match[2], slug: decodeSlug(match[3]) };
  }

  const taxonomy = {};
  const taxonomyBlock = sql.match(/INSERT INTO `wp_term_taxonomy`[\s\S]*?;/);
  for (const match of taxonomyBlock[0].matchAll(/\((\d+), (\d+), 'portfolio_category'/g)) {
    taxonomy[match[1]] = terms[match[2]].slug;
  }

  const relationships = {};
  const relBlock = sql.match(/INSERT INTO `wp_term_relationships`[\s\S]*?;/);
  for (const match of relBlock[0].matchAll(/\((\d+), (\d+), 0\)/g)) {
    const objectId = match[1];
    const taxonomyId = match[2];
    const slug = taxonomy[taxonomyId];
    if (!slug) continue;
    (relationships[objectId] ??= []).push(slug);
  }

  return relationships;
}

function updateMarkdownFile(filePath, categories) {
  let content = fs.readFileSync(filePath, 'utf8');
  const wpIdMatch = content.match(/^wpId:\s*(\d+)/m);
  if (!wpIdMatch) return { file: path.basename(filePath), status: 'no-wpId' };

  const yaml = categories.map((c) => `  - "${c}"`).join('\n');
  if (content.match(/^categories:\n(?:  - "[^"]+"\n)+/m)) {
    content = content.replace(/^categories:\n(?:  - "[^"]+"\n)+/m, `categories:\n${yaml}\n`);
  } else {
    content = content.replace(/^(---\n[\s\S]*?)(---)/m, `$1categories:\n${yaml}\n$2`);
  }

  fs.writeFileSync(filePath, content);
  return { file: path.basename(filePath), status: 'updated', categories };
}

const relationships = parseSql();
const files = fs.readdirSync(PORTFOLIO_DIR).filter((name) => name.endsWith('.md'));
const results = [];

for (const file of files) {
  const filePath = path.join(PORTFOLIO_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const wpIdMatch = content.match(/^wpId:\s*(\d+)/m);
  if (!wpIdMatch) continue;
  const categories = CATEGORY_OVERRIDES[Number(wpIdMatch[1])] ?? relationships[wpIdMatch[1]];
  if (!categories?.length) {
    results.push({ file, status: 'missing-in-sql' });
    continue;
  }
  results.push(updateMarkdownFile(filePath, [...new Set(categories)].sort()));
}

console.log(`Updated ${results.filter((r) => r.status === 'updated').length} portfolio files`);
for (const item of results.filter((r) => r.status !== 'updated')) {
  console.warn(`  ${item.status}: ${item.file}`);
}
