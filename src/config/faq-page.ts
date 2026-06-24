import { servicesNavGroups } from './services-nav';

export interface FaqSidebarLink {
  label: string;
  href: string;
  featured?: boolean;
  badge?: string;
}

export const faqSidebarServices: FaqSidebarLink[] = [
  { label: 'Всички услуги', href: '/services/', featured: true },
  ...servicesNavGroups.flatMap((group) => group.items),
];
