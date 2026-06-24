import type { ServiceIcon } from './services-page';

const IMG = '/bg/images/services';

export interface ServiceImages {
  hero: string;
  heroAlt: string;
  intro?: string;
  introAlt?: string;
  sections: string[];
}

function set(
  hero: string,
  intro: string,
  sections: [string, string, string],
  heroAlt = 'Услуга от Weberest',
): ServiceImages {
  return {
    hero: `${IMG}/${hero}`,
    heroAlt,
    intro: `${IMG}/${intro}`,
    introAlt: heroAlt,
    sections: sections.map((s) => `${IMG}/${s}`),
  };
}

/** Снимки по категория (fallback) */
export const serviceImagesById: Record<ServiceIcon | 'ai' | 'automation', ServiceImages> = {
  ai: set('ai-tech.jpg', 'section-code.jpg', ['ai-hero.jpg', 'section-team.jpg', 'integration-api.jpg'], 'AI решения'),
  automation: set(
    'integration-api.jpg',
    'section-code.jpg',
    ['automation-hero.jpg', 'google-ads.jpg', 'section-ecommerce.jpg'],
    'Интеграции и автоматизация',
  ),
  web: set(
    'web-design.jpg',
    'section-design.jpg',
    ['website-dev.jpg', 'responsive-mobile.jpg', 'logo-design.jpg'],
    'Уеб дизайн и сайтове',
  ),
  ecommerce: set(
    'ecommerce-macbook.jpg',
    'online-shop.jpg',
    ['easyemall-shop.jpg', 'section-ecommerce.jpg', 'ecommerce-hero.jpg'],
    'E-commerce и онлайн магазини',
  ),
  software: set(
    'web-development.jpg',
    'section-code.jpg',
    ['software-hero.jpg', 'section-team.jpg', 'integration-api.jpg'],
    'Бизнес софтуер',
  ),
  mobile: set(
    'android-app.jpg',
    'responsive-mobile.jpg',
    ['mobile-hero.jpg', 'section-design.jpg', 'web-development.jpg'],
    'Мобилни приложения',
  ),
  marketing: set(
    'digital-marketing.jpg',
    'seo-analytics.jpg',
    ['google-ads.jpg', 'marketing-hero.jpg', 'section-team.jpg'],
    'Дигитален маркетинг',
  ),
  support: set(
    'hosting-server.jpg',
    'support-team.jpg',
    ['domain-global.jpg', 'support-hero.jpg', 'section-code.jpg'],
    'Поддръжка и хостинг',
  ),
};

const webDesignImages = set(
  'web-design.jpg',
  'section-design.jpg',
  ['website-dev.jpg', 'logo-design.jpg', 'responsive-mobile.jpg'],
  'Уеб дизайн',
);

