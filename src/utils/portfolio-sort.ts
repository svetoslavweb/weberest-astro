import type { CollectionEntry } from 'astro:content';

/** По-новите WordPress записи имат по-висок wpId */
export function sortPortfolioNewestFirst(
  items: CollectionEntry<'portfolio'>[],
): CollectionEntry<'portfolio'>[] {
  return [...items].sort((a, b) => {
    const dateA = a.data.pubDate?.valueOf() ?? 0;
    const dateB = b.data.pubDate?.valueOf() ?? 0;
    if (dateA !== dateB) return dateB - dateA;

    const idA = a.data.wpId ?? 0;
    const idB = b.data.wpId ?? 0;
    if (idA !== idB) return idB - idA;

    return a.data.title.localeCompare(b.data.title, 'bg');
  });
}
