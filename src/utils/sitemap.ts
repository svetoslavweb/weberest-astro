import { getCollection } from 'astro:content';
import { getAllServiceSlugs } from '@config/service-details';

const SITE_URL = 'https://www.weberest.com';
const BASE_PATH = '/bg';

const RESERVED_PAGE_SLUGS = new Set([
  'home',
  'blog',
  'portfolio',
  'website-klienti',
  'sitemap',
  'zapitanie',
]);

const STATIC_PATHS = [
  '/',
  '/blog/',
  '/sitemap/',
  '/website-klienti/',
  '/zapitanie/',
];

function normalizeSlug(id: string): string {
  return id.replace(/\.md$/, '');
}

function absoluteUrl(path: string): string {
  const pathname = path === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
  return new URL(pathname, SITE_URL).href;
}

function uniqueSorted(paths: string[]): string[] {
  return [...new Set(paths)].sort((a, b) => a.localeCompare(b, 'bg'));
}

export async function getSitemapUrls(): Promise<string[]> {
  const [pages, blog, portfolio] = await Promise.all([
    getCollection('pages'),
    getCollection('blog'),
    getCollection('portfolio'),
  ]);

  const pagePaths = pages
    .filter((entry) => entry.id !== 'home')
    .map((entry) => entry.data.wpSlug ?? normalizeSlug(entry.id))
    .filter((slug) => !RESERVED_PAGE_SLUGS.has(slug))
    .map((slug) => `/${slug}/`);

  const blogPaths = blog.map((entry) => `/${entry.data.wpSlug ?? normalizeSlug(entry.id)}/`);
  const portfolioPaths = portfolio.map(
    (entry) => `/website-klienti/${entry.data.wpSlug ?? normalizeSlug(entry.id)}/`,
  );
  const servicePaths = getAllServiceSlugs().map((slug) => `/services/${slug}/`);

  return uniqueSorted([
    ...STATIC_PATHS,
    ...pagePaths,
    ...blogPaths,
    ...portfolioPaths,
    ...servicePaths,
  ]).map(absoluteUrl);
}

export function renderSitemapIndex(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `<sitemap><loc>${absoluteUrl('/sitemap-0.xml')}</loc></sitemap>`,
    '</sitemapindex>',
  ].join('');
}

export function renderUrlset(urls: string[]): string {
  const entries = urls.map((url) => `<url><loc>${url}</loc></url>`).join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
  ].join('');
}
