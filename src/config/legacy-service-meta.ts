import type { ServiceIcon } from './services-page';
import { servicesNavGroups } from './services-nav';

export interface LegacyServiceMeta {
  icon: ServiceIcon;
  eyebrow: string;
  group: string;
}

export const legacyServiceMeta: Record<string, LegacyServiceMeta> = {
  'web-design': { icon: 'web', eyebrow: 'Weberest · Уеб дизайн', group: 'Уеб дизайн' },
  'adaptiven-web-dizain': { icon: 'web', eyebrow: 'Weberest · Адаптивен дизайн', group: 'Уеб дизайн' },
  'sazdavane-internet-stranica': { icon: 'web', eyebrow: 'Weberest · Уебсайтове', group: 'Уеб дизайн' },
  'obnoviavane-web-sait': { icon: 'web', eyebrow: 'Weberest · Редизайн', group: 'Уеб дизайн' },
  'izrabotka-logo': { icon: 'web', eyebrow: 'Weberest · Лого дизайн', group: 'Уеб дизайн' },
  'shabloni-internet-websites': { icon: 'web', eyebrow: 'Weberest · Шаблони', group: 'Уеб дизайн' },
  'ueb-internet-dizain-ruse': { icon: 'web', eyebrow: 'Weberest · Уеб дизайн', group: 'Уеб дизайн' },
  'sazdavane-elektronen-magazin': {
    icon: 'ecommerce',
    eyebrow: 'Weberest · E-commerce',
    group: 'Онлайн магазини',
  },
  easyemall: { icon: 'ecommerce', eyebrow: 'Weberest · easyEmall', group: 'Онлайн магазини' },
  'izrabotka-website-restoranti': {
    icon: 'ecommerce',
    eyebrow: 'Weberest · Ресторанти',
    group: 'Онлайн магазини',
  },
  'izrabotka-hotelski-sait': { icon: 'ecommerce', eyebrow: 'Weberest · Хотели', group: 'Онлайн магазини' },
  'izrabotka-website-nedvijimi-imoti': {
    icon: 'ecommerce',
    eyebrow: 'Weberest · Имоти',
    group: 'Онлайн магазини',
  },
  'web-mobile-development': {
    icon: 'software',
    eyebrow: 'Weberest · Разработки',
    group: 'Разработки',
  },
  'razrabotka-prilojeniq-android': {
    icon: 'mobile',
    eyebrow: 'Weberest · Мобилни приложения',
    group: 'Разработки',
  },
  'internet-marketing': { icon: 'marketing', eyebrow: 'Weberest · Маркетинг', group: 'Маркетинг' },
  'search-engine-optimization': { icon: 'marketing', eyebrow: 'Weberest · SEO', group: 'Маркетинг' },
  'internet-reklama-google': { icon: 'marketing', eyebrow: 'Weberest · Google Ads', group: 'Маркетинг' },
  'seo-konsultacia': { icon: 'marketing', eyebrow: 'Weberest · SEO консултация', group: 'Маркетинг' },
  'poddrujka-administranicq-web-site': {
    icon: 'support',
    eyebrow: 'Weberest · Поддръжка',
    group: 'Поддръжка и хостинг',
  },
  'spodelen-hosting-ruse': { icon: 'support', eyebrow: 'Weberest · Хостинг', group: 'Поддръжка и хостинг' },
  'registracia-sait-adres-domain': {
    icon: 'support',
    eyebrow: 'Weberest · Домейни',
    group: 'Поддръжка и хостинг',
  },
  'izrabotvane-blog': { icon: 'web', eyebrow: 'Weberest · Блог', group: 'Други' },
};

export const legacyServiceSlugs = new Set(Object.keys(legacyServiceMeta));

export function isLegacyServiceSlug(slug: string): boolean {
  return legacyServiceSlugs.has(slug);
}

export function getRelatedLinksForSlug(slug: string): { label: string; href: string }[] {
  const group = servicesNavGroups.find((g) => g.items.some((item) => item.href === `/${slug}/`));
  if (!group) return [];

  return group.items
    .filter((item) => item.href !== `/${slug}/`)
    .map((item) => ({ label: item.label, href: item.href }));
}
