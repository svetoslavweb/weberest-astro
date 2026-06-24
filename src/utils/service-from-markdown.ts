import type { CollectionEntry } from 'astro:content';
import type { ServiceDetail, ServiceDetailSection } from '@config/service-details';
import {
  getRelatedLinksForSlug,
  legacyServiceMeta,
  type LegacyServiceMeta,
} from '@config/legacy-service-meta';
import { getServiceImages, isUsableServiceImage } from '@config/service-images';

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdownNoise(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^R\s*$/gm, '')
    .replace(/^\[?\s*\]?\([^)]*\)\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractImages(body: string): string[] {
  const images: string[] = [];
  const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const url = match[1].trim();
    if (url && !url.includes('plus-icon')) images.push(url);
  }
  return images;
}

function extractListItems(block: string): string[] {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-•*]\s+/.test(line) || /^[-•*]\s/.test(line))
    .map((line) => decodeEntities(line.replace(/^[-•*]\s+/, '')))
    .filter((line) => line.length > 2 && line !== 'R');
}

function extractParagraphs(block: string): string[] {
  const withoutLists = block
    .split('\n')
    .filter((line) => !/^[-•*]\s+/.test(line.trim()) && line.trim() !== 'R')
    .join('\n');

  return stripMarkdownNoise(withoutLists)
    .split(/\n{2,}/)
    .map((p) => decodeEntities(p))
    .filter((p) => p.length > 40);
}

function cleanPageTitle(title: string): string {
  return title
    .replace(/\s*(?:\||-)\s*Weberest.*$/i, '')
    .replace(/\s*,\s*град Русе.*$/i, '')
    .replace(/\s*,\s*Русе.*$/i, '')
    .trim();
}

interface ParsedMarkdown {
  displayTitle?: string;
  intro: { title: string; paragraphs: string[] };
  benefits: { title: string; intro?: string; items: string[] };
  sections: ServiceDetailSection[];
  images: string[];
}

function parseServiceMarkdown(body: string): ParsedMarkdown {
  const cleaned = body.replace(/\r\n/g, '\n').trim();
  const images = extractImages(cleaned);
  const chunks = cleaned.split(/\n(?=#{1,2}\s)/);

  let introTitle = 'За услугата';
  let introParagraphs: string[] = [];
  const sections: ServiceDetailSection[] = [];
  let benefitsItems: string[] = [];
  let benefitsTitle = 'Ключови предимства';
  let displayTitle: string | undefined;

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^#{1,2}\s+(.+)$/m);
    const title = headingMatch ? decodeEntities(headingMatch[1].trim()) : '';
    const content = headingMatch ? trimmed.slice(headingMatch[0].length).trim() : trimmed;

    if (!headingMatch) {
      const lines = trimmed.split('\n').filter(Boolean);
      const firstLine = lines[0]?.trim() ?? '';
      if (firstLine.startsWith('# ')) {
        displayTitle = decodeEntities(firstLine.replace(/^#\s+/, ''));
        introParagraphs.push(...extractParagraphs(lines.slice(1).join('\n')));
      } else {
        introParagraphs.push(...extractParagraphs(trimmed));
      }
      const bullets = extractListItems(trimmed);
      if (bullets.length >= 3) benefitsItems = bullets;
      continue;
    }

    const paragraphs = extractParagraphs(content);
    const items = extractListItems(content);
    const sectionImages = extractImages(content);
    const lowerTitle = title.toLowerCase();

    if (
      items.length >= 4 &&
      (lowerTitle.includes('предимств') ||
        lowerTitle.includes('заложен') ||
        lowerTitle.includes('включва') ||
        lowerTitle.includes('дейност'))
    ) {
      benefitsTitle = title;
      benefitsItems = items;
      if (paragraphs.length) introParagraphs.push(...paragraphs);
      continue;
    }

    if (lowerTitle.includes('предимств') && items.length >= 2) {
      benefitsTitle = title;
      benefitsItems = items;
      continue;
    }

    if (!introParagraphs.length && paragraphs.length) {
      introTitle = title;
      introParagraphs = paragraphs;
      if (items.length >= 3) benefitsItems = items;
      continue;
    }

    sections.push({
      title,
      paragraphs: paragraphs.length ? paragraphs : items.length ? [] : [decodeEntities(stripMarkdownNoise(content))].filter((p) => p.length > 40),
      items: items.length ? items : undefined,
      image: sectionImages[0],
    });
  }

  if (!introParagraphs.length && sections.length) {
    const first = sections.shift()!;
    introTitle = first.title;
    introParagraphs = first.paragraphs;
    if (first.items?.length) benefitsItems = first.items;
  }

  return {
    displayTitle,
    intro: { title: introTitle, paragraphs: introParagraphs.slice(0, 4) },
    benefits: { title: benefitsTitle, items: benefitsItems.slice(0, 12) },
    sections: sections.filter((s) => s.paragraphs.length || s.items?.length),
    images,
  };
}

export function buildServiceDetailFromPage(
  entry: CollectionEntry<'pages'>,
  slug: string,
): ServiceDetail {
  const meta: LegacyServiceMeta = legacyServiceMeta[slug] ?? {
    icon: 'web',
    eyebrow: 'Weberest · Услуги',
    group: 'Услуги',
  };
  const stockImages = getServiceImages(meta.icon, slug);
  const parsed = parseServiceMarkdown(String(entry.body ?? ''));
  const pageTitle = cleanPageTitle(entry.data.title);
  const displayTitle = parsed.displayTitle ?? pageTitle;

  const usableMarkdownImages = parsed.images.filter(isUsableServiceImage);
  const heroImage = stockImages.hero;
  const introImage = stockImages.intro ?? stockImages.hero;

  const sections = parsed.sections.map((section, index) => ({
    ...section,
    image:
      (section.image && isUsableServiceImage(section.image) ? section.image : undefined) ??
      usableMarkdownImages[index] ??
      stockImages.sections[index % stockImages.sections.length],
  }));

  if (!sections.length && parsed.intro.paragraphs.length > 1) {
    const [lead, ...rest] = parsed.intro.paragraphs;
    parsed.intro.paragraphs = [lead];
    sections.push({
      title: 'Подробности',
      paragraphs: rest,
      image: introImage,
    });
  }

  return {
    id: slug,
    icon: meta.icon,
    title: displayTitle,
    metaTitle: entry.data.title,
    metaDescription: entry.data.description ?? '',
    eyebrow: meta.eyebrow,
    heroLead: entry.data.description ?? parsed.intro.paragraphs[0] ?? '',
    heroImage,
    canonicalPath: `/${slug}/`,
    intro: {
      ...parsed.intro,
      image: introImage,
      imageAlt: displayTitle,
    },
    benefits: parsed.benefits,
    sections,
    faq: [],
    relatedLinks: getRelatedLinksForSlug(slug),
  };
}
