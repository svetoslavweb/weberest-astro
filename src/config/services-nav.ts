export interface ServicesNavGroup {
  label: string;
  items: ServicesNavItem[];
}

export interface ServicesNavItem {
  label: string;
  href: string;
  badge?: string;
}

/** Пълен списък услуги за падащото меню и footer */
export const servicesNavGroups: ServicesNavGroup[] = [
  {
    label: 'Нови услуги',
    items: [
      { label: 'AI решения за бизнеса', href: '/services/ai/', badge: 'Ново' },
      { label: 'Интеграции и автоматизация', href: '/services/automation/', badge: 'Ново' },
    ],
  },
  {
    label: 'Дигитални решения',
    items: [
      { label: 'Изработка на уебсайтове', href: '/services/websites/' },
      { label: 'E-commerce решения', href: '/services/ecommerce/' },
      { label: 'Бизнес софтуер', href: '/services/software/' },
      { label: 'Мобилни приложения', href: '/services/mobile/' },
      { label: 'Дигитален маркетинг', href: '/services/marketing/' },
      { label: 'Поддръжка и развитие', href: '/services/support/' },
    ],
  },
  {
    label: 'Уеб дизайн',
    items: [
      { label: 'Уеб дизайн', href: '/web-design/' },
      { label: 'Адаптивен уеб дизайн', href: '/adaptiven-web-dizain/' },
      { label: 'Изработка на сайт', href: '/sazdavane-internet-stranica/' },
      { label: 'Редизайн на сайт', href: '/obnoviavane-web-sait/' },
      { label: 'Изработка на лого', href: '/izrabotka-logo/' },
      { label: 'Готови шаблони', href: '/shabloni-internet-websites/' },
    ],
  },
  {
    label: 'Онлайн магазини',
    items: [
      { label: 'Онлайн магазини', href: '/sazdavane-elektronen-magazin/' },
      { label: 'easyEmall платформа', href: '/easyemall/' },
      { label: 'Сайт за ресторанти', href: '/izrabotka-website-restoranti/' },
      { label: 'Сайт за хотели', href: '/izrabotka-hotelski-sait/' },
      { label: 'Сайт за имоти', href: '/izrabotka-website-nedvijimi-imoti/' },
    ],
  },
  {
    label: 'Разработки',
    items: [
      { label: 'Уеб и мобилни разработки', href: '/web-mobile-development/' },
      { label: 'Android приложения', href: '/razrabotka-prilojeniq-android/' },
    ],
  },
  {
    label: 'Маркетинг',
    items: [
      { label: 'Интернет маркетинг', href: '/internet-marketing/' },
      { label: 'SEO оптимизация', href: '/search-engine-optimization/' },
      { label: 'Google реклама', href: '/internet-reklama-google/' },
      { label: 'SEO консултация', href: '/seo-konsultacia/' },
    ],
  },
  {
    label: 'Поддръжка и хостинг',
    items: [
      { label: 'Поддръжка на сайт', href: '/poddrujka-administranicq-web-site/' },
      { label: 'Споделен хостинг', href: '/spodelen-hosting-ruse/' },
      { label: 'Регистрация на домейн', href: '/registracia-sait-adres-domain/' },
    ],
  },
  {
    label: 'Други',
    items: [{ label: 'Изработка на блог', href: '/izrabotvane-blog/' }],
  },
];

export const servicesNavFlat = servicesNavGroups.flatMap((group) => group.items);