/** Уникални снимки за всяка страница на услуга */
export const serviceImagesBySlug: Record<string, ServiceImages> = {
  ai: serviceImagesById.ai,
  automation: serviceImagesById.automation,
  websites: set(
    'website-dev.jpg',
    'web-design.jpg',
    ['responsive-mobile.jpg', 'section-design.jpg', 'websites-hero.jpg'],
    'Изработка на уебсайтове',
  ),
  ecommerce: serviceImagesById.ecommerce,
  software: serviceImagesById.software,
  mobile: serviceImagesById.mobile,
  marketing: serviceImagesById.marketing,
  support: serviceImagesById.support,

  'web-design': webDesignImages,
  'adaptiven-web-dizain': set(
    'responsive-mobile.jpg',
    'web-design.jpg',
    ['website-dev.jpg', 'section-design.jpg', 'mobile-hero.jpg'],
    'Адаптивен уеб дизайн',
  ),
  'sazdavane-internet-stranica': set(
    'website-dev.jpg',
    'web-design.jpg',
    ['section-design.jpg', 'responsive-mobile.jpg', 'websites-hero.jpg'],
    'Изработка на сайт',
  ),
  'obnoviavane-web-sait': set(
    'website-redesign.jpg',
    'section-design.jpg',
    ['web-design.jpg', 'website-dev.jpg', 'responsive-mobile.jpg'],
    'Редизайн на сайт',
  ),
  'izrabotka-logo': set(
    'logo-design.jpg',
    'web-design.jpg',
    ['section-design.jpg', 'templates.jpg', 'website-dev.jpg'],
    'Изработка на лого',
  ),
  'shabloni-internet-websites': set(
    'templates.jpg',
    'website-dev.jpg',
    ['web-design.jpg', 'section-design.jpg', 'responsive-mobile.jpg'],
    'Готови шаблони за сайт',
  ),
  'ueb-internet-dizain-ruse': webDesignImages,
  'izrabotvane-blog': set(
    'blog-writing.jpg',
    'website-dev.jpg',
    ['section-design.jpg', 'web-design.jpg', 'digital-marketing.jpg'],
    'Изработка на блог',
  ),

  'sazdavane-elektronen-magazin': set(
    'ecommerce-macbook.jpg',
    'online-shop.jpg',
    ['easyemall-shop.jpg', 'section-ecommerce.jpg', 'ecommerce-hero.jpg'],
    'Онлайн магазини',
  ),
  easyemall: set(
    'easyemall-shop.jpg',
    'ecommerce-macbook.jpg',
    ['online-shop.jpg', 'section-ecommerce.jpg', 'digital-marketing.jpg'],
    'easyEmall платформа',
  ),
  'izrabotka-website-restoranti': set(
    'restaurant.jpg',
    'website-dev.jpg',
    ['web-design.jpg', 'online-shop.jpg', 'section-design.jpg'],
    'Сайт за ресторанти',
  ),
  'izrabotka-hotelski-sait': set(
    'hotel.jpg',
    'website-dev.jpg',
    ['web-design.jpg', 'responsive-mobile.jpg', 'section-design.jpg'],
    'Хотелски сайт',
  ),
  'izrabotka-website-nedvijimi-imoti': set(
    'real-estate.jpg',
    'website-dev.jpg',
    ['web-design.jpg', 'responsive-mobile.jpg', 'seo-analytics.jpg'],
    'Сайт за недвижими имоти',
  ),

  'web-mobile-development': set(
    'web-development.jpg',
    'section-code.jpg',
    ['software-hero.jpg', 'responsive-mobile.jpg', 'android-app.jpg'],
    'Уеб и мобилни разработки',
  ),
  'razrabotka-prilojeniq-android': set(
    'android-app.jpg',
    'responsive-mobile.jpg',
    ['mobile-hero.jpg', 'web-development.jpg', 'section-code.jpg'],
    'Android приложения',
  ),

  'internet-marketing': set(
    'digital-marketing.jpg',
    'seo-analytics.jpg',
    ['google-ads.jpg', 'marketing-hero.jpg', 'section-team.jpg'],
    'Интернет маркетинг',
  ),
  'search-engine-optimization': set(
    'seo-analytics.jpg',
    'digital-marketing.jpg',
    ['google-ads.jpg', 'seo-consulting.jpg', 'marketing-hero.jpg'],
    'SEO оптимизация',
  ),
  'internet-reklama-google': set(
    'google-ads.jpg',
    'digital-marketing.jpg',
    ['seo-analytics.jpg', 'marketing-hero.jpg', 'section-team.jpg'],
    'Google реклама',
  ),
  'seo-konsultacia': set(
    'seo-consulting.jpg',
    'seo-analytics.jpg',
    ['digital-marketing.jpg', 'google-ads.jpg', 'section-team.jpg'],
    'SEO консултация',
  ),

  'poddrujka-administranicq-web-site': set(
    'support-team.jpg',
    'section-code.jpg',
    ['hosting-server.jpg', 'support-hero.jpg', 'domain-global.jpg'],
    'Поддръжка на сайт',
  ),
  'spodelen-hosting-ruse': set(
    'hosting-server.jpg',
    'domain-global.jpg',
    ['support-team.jpg', 'support-hero.jpg', 'section-code.jpg'],
    'Споделен хостинг',
  ),
  'registracia-sait-adres-domain': set(
    'domain-global.jpg',
    'hosting-server.jpg',
    ['support-team.jpg', 'website-dev.jpg', 'support-hero.jpg'],
    'Регистрация на домейн',
  ),
};

const BLOCKED_IMAGE_FRAGMENTS = [
  'customer-woman',
  'customer-man',
  'plus-icon',
  'Elegant_Background',
  'office-people',
];

export function isUsableServiceImage(url: string): boolean {
  return !BLOCKED_IMAGE_FRAGMENTS.some((fragment) => url.includes(fragment));
}

export function getServiceImages(icon: ServiceIcon, slug?: string): ServiceImages {
  if (slug && serviceImagesBySlug[slug]) {
    return serviceImagesBySlug[slug];
  }
  return serviceImagesById[icon];
}
