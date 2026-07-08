import type { CollectionEntry } from 'astro:content';

function portfolioSlug(item: CollectionEntry<'portfolio'>): string {
  return item.data.wpSlug ?? item.id;
}

/** По-новите WordPress записи имат по-висок wpId */
export function sortPortfolioNewestFirst(
  items: CollectionEntry<'portfolio'>[],
): CollectionEntry<'portfolio'>[] {
  return [...items].sort((a, b) => {
    const orderA = a.data.order ?? 0;
    const orderB = b.data.order ?? 0;
    if (orderA !== orderB) return orderA - orderB;

    const dateA = a.data.pubDate?.valueOf() ?? 0;
    const dateB = b.data.pubDate?.valueOf() ?? 0;
    if (dateA !== dateB) return dateB - dateA;

    const idA = a.data.wpId ?? 0;
    const idB = b.data.wpId ?? 0;
    if (idA !== idB) return idB - idA;

    return a.data.title.localeCompare(b.data.title, 'bg');
  });
}

/** Портфолио за началната страница — pinned проекти първи, после най-новите */
export function getHomePortfolioItems(
  items: CollectionEntry<'portfolio'>[],
  featuredSlugs: string[] = [],
  limit = 6,
  excludedSlugs: string[] = [],
): CollectionEntry<'portfolio'>[] {
  const excludedSet = new Set(excludedSlugs);
  const eligible = items.filter((item) => !excludedSet.has(portfolioSlug(item)));
  const sorted = sortPortfolioNewestFirst(eligible);
  const bySlug = new Map(sorted.map((item) => [portfolioSlug(item), item]));

  const featured = featuredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is CollectionEntry<'portfolio'> => Boolean(item));

  const featuredSet = new Set(featured.map(portfolioSlug));
  const rest = sorted.filter((item) => !featuredSet.has(portfolioSlug(item)));

  return [...featured, ...rest].slice(0, limit);
}
