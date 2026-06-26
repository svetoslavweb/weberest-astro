import { siteConfig } from './site';

export interface ContactOffice {
  id: string;
  country: string;
  city: string;
  badge: string;
  isHeadquarters?: boolean;
  address: string;
  addressNote?: string;
  postalCode?: string;
  phone?: string;
  phoneTel?: string;
  email: string;
  hours: string;
  mapUrl: string;
}

export const contactHero = {
  eyebrow: 'Weberest · Digital Studio',
  title: 'Контакти',
  lead:
    'Имате проект, който смятате, че ще ни хареса, или просто искате да кажете „Здравей“? Свържете се с нас — отговаряме на разбираем език, без излишни термини.',
  primaryHref: '/zapitanie/',
  primaryLabel: 'Безплатна оферта',
  secondaryHref: '/website-klienti/',
  secondaryLabel: 'Портфолио',
};

export const contactMap = {
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d293.8362253079265!2d25.94614117480183!3d43.8481558541683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ae60c68f4d5141%3A0xb794cfa0dae52885!2zV2ViZXJlc3Qg0KPQtdCxINCU0LjQt9Cw0LnQvQ!5e0!3m2!1sbg!2sbg!4v1781698025754!5m2!1sbg!2sbg',
  mapUrl: 'https://maps.app.goo.gl/XJL66vEyXRFG7yET6',
  title: 'Weberest – офис в Русе',
  eyebrow: 'Локация',
  address: 'ул. Пристанищна 22А, ет. 4 · 7000 Русе',
};

export const contactOffices: ContactOffice[] = [
  {
    id: 'ruse',
    country: 'България',
    city: 'Русе',
    badge: 'BG',
    isHeadquarters: true,
    address: 'ул. Пристанищна 22А, ет. 4',
    addressNote: 'в сградата на Гранична полиция',
    postalCode: '7000',
    phone: siteConfig.phone,
    phoneTel: siteConfig.phoneTel,
    email: siteConfig.email,
    hours: 'Пон – Пет, 09:00 – 17:00 · GMT+2',
    mapUrl: contactMap.mapUrl,
  },
];

export const contactIntro =
  'Екипът на Weberest е съставен от професионалисти в дигиталния дизайн, уеб разработката и маркетинга. Работим с клиенти от цял свят — с ясна комуникация, прозрачен процес и фокус върху резултата.';
