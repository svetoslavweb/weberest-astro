#!/usr/bin/env node
/**
 * WordPress SQL -> Astro content migration
 * Usage: node scripts/migrate-wordpress.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SQL_PATH = path.resolve(ROOT, '../weberest_new.sql');
const CSV_PATH = path.resolve(process.env.HOME || process.env.USERPROFILE || '', 'Desktop/page_titles_all.csv');
const CSV_FALLBACK = 'C:/Users/Weberest/Desktop/page_titles_all.csv';

const CONTENT_DIR = path.join(ROOT, 'src/content');
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');

const SERVICE_SLUGS = new Set([
  'web-design',
  'sazdavane-elektronen-magazin',
  'web-mobile-development',
  'internet-marketing',
  'spodelen-hosting-ruse',
  'ueb-internet-dizain-ruse',
  'obnoviavane-web-sait',
  'poddrujka-administranicq-web-site',
  'izrabotka-logo',
  'razrabotka-prilojeniq-android',
  'sazdavane-internet-stranica',
  'registracia-sait-adres-domain',
  'shabloni-internet-websites',
  'adaptiven-web-dizain',
  'internet-reklama-google',
  'search-engine-optimization',
  'seo-konsultacia',
  'easyemall',
  'izrabotka-hotelski-sait',
  'izrabotka-website-restoranti',
  'izrabotka-website-nedvijimi-imoti',
  'izrabotvane-blog',
]);

const REMOVED_PAGE_SLUGS = new Set(['evtin-sait']);

function readFileSafe(filePath, fallback) {
  const target = fs.existsSync(filePath) ? filePath : fallback;
  if (!fs.existsSync(target)) {
    throw new Error(`File not found: ${target}`);
  }
  return fs.readFileSync(target, 'utf8');
}

function unescapeSqlValue(value) {
  return value
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

function parseSqlInsertBlocks(sql, tableName) {
  const regex = new RegExp(
    `INSERT INTO \`${tableName}\`\\s*\\(([^)]+)\\)\\s*VALUES\\s*`,
    'gi',
  );
  const rows = [];
  let match;

  while ((match = regex.exec(sql)) !== null) {
    const columns = match[1]
      .split(',')
      .map((col) => col.trim().replace(/`/g, ''));
    let i = regex.lastIndex;
    let depth = 0;
    let inString = false;
    let escape = false;
    let tuple = '';
    const tuples = [];

    while (i < sql.length) {
      const char = sql[i];
      tuple += char;

      if (escape) {
        escape = false;
      } else if (char === '\\' && inString) {
        escape = true;
      } else if (char === "'" && !escape) {
        inString = !inString;
      } else if (!inString) {
        if (char === '(') depth += 1;
        if (char === ')') depth -= 1;
        if (depth === 0 && char === ')') {
          tuples.push(tuple.trim());
          tuple = '';
          i += 1;
          while (i < sql.length && /[\s,]/.test(sql[i])) i += 1;
          if (sql[i] === ';') break;
          continue;
        }
      }
      i += 1;
    }

    regex.lastIndex = i + 1;

    for (const rawTuple of tuples) {
      const inner = rawTuple.slice(1, -1);
      const values = splitSqlValues(inner);
      const row = {};
      columns.forEach((col, index) => {
        row[col] = parseSqlScalar(values[index]);
      });
      rows.push(row);
    }
  }

  return rows;
}

function splitSqlValues(tuple) {
  const values = [];
  let current = '';
  let inString = false;
  let escape = false;

  for (let i = 0; i < tuple.length; i += 1) {
    const char = tuple[i];

    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\' && inString) {
      current += char;
      escape = true;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      current += char;
      continue;
    }

    if (char === ',' && !inString) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) values.push(current.trim());
  return values;
}

function parseSqlScalar(raw) {
  if (raw == null) return null;
  const value = raw.trim();
  if (value.toUpperCase() === 'NULL') return null;
  if (value.startsWith("'") && value.endsWith("'")) {
    return unescapeSqlValue(value.slice(1, -1));
  }
  if (/^-?\d+$/.test(value)) return Number(value);
  return value;
}

function stripShortcodes(html) {
  return html
    .replace(/\[\/?\w[^\]]*\]/g, ' ')
    .replace(/\{[^}]+\}/g, ' ');
}

function cleanWordPressHtml(html) {
  if (!html) return '';

  let cleaned = html;
  cleaned = stripShortcodes(cleaned);
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  cleaned = cleaned.replace(/\sclass="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sid="[^"]*"/gi, '');
  cleaned = cleaned.replace(/<div[^>]*>/gi, '\n');
  cleaned = cleaned.replace(/<\/div>/gi, '\n');
  cleaned = cleaned.replace(/<span[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/span>/gi, '');
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<p[^>]*>/gi, '\n\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n');
  cleaned = cleaned.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n');
  cleaned = cleaned.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n');
  cleaned = cleaned.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n');
  cleaned = cleaned.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  cleaned = cleaned.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  cleaned = cleaned.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  cleaned = cleaned.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  cleaned = cleaned.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  cleaned = cleaned.replace(/<ul[^>]*>/gi, '\n');
  cleaned = cleaned.replace(/<\/ul>/gi, '\n');
  cleaned = cleaned.replace(/<ol[^>]*>/gi, '\n');
  cleaned = cleaned.replace(/<\/ol>/gi, '\n');
  cleaned = cleaned.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  cleaned = cleaned.replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  cleaned = cleaned.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '![]($1)');
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]+\n/g, '\n');
  cleaned = cleaned.replace(/https:\/\/www\.weberest\.com\/bg\/([^)\s"']+)\.htm/g, '/bg/$1/');
  return cleaned.trim();
}

function yamlEscape(value) {
  if (value == null) return '""';
  const str = String(value).replace(/\r?\n/g, ' ').trim();
  if (!str) return '""';
  return JSON.stringify(str);
}

function writeMarkdown(filePath, frontmatter, body) {
  const fm = Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((item) => `  - ${yamlEscape(item)}`).join('\n')}`;
      }
      if (typeof value === 'boolean' || typeof value === 'number') {
        return `${key}: ${value}`;
      }
      return `${key}: ${yamlEscape(value)}`;
    })
    .join('\n');

  const content = `---\n${fm}\n---\n\n${body.trim()}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.replace(/^"|"$/g, '') ?? '';
    });
    return row;
  });
}

function slugFromUrl(url) {
  return url
    .replace('https://www.weberest.com/bg/', '')
    .replace(/\/$/, '')
    .replace(/^website-klienti\//, '');
}

function ensureDirs() {
  for (const dir of ['pages', 'blog', 'portfolio', 'services', 'faq']) {
    const full = path.join(CONTENT_DIR, dir);
    if (fs.existsSync(full)) {
      for (const file of fs.readdirSync(full)) {
        if (file.endsWith('.md')) fs.unlinkSync(path.join(full, file));
      }
    } else {
      fs.mkdirSync(full, { recursive: true });
    }
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function main() {
  console.log('Reading SQL dump...');
  const sql = readFileSafe(SQL_PATH, path.join(ROOT, 'weberest_new.sql'));
  ensureDirs();

  const posts = parseSqlInsertBlocks(sql, 'wp_posts');
  const postmetaRows = parseSqlInsertBlocks(sql, 'wp_postmeta');
  const terms = parseSqlInsertBlocks(sql, 'wp_terms');
  const termTaxonomy = parseSqlInsertBlocks(sql, 'wp_term_taxonomy');
  const termRelationships = parseSqlInsertBlocks(sql, 'wp_term_relationships');
  const options = parseSqlInsertBlocks(sql, 'wp_options');

  const postmeta = new Map();
  for (const row of postmetaRows) {
    const id = Number(row.post_id);
    if (!postmeta.has(id)) postmeta.set(id, {});
    postmeta.get(id)[row.meta_key] = row.meta_value;
  }

  const taxonomyById = new Map(termTaxonomy.map((row) => [Number(row.term_taxonomy_id), row]));
  const termById = new Map(terms.map((row) => [Number(row.term_id), row]));

  const postTerms = new Map();
  for (const rel of termRelationships) {
    const objectId = Number(rel.object_id);
    const tax = taxonomyById.get(Number(rel.term_taxonomy_id));
    if (!tax) continue;
    const term = termById.get(Number(tax.term_id));
    if (!term) continue;
    if (!postTerms.has(objectId)) postTerms.set(objectId, []);
    postTerms.get(objectId).push({
      taxonomy: tax.taxonomy,
      slug: term.slug,
      name: term.name,
    });
  }

  const attachments = new Map();
  for (const post of posts) {
    if (post.post_type === 'attachment') {
      const meta = postmeta.get(Number(post.ID)) || {};
      attachments.set(Number(post.ID), {
        file: meta._wp_attachment_metadata ? extractAttachedFile(meta) : meta._wp_attached_file,
        alt: meta._wp_attachment_image_alt || post.post_title,
        url: post.guid,
      });
    }
  }

  function extractAttachedFile(meta) {
    return meta._wp_attached_file || '';
  }

  function getFeaturedImage(postId) {
    const meta = postmeta.get(Number(postId)) || {};
    const thumbId = Number(meta._thumbnail_id);
    if (!thumbId) return null;
    const attachment = attachments.get(thumbId);
    if (!attachment?.file) return null;
    return `/images/uploads/${attachment.file.replace(/\\/g, '/')}`;
  }

  function getSeo(postId) {
    const meta = postmeta.get(Number(postId)) || {};
    return {
      title: meta._yoast_wpseo_title || '',
      description: meta._yoast_wpseo_metadesc || '',
    };
  }

  function getBody(post) {
    const meta = postmeta.get(Number(post.ID)) || {};
    const source =
      meta._et_pb_truncate_post ||
      meta._et_pb_old_content ||
      post.post_content ||
      '';
    return cleanWordPressHtml(source);
  }

  const csvRaw = readFileSafe(CSV_PATH, CSV_FALLBACK);
  const csvRows = parseCsv(csvRaw);
  const seoByPath = new Map();
  for (const row of csvRows) {
    const slugPath = slugFromUrl(row.Address);
    if (slugPath && !row.Address.includes('?')) {
      seoByPath.set(slugPath, row);
    }
  }

  const published = posts.filter(
    (post) => post.post_status === 'publish' && !['revision', 'nav_menu_item', 'custom_css', 'customize_changeset', 'oembed_cache', 'wp_block', 'acf-field', 'acf-field-group'].includes(post.post_type),
  );

  const report = {
    pages: 0,
    blog: 0,
    portfolio: 0,
    services: 0,
    skipped: [],
    redirects: [],
  };

  const exportItems = [];

  for (const post of published) {
    const id = Number(post.ID);
    const slug = decodeURIComponent(post.post_name);
    const seo = getSeo(id);
    const csvSeo = seoByPath.get(slug) || seoByPath.get(`website-klienti/${slug}`);
    const title = seo.title || csvSeo?.['Title 1'] || post.post_title;
    const description = seo.description || post.post_excerpt || '';
    const body = getBody(post);
    const featuredImage = getFeaturedImage(id);
    const termsForPost = postTerms.get(id) || [];

    const itemBase = {
      id,
      slug,
      title,
      description,
      type: post.post_type,
      date: post.post_date,
      modified: post.post_modified,
      featuredImage,
      terms: termsForPost,
      seo,
    };

    if (post.post_type === 'page') {
      if (REMOVED_PAGE_SLUGS.has(slug)) continue;

      const isHome = slug === 'home' || Number(post.ID) === 98;
      const targetDir = 'pages';
      const fileName = isHome ? 'home.md' : `${slug}.md`;
      const showQuoteForm = ['web-design', 'internet-marketing', 'sazdavane-elektronen-magazin', 'it-konsultacia'].includes(slug);

      writeMarkdown(path.join(CONTENT_DIR, targetDir, fileName), {
        title,
        description,
        template: slug.includes('policy') || slug.includes('uslovi') ? 'legal' : 'default',
        showQuoteForm,
        wpId: id,
        wpSlug: slug,
        wpUrl: `/${slug}/`,
        featuredImage,
      }, body || post.post_title);
      exportItems.push({ ...itemBase, url: `/bg/${slug}/`, collection: 'pages' });
      report.pages += 1;

      if (SERVICE_SLUGS.has(slug)) {
        writeMarkdown(path.join(CONTENT_DIR, 'services', `${slug}.md`), {
          title,
          description,
          excerpt: description,
          order: Number(post.menu_order) || 0,
          wpId: id,
          wpSlug: slug,
        }, body || post.post_title);
        report.services += 1;
      }
      continue;
    }

    if (post.post_type === 'post') {
      const categories = termsForPost.filter((t) => t.taxonomy === 'category').map((t) => t.name);
      writeMarkdown(path.join(CONTENT_DIR, 'blog', `${slug}.md`), {
        title,
        description,
        pubDate: post.post_date,
        author: 'Weberest',
        category: categories[0] || 'Новини',
        featuredImage,
        featuredImageAlt: post.post_title,
        wpId: id,
        wpSlug: slug,
      }, body || post.post_title);
      exportItems.push({ ...itemBase, url: `/bg/${slug}/`, collection: 'blog' });
      report.blog += 1;
      continue;
    }

    if (post.post_type === 'portfolio') {
      const categories = termsForPost
        .filter((t) => t.taxonomy === 'portfolio_category')
        .map((t) => t.slug);
      writeMarkdown(path.join(CONTENT_DIR, 'portfolio', `${slug}.md`), {
        title,
        description,
        client: post.post_title,
        categories,
        featuredImage,
        featuredImageAlt: post.post_title,
        order: Number(post.menu_order) || 0,
        wpId: id,
        wpSlug: slug,
      }, body || post.post_title);
      exportItems.push({ ...itemBase, url: `/bg/website-klienti/${slug}/`, collection: 'portfolio' });
      report.portfolio += 1;
      continue;
    }

    report.skipped.push({ id, slug, type: post.post_type });
  }

  const redirects = [];
  for (const item of exportItems) {
    const base = item.url.replace(/\/$/, '');
    redirects.push({ from: `${base}.htm`, to: item.url });
  }

  for (const row of csvRows) {
    const url = row.Address;
    if (!url.includes('weberest.com/bg/')) continue;

    if (url.includes('.htm')) {
      redirects.push({ from: url.replace('https://www.weberest.com', ''), to: url.replace('.htm', '/').replace('https://www.weberest.com', '') });
    }

    if (url.includes('scripts/contact-form.php')) {
      redirects.push({ from: '/bg/scripts/contact-form.php', to: '/bg/zapitanie/' });
    }

    if (url.includes('?vp_')) {
      const canonical = '/bg/website-klienti/';
      redirects.push({ from: url.replace('https://www.weberest.com', ''), to: canonical });
    }

    if (url.includes('/author/')) {
      redirects.push({ from: url.replace('https://www.weberest.com', ''), to: '/bg/blog/' });
    }

    if (url.includes('/category/')) {
      redirects.push({ from: url.replace('https://www.weberest.com', ''), to: '/bg/blog/' });
    }
  }

  const uniqueRedirects = [...new Map(redirects.map((r) => [r.from, r])).values()];
  report.redirects = uniqueRedirects;

  const redirectLines = uniqueRedirects.map((r) => `${r.from} ${r.to} 301`);
  fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), redirectLines.join('\n') + '\n', 'utf8');

  const seoAudit = csvRows.map((row) => ({
    url: row.Address,
    title: row['Title 1'],
    indexable: row.Indexability === 'Indexable',
    status: row['Indexability Status'],
    slug: slugFromUrl(row.Address),
  }));
  fs.writeFileSync(path.join(DATA_DIR, 'wordpress-export.json'), JSON.stringify(exportItems, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'seo-audit.json'), JSON.stringify(seoAudit, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'redirects.json'), JSON.stringify(uniqueRedirects, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'migration-report.json'), JSON.stringify(report, null, 2));

  writeMarkdown(
    path.join(CONTENT_DIR, 'faq', '_placeholder.md'),
    { question: 'Placeholder', order: 0, category: 'general' },
    'FAQ entries are rendered from the ЧЗВ page.',
  );

  console.log('Migration complete:', report);
}

main();
