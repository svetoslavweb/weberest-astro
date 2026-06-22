import { siteConfig } from '@config/site';

export interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;

  let pathname = path.startsWith('/') ? path : `/${path}`;
  if (!pathname.startsWith(siteConfig.basePath)) {
    pathname = pathname === '/' ? `${siteConfig.basePath}/` : `${siteConfig.basePath}${pathname}`;
  }

  const base = siteConfig.url.endsWith('/') ? siteConfig.url : `${siteConfig.url}/`;
  return new URL(pathname, base).href;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: siteConfig.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/images/logo.png'),
    description: siteConfig.description,
    telephone: siteConfig.phoneTel,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.address,
    },
    sameAs: Object.values(siteConfig.social),
    areaServed: ['BG', 'EU'],
    priceRange: '$$',
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: absoluteUrl('/'),
    inLanguage: siteConfig.language,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

export function buildWebPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    inLanguage: siteConfig.language,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl('/'),
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildBlogPostingSchema(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: input.author ?? siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo.png'),
      },
    },
    image: input.image ? absoluteUrl(input.image) : undefined,
    inLanguage: siteConfig.language,
  };
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildServiceSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: absoluteUrl('/'),
    },
    areaServed: 'BG',
  };
}

export function mergeJsonLd(
  ...schemas: Array<Record<string, unknown> | Record<string, unknown>[] | undefined>
): Record<string, unknown>[] {
  const flat = schemas.flatMap((schema) => (schema ? (Array.isArray(schema) ? schema : [schema]) : []));
  return flat.filter(Boolean) as Record<string, unknown>[];
}
