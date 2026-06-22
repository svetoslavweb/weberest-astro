export const quoteFormServices = [
  {
    id: 'design',
    phpField: 'design',
    title: 'Дизайн / Редизайн',
    desc: 'Нов или обновен корпоративен сайт със силна визия.',
  },
  {
    id: 'marketing',
    phpField: 'seo',
    title: 'Google Маркетинг',
    desc: 'SEO, реклама и измерими резултати в Google.',
  },
  {
    id: 'shop',
    phpField: 'eshop',
    title: 'Онлайн Магазин',
    desc: 'E-commerce платформа, готова да продава.',
  },
  {
    id: 'other',
    phpField: 'other',
    title: 'Други Услуги',
    desc: 'Хостинг, поддръжка, мобилни решения и още.',
  },
] as const;

export const quoteFormSteps = ['Услуга', 'Проект', 'Контакт'] as const;

export type QuoteServiceId = (typeof quoteFormServices)[number]['id'];
