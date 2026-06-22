#!/usr/bin/env node
/**
 * Copy portfolio images from legacy WordPress uploads and rewrite markdown paths.
 * Usage: node scripts/sync-portfolio-images.mjs [wpUploadsPath]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORTFOLIO_DIR = path.join(ROOT, 'src/content/portfolio');
const UPLOADS_DIR = path.join(ROOT, 'public/images/uploads');
const DEFAULT_WP_UPLOADS = path.resolve(ROOT, '../wp-content/uploads');
const WP_UPLOADS_BASE = 'https://www.weberest.com/bg/wp-content/uploads';
const LOCAL_PREFIX = '/bg/images/uploads';

const wpSource = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_WP_UPLOADS;

function normalizeUploadPath(raw) {
  let uploadPath = decodeURIComponent(raw.split('?')[0]);
  uploadPath = uploadPath.replace(/^\/bg\/images\/uploads\//, '');
  uploadPath = uploadPath.replace(/^\/images\/uploads\//, '');
  uploadPath = uploadPath.replace(/^images\/uploads\//, '');
  return uploadPath;
}

function extractUploadPaths(text) {
  const paths = new Set();
  const patterns = [
    /https?:\/\/(?:www\.)?weberest\.com\/bg\/wp-content\/uploads\/([^\s"'<>)\]]+)/gi,
    /\/bg\/images\/uploads\/([^\s"'<>)\]]+)/gi,
    /\/images\/uploads\/([^\s"'<>)\]]+)/gi,
    /featuredImage:\s*["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const raw = match[1].replace(/\\"/g, '"');
      if (raw.startsWith('http')) continue;
      paths.add(normalizeUploadPath(raw));
    }
  }

  return paths;
}

function toLocalPath(relativePath) {
  return `${LOCAL_PREFIX}/${relativePath}`;
}

function toRemoteUrl(relativePath) {
  return `${WP_UPLOADS_BASE}/${relativePath.split('/').map(encodeURIComponent).join('/').replace(/%2F/g, '/')}`;
}

function fullFromThumb(relativePath) {
  return relativePath.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
}

function collectUploadPaths(text) {
  const paths = new Set(extractUploadPaths(text));
  for (const relativePath of [...paths]) {
    if (/-\d+x\d+\.[a-z0-9]+$/i.test(relativePath)) {
      paths.add(fullFromThumb(relativePath));
    }
  }
  return paths;
}

async function ensureFile(relativePath) {
  const dest = path.join(UPLOADS_DIR, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return { relativePath, status: 'skipped' };
  }

  const localSource = path.join(wpSource, ...relativePath.split('/'));
  if (fs.existsSync(localSource) && fs.statSync(localSource).size > 0) {
    fs.copyFileSync(localSource, dest);
    return { relativePath, status: 'copied', bytes: fs.statSync(dest).size };
  }

  const url = toRemoteUrl(relativePath);
  const response = await fetch(url);
  if (!response.ok) {
    return { relativePath, status: 'failed', url, code: response.status };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return { relativePath, status: 'downloaded', bytes: buffer.length };
}

function rewritePortfolioFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /https?:\/\/(?:www\.)?weberest\.com\/bg\/wp-content\/uploads\/([^\s"'<>)\]]+)/gi,
    (_, uploadPath) => toLocalPath(decodeURIComponent(uploadPath.split('?')[0])),
  );

  content = content.replace(
    /featuredImage:\s*"\/bg\/images\/uploads\/([^"]+)"/g,
    (_, uploadPath) => `featuredImage: "${toLocalPath(uploadPath)}"`,
  );

  content = content.replace(
    /featuredImage:\s*"\/images\/uploads\/([^"]+)"/g,
    (_, uploadPath) => `featuredImage: "${toLocalPath(uploadPath)}"`,
  );

  fs.writeFileSync(filePath, content);
}

async function main() {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.error(`Portfolio directory not found: ${PORTFOLIO_DIR}`);
    process.exit(1);
  }

  const portfolioFiles = fs.readdirSync(PORTFOLIO_DIR).filter((name) => name.endsWith('.md'));
  const uploadPaths = new Set();

  for (const file of portfolioFiles) {
    const content = fs.readFileSync(path.join(PORTFOLIO_DIR, file), 'utf8');
    for (const uploadPath of collectUploadPaths(content)) {
      uploadPaths.add(uploadPath);
    }
  }

  const results = [];
  for (const relativePath of [...uploadPaths].sort()) {
    results.push(await ensureFile(relativePath));
  }

  for (const file of portfolioFiles) {
    rewritePortfolioFile(path.join(PORTFOLIO_DIR, file));
  }

  const copied = results.filter((item) => item.status === 'copied');
  const downloaded = results.filter((item) => item.status === 'downloaded');
  const skipped = results.filter((item) => item.status === 'skipped');
  const failed = results.filter((item) => item.status === 'failed');

  console.log(
    `Portfolio images: ${copied.length} copied, ${downloaded.length} downloaded, ${skipped.length} skipped, ${failed.length} failed`,
  );
  for (const item of failed) {
    console.warn(`  FAIL ${item.relativePath} (${item.code}) ${item.url ?? ''}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
