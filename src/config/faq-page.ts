export interface FaqSidebarLink {
  label: string;
  href: string;
  featured?: boolean;
  badge?: string;
}

export const faqSidebarServices: FaqSidebarLink[] = [
  { label: 'Всички услуги', href: '/services/', featured: true },
  { label: 'AI решения за бизнеса', href: '/services/#services-new', badge: 'Ново' },
  { label: 'Интеграции и автоматизация', href: '/services/#services-new', badge: 'Ново' },
  { label: 'Уеб Дизайн', href: '/web-design/' },
  { label: 'Онлайн Магазини', href: '/sazdavane-elektronen-magazin/' },
  { label: 'Уеб и Мобилни Разработки', href: '/web-mobile-development/' },
  { label: 'Интернет Маркетинг', href: '/internet-marketing/' },
  { label: 'Споделен хостинг', href: '/spodelen-hosting-ruse/' },
];
