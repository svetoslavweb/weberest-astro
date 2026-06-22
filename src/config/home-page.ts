import type { ServiceCard } from './services-page';
import { servicesPageMain, servicesPageNew } from './services-page';
import { aboutImpact } from './about';

export interface HomeServiceCard extends ServiceCard {
  href: string;
  ctaLabel?: string;
}

export const homeServicesNew = servicesPageNew;

export const homeServicesMain = {
  eyebrow: '02 · Услуги',
  title: 'Цялостни дигитални решения',
  lead: 'От корпоративен сайт и онлайн магазин до маркетинг, мобилни приложения и поддръжка.',
  allServicesHref: '/services/',
  allServicesLabel: 'Всички услуги',
  items: [
    {
      ...servicesPageMain.items[0],
      href: '/web-design/',
      ctaLabel: 'Уеб дизайн',
    },
    {
      ...servicesPageMain.items[1],
      href: '/sazdavane-elektronen-magazin/',
      ctaLabel: 'E-commerce',
    },
    {
      ...servicesPageMain.items[2],
      href: '/web-mobile-development/',
      ctaLabel: 'Разработки',
    },
    {
      ...servicesPageMain.items[3],
      href: '/razrabotka-prilojeniq-android/',
      ctaLabel: 'Мобилни приложения',
    },
    {
      ...servicesPageMain.items[4],
      href: '/internet-marketing/',
      ctaLabel: 'Маркетинг',
    },
    {
      ...servicesPageMain.items[5],
      href: '/poddrujka-administranicq-web-site/',
      ctaLabel: 'Поддръжка',
    },
  ] satisfies HomeServiceCard[],
};

export const homeVideos = {
  eyebrow: '03 · Медии',
  title: 'Weberest в медиите',
  lead: 'Нашият екип често е канен в местни и регионални медии за теми свързани с дигитален маркетинг, технологии и онлайн бизнес.',
  featuredVideo: {
    id: 't-XaiMRvz1M',
    title: 'Колко струва изработката на онлайн магазин в България — бърз гид',
    href: '/kolko-struva-izrabotkata-na-online-magazin/',
    label: 'Вижте статията',
  },
  videos: aboutImpact.media.videos,
};
