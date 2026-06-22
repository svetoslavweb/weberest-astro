export interface PortfolioGalleryItem {
  thumb: string;
  full: string;
}

export interface PortfolioTechItem {
  icon: string;
  title: string;
  description: string;
}

export interface PortfolioSection {
  heading: string;
  bullets: string[];
  paragraphs: string[];
  images: string[];
  links: { label: string; href: string }[];
}

export interface ParsedPortfolioCase {
  gallery: PortfolioGalleryItem[];
  techStack: PortfolioTechItem[];
  liveUrl: string | null;
  liveLabel: string | null;
  sections: PortfolioSection[];
}

export function getPortfolioDisplayTitle(title: string, client?: string): string {
  if (client?.trim()) return client.trim();
  return title.replace(/\s*-\s*Weberest\s*$/i, '').trim();
}

function nextNonEmptyLine(
  lines: string[],
  start: number,
): { text: string; index: number } | null {
  for (let j = start; j < lines.length; j++) {
    const text = lines[j]?.trim();
    if (text) return { text, index: j };
  }
  return null;
}

function isSectionHeading(line: string): boolean {
  return /^#{2,4}\s/.test(line);
}

function parseSectionHeading(line: string): string {
  return line.replace(/^#{2,4}\s+/, '').trim();
}

function isTechIcon(url: string): boolean {
  return url.includes('-logo.png');
}

function galleryFullFromThumb(thumb: string): string {
  return thumb.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
}

function registerExternalLink(
  href: string,
  label: string,
  liveUrl: { value: string | null; label: string | null },
  sectionLinks: { label: string; href: string }[],
) {
  if (href.includes('weberest.com')) {
    sectionLinks.push({ label, href });
    return;
  }

  if (!liveUrl.value) {
    liveUrl.value = href;
    liveUrl.label = label;
    return;
  }

  sectionLinks.push({ label, href });
}

export function parsePortfolioBody(body: string): ParsedPortfolioCase {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const gallery: PortfolioGalleryItem[] = [];
  const techStack: PortfolioTechItem[] = [];
  const sections: PortfolioSection[] = [];
  const liveUrl = { value: null as string | null, label: null as string | null };

  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    const galleryMatch = line.match(/^\[!\[\]\(([^)]+)\)\]\(([^)]+)\)$/);
    if (galleryMatch) {
      gallery.push({ thumb: galleryMatch[1], full: galleryMatch[2] });
      i += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[\]\(([^)]+)\)$/);
    if (imageMatch) {
      const url = imageMatch[1];
      if (isTechIcon(url)) {
        const titleEntry = nextNonEmptyLine(lines, i + 1);
        const descriptionEntry = titleEntry
          ? nextNonEmptyLine(lines, titleEntry.index + 1)
          : null;

        if (
          titleEntry &&
          descriptionEntry &&
          !titleEntry.text.startsWith('![') &&
          !isSectionHeading(titleEntry.text)
        ) {
          techStack.push({
            icon: url,
            title: titleEntry.text,
            description: descriptionEntry.text,
          });
          i = descriptionEntry.index + 1;
          continue;
        }
      } else {
        gallery.push({ thumb: url, full: galleryFullFromThumb(url) });
        i += 1;
        continue;
      }
    }

    if (isSectionHeading(line)) {
      const heading = parseSectionHeading(line);
      i += 1;
      const section: PortfolioSection = {
        heading,
        bullets: [],
        paragraphs: [],
        images: [],
        links: [],
      };

      while (i < lines.length && !isSectionHeading(lines[i].trim())) {
        const part = lines[i].trim();
        if (!part) {
          i += 1;
          continue;
        }

        if (part.startsWith('- ')) {
          section.bullets.push(part.slice(2).trim());
        } else {
          const standaloneImage = part.match(/^!\[\]\(([^)]+)\)$/);
          if (standaloneImage && !isTechIcon(standaloneImage[1])) {
            section.images.push(standaloneImage[1]);
          } else {
            const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
            if (linkMatch) {
              registerExternalLink(linkMatch[2], linkMatch[1], liveUrl, section.links);
            } else if (!part.startsWith('![')) {
              section.paragraphs.push(part);
            }
          }
        }

        i += 1;
      }

      sections.push(section);
      continue;
    }

    const linkMatch = line.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      registerExternalLink(linkMatch[2], linkMatch[1], liveUrl, []);
      i += 1;
      continue;
    }

    i += 1;
  }

  return {
    gallery,
    techStack,
    liveUrl: liveUrl.value,
    liveLabel: liveUrl.label,
    sections,
  };
}

export function formatPortfolioInlineText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/&nbsp;/g, ' ');
}
