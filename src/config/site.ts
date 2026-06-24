import { servicesNavFlat } from './services-nav';

export const siteConfig = {
  name: 'Weberest',
  tagline: 'Върхов Интернет Дизайн и Маркетинг',
  description:
    'Weberest е уеб дизайн и онлайн маркетинг студио в Русе. Изработка на сайтове, онлайн магазини, SEO и Google реклама.',
  url: 'https://www.weberest.com',
  basePath: '/bg',
  locale: 'bg_BG',
  language: 'bg',
  phone: '0887 288 822',
  phoneTel: '+359887288822',
  email: 'info@weberest.com',
  address: {
    streetAddress: 'Русе',
    addressLocality: 'Русе',
    addressRegion: 'Русе',
    postalCode: '7000',
    addressCountry: 'BG',
  },
  social: {
    facebook: 'https://www.facebook.com/weberest',
    linkedin: 'https://www.linkedin.com/company/weberest',
  },
  defaultOgImage: '/bg/images/og-default.jpg',
  nav: [
    { label: 'За Weberest', href: '/about-weberest/' },
    {
      label: 'Услуги',
      href: '/services/',
      children: servicesNavFlat,
    },
    { label: 'Портфолио', href: '/website-klienti/' },
    { label: 'Блог', href: '/blog/' },
    { label: 'ЧЗВ', href: '/chesto-zadavani-vaprosi/' },
    { label: 'Контакти', href: '/it-konsultacia/' },
  ],
  footerLinks: {
    company: [
      { label: 'За Weberest', href: '/about-weberest/' },
      { label: 'Портфолио', href: '/website-klienti/' },
      { label: 'Контакти', href: '/it-konsultacia/' },
      { label: 'Политика за бисквитки', href: '/cookies-policy/' },
    ],
    services: servicesNavFlat.slice(0, 8),
    info: [
      { label: 'Процес на работа', href: '/web-design-etapi/' },
      { label: 'Предимства', href: '/predimstva/' },
      { label: 'Карта на сайта', href: '/sitemap/' },
    ],
    legal: [
      { label: 'Общи условия', href: '/obshti-usloviq/' },
      { label: 'Поверителност', href: '/privacy-policy/' },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
