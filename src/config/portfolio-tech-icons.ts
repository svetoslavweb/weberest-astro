const ICON_BASE = '/bg/images/portfolio-tech';

const TITLE_TO_ICON: Record<string, string> = {
  Design: `${ICON_BASE}/design.svg`,
  Database: `${ICON_BASE}/database.svg`,
  HTML5: `${ICON_BASE}/html5.svg`,
  CSS3: `${ICON_BASE}/css3.svg`,
  'Java Script': `${ICON_BASE}/javascript.svg`,
  JavaScript: `${ICON_BASE}/javascript.svg`,
  'Оптимизация за търсачки': `${ICON_BASE}/seo.svg`,
};

const FILENAME_TO_ICON: Record<string, string> = {
  'design-logo': `${ICON_BASE}/design.svg`,
  'database-logo': `${ICON_BASE}/database.svg`,
  'html-5-logo': `${ICON_BASE}/html5.svg`,
  'css-3-logo': `${ICON_BASE}/css3.svg`,
  'java-script-logo': `${ICON_BASE}/javascript.svg`,
  'seo-logo': `${ICON_BASE}/seo.svg`,
};

export function resolveTechStackIcon(title: string, legacyIconPath?: string): string {
  if (TITLE_TO_ICON[title]) return TITLE_TO_ICON[title];

  const legacyName = legacyIconPath?.match(/\/([^/]+)\.png$/)?.[1];
  if (legacyName && FILENAME_TO_ICON[legacyName]) return FILENAME_TO_ICON[legacyName];

  return `${ICON_BASE}/design.svg`;
}
