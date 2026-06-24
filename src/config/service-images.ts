import type { ServiceIcon } from './services-page';

const IMG = '/bg/images/services';

export interface ServiceImages {
  hero: string;
  heroAlt: string;
  intro?: string;
  introAlt?: string;
  sections: string[];
}

export const serviceImagesById: Record<ServiceIcon | 'ai' | 'automation', ServiceImages> = {
  ai: {
    hero: `${IMG}/ai-hero.jpg`,
    heroAlt: 'AI технологии и изкуствен интелект за бизнес',
    intro: `${IMG}/section-team.jpg`,
    introAlt: 'Екип, работещ с AI решения',
    sections: [`${IMG}/section-code.jpg`, `${IMG}/section-team.jpg`, `${IMG}/ai-hero.jpg`],
  },
  automation: {
    hero: `${IMG}/automation-hero.jpg`,
    heroAlt: 'Интеграции и автоматизация на бизнес процеси',
    intro: `${IMG}/section-code.jpg`,
    introAlt: 'Свързани системи и автоматизация',
    sections: [`${IMG}/automation-hero.jpg`, `${IMG}/section-ecommerce.jpg`, `${IMG}/support-hero.jpg`],
  },
  web: {
    hero: `${IMG}/websites-hero.jpg`,
    heroAlt: 'Изработка на уебсайтове и уеб дизайн',
    intro: `${IMG}/section-design.jpg`,
    introAlt: 'Уеб дизайн и разработка',
    sections: [`${IMG}/section-design.jpg`, `${IMG}/websites-hero.jpg`, `${IMG}/section-team.jpg`],
  },
  ecommerce: {
    hero: `${IMG}/ecommerce-hero.jpg`,
    heroAlt: 'E-commerce и онлайн магазини',
    intro: `${IMG}/section-ecommerce.jpg`,
    introAlt: 'Онлайн пазаруване и електронна търговия',
    sections: [`${IMG}/ecommerce-hero.jpg`, `${IMG}/section-ecommerce.jpg`, `${IMG}/section-design.jpg`],
  },
  software: {
    hero: `${IMG}/software-hero.jpg`,
    heroAlt: 'Бизнес софтуер и уеб приложения',
    intro: `${IMG}/section-code.jpg`,
    introAlt: 'Програмиране и разработка на софтуер',
    sections: [`${IMG}/section-code.jpg`, `${IMG}/software-hero.jpg`, `${IMG}/section-team.jpg`],
  },
  mobile: {
    hero: `${IMG}/mobile-hero.jpg`,
    heroAlt: 'Мобилни приложения за Android и iOS',
    intro: `${IMG}/mobile-hero.jpg`,
    introAlt: 'Мобилни устройства и приложения',
    sections: [`${IMG}/mobile-hero.jpg`, `${IMG}/section-design.jpg`, `${IMG}/section-code.jpg`],
  },
  marketing: {
    hero: `${IMG}/marketing-hero.jpg`,
    heroAlt: 'Дигитален маркетинг и онлайн реклама',
    intro: `${IMG}/marketing-hero.jpg`,
    introAlt: 'Маркетингова стратегия и анализ',
    sections: [`${IMG}/marketing-hero.jpg`, `${IMG}/section-team.jpg`, `${IMG}/automation-hero.jpg`],
  },
  support: {
    hero: `${IMG}/support-hero.jpg`,
    heroAlt: 'Техническа поддръжка и хостинг',
    intro: `${IMG}/support-hero.jpg`,
    introAlt: 'Сървъри и техническа поддръжка',
    sections: [`${IMG}/support-hero.jpg`, `${IMG}/section-code.jpg`, `${IMG}/section-team.jpg`],
  },
};

export function getServiceImages(icon: ServiceIcon): ServiceImages {
  return serviceImagesById[icon];
}
