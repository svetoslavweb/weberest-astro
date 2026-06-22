#!/usr/bin/env node
/**
 * Download blog images from legacy WordPress and rewrite markdown paths.
 * Usage: node scripts/sync-blog-images.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const UPLOADS_DIR = path.join(ROOT, 'public/images/uploads');
const WP_UPLOADS_BASE = 'https://www.weberest.com/bg/wp-content/uploads';
const LOCAL_PREFIX = '/bg/images/uploads';

const FEATURED_BY_SLUG = {
  'osnovi-na-seo-optimizaciata-za-google': '2016/01/Local-Video-SEO-Services.jpg',
  'nai-dobrite-saitove-za-imoti': '2024/08/realistimo-logo.png',
  'onlain-targovia-prez-2016-2017': '2018/04/cover.jpg',
  'kolko-struva-izrabotkata-na-online-magazin': '2025/10/kolko-struva-izrabotkata-na-online-magazin-cover.jpg',
  'naglasyane-phpstorm-wordpress': '2015/01/phpstorm-wordpress-cover.jpg',
};

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
      const raw = match[1].replace(/\\"/g, '"').split('?')[0];
      if (raw.startsWith('/')) continue;
      paths.add(decodeURIComponent(raw));
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

async function downloadFile(relativePath) {
  const dest = path.join(UPLOADS_DIR, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return { relativePath, status: 'skipped' };
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

function rewriteBlogFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const slugMatch = content.match(/^wpSlug:\s*"(.+?)"/m);
  const slug = slugMatch?.[1];

  if (slug && FEATURED_BY_SLUG[slug] && !content.match(/^featuredImage:/m)) {
    const featured = toLocalPath(FEATURED_BY_SLUG[slug]);
    content = content.replace(
      /^(featuredImageAlt:.*)$/m,
      `featuredImage: "${featured}"\n$1`,
    );
  }

  content = content.replace(
    /https?:\/\/(?:www\.)?weberest\.com\/bg\/wp-content\/uploads\/([^\s"'<>)\]]+)/gi,
    (_, uploadPath) => toLocalPath(decodeURIComponent(uploadPath.split('?')[0])),
  );

  content = content.replace(
    /featuredImage:\s*"\/images\/uploads\/([^"]+)"/g,
    (_, uploadPath) => `featuredImage: "${toLocalPath(uploadPath)}"`,
  );

  content = content.replace(
    /(\]\(\/images\/uploads\/)([^)]+)(\))/g,
    (_, start, uploadPath, end) => `${start.replace('/images/uploads/', '/bg/images/uploads/')}${uploadPath}${end}`,
  );

  content = content.replace(
    /!\[[^\]]*\]\(\/images\/uploads\/([^)]+)\)/g,
    (_, uploadPath) => `![](${toLocalPath(uploadPath)})`,
  );

  fs.writeFileSync(filePath, content);
}

async function main() {
  const blogFiles = fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith('.md'));
  const uploadPaths = new Set();

  for (const slugPath of Object.values(FEATURED_BY_SLUG)) {
    uploadPaths.add(slugPath);
  }

  for (const file of blogFiles) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    for (const uploadPath of extractUploadPaths(content)) {
      uploadPaths.add(uploadPath);
    }
  }

  const results = [];
  for (const relativePath of [...uploadPaths].sort()) {
    results.push(await downloadFile(relativePath));
  }

  for (const file of blogFiles) {
    rewriteBlogFile(path.join(BLOG_DIR, file));
  }

  const downloaded = results.filter((item) => item.status === 'downloaded');
  const skipped = results.filter((item) => item.status === 'skipped');
  const failed = results.filter((item) => item.status === 'failed');

  console.log(`Blog images: ${downloaded.length} downloaded, ${skipped.length} skipped, ${failed.length} failed`);
  for (const item of failed) {
    console.warn(`  FAIL ${item.relativePath} (${item.code}) ${item.url}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
