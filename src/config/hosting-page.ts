export interface HostingPlanFeature {
  label: string;
  value?: string;
  included?: boolean;
}

export interface HostingPlan {
  id: string;
  name: string;
  subtitle: string;
  priceBgn: string;
  priceEur: string;
  period: string;
  featured?: boolean;
  features: HostingPlanFeature[];
}

export const hostingPageContent = {
  title: 'Споделен хостинг Русе',
  metaTitle: 'Споделен хостинг Русе за вашия фирмен сайт или онлайн магазин',
  metaDescription:
    'Надеждно и качествено решение за съхранение на вашия сайт. Споделен хостинг Русе с неограничен трафик, цялостна защита и всичко на SSD дискове.',
  heroLead:
    'Надеждно и качествено решение за съхранение на вашия сайт. Споделен хостинг с неограничен трафик, цялостна защита и SSD дискове.',
  intro: {
    title: 'Ние от Weberest Ви предлагаме нова услуга „Хост за вашия сайт"',
    paragraphs: [
      'Надеждно и качествено решение за съхранение на вашия сайт. Споделен хостинг Русе с неограничен трафик, цялостна защита и всичко на SSD дискове за по-бърз обмен на данни.',
    ],
  },
};

const sharedIncluded: HostingPlanFeature[] = [
  { label: 'Linux/PHP/MySQL/Control Panel', included: true },
  { label: 'SSD дискове за MySQL бази данни', included: true },
  { label: 'Допълнителни сайтове (Addon домейни)', included: true },
  { label: 'Поддръжка на SSL сертификати', included: true },
  { label: 'SSH сигурна връзка', included: true },
  { label: 'Лесно и бързо възстановяване на BackUp (архив)', included: true },
];

export const hostingPlans: HostingPlan[] = [
  {
    id: 'start',
    name: 'Weberest Старт',
    subtitle: 'Подходящ за фирмен сайт и онлайн магазин',
    priceBgn: '280',
    priceEur: '143',
    period: '1 година',
    features: [
      { label: 'Дисково пространство', value: '15 GB' },
      { label: 'Посещения на месец', value: '~ 12,000' },
      { label: 'Месечен трафик', value: 'неограничен' },
      { label: 'Брой пощенски кутии', value: 'неограничен' },
      ...sharedIncluded,
      { label: 'Брой поддомейни (Subdomains)', value: '220' },
      { label: 'Брой FTP потребители', value: '55' },
      { label: 'Самостоятелен IP адрес', value: '4,80 лв./месец' },
      { label: 'Брой паркирани домейни', value: '35' },
    ],
  },
  {
    id: 'pro',
    name: 'Weberest Про',
    subtitle: 'Подходящ за голям фирмен сайт и онлайн магазин',
    priceBgn: '350',
    priceEur: '179',
    period: '1 година',
    featured: true,
    features: [
      { label: 'Дисково пространство', value: '60 GB' },
      { label: 'Посещения на месец', value: '~ 36,000' },
      { label: 'Месечен трафик', value: 'неограничен' },
      { label: 'Брой пощенски кутии', value: 'неограничен' },
      ...sharedIncluded,
      { label: 'Брой поддомейни (Subdomains)', value: '420' },
      { label: 'Брой FTP потребители', value: '500' },
      { label: 'Самостоятелен IP адрес', value: '3,60 лв./месец' },
      { label: 'Брой паркирани домейни', value: '60' },
    ],
  },
];
