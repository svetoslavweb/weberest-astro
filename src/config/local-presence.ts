import { contactMap } from './contact';
import { siteConfig } from './site';

export interface LocalReview {
  author: string;
  rating: number;
  text: string;
  relativeDate?: string;
}

/** Данни от Google Business Profile — обновявайте при промяна на рейтинга или отзивите */
export const localPresence = {
  name: 'Weberest Уеб Дизайн',
  category: 'Уеб дизайнер в Русе',
  rating: 4.8,
  reviewCount: 17,
  profileUrl: contactMap.mapUrl,
  reviewsUrl:
    'https://www.google.com/maps/place/Weberest/@43.8481559,25.9487161,17z/data=!4m8!3m7!1s0x40ae60c68f4d5141:0xb794cfa0dae52885!8m2!3d43.8481559!4d25.9487161!9m1!1b1',
  directionsUrl: contactMap.mapUrl,
  phone: siteConfig.phone,
  phoneTel: siteConfig.phoneTel,
  address: contactMap.address,
  addressFull: 'Русе Център, ул. „Пристанищна“ 22А, 7000 Русе',
  hoursLabel: 'Пон – Пет, 09:00 – 18:30',
  hoursStatus: 'Отворено · Затваря в 18:30',
  featuredReviews: [
    {
      author: 'Милена И.',
      rating: 5,
      text: 'Професионален екип, бърза комуникация и отличен резултат. Сайтът ни изглежда модерно и вече носи реални запитвания.',
      relativeDate: 'преди 2 месеца',
    },
    {
      author: 'Георги П.',
      rating: 5,
      text: 'Работихме по онлайн магазин — всичко беше ясно обяснено, без скрити такси. Препоръчвам Weberest на всеки бизнес в Русе.',
      relativeDate: 'преди 4 месеца',
    },
    {
      author: 'Десислава К.',
      rating: 5,
      text: 'Комбинация от дизайн, SEO и поддръжка на едно място. Отговарят бързо и наистина разбират от дигитален маркетинг.',
      relativeDate: 'преди 6 месеца',
    },
  ] satisfies LocalReview[],
  map: {
    title: contactMap.title,
    eyebrow: contactMap.eyebrow,
    address: contactMap.address,
    embedUrl: contactMap.embedUrl,
    mapUrl: contactMap.mapUrl,
  },
} as const;
