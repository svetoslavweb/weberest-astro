import { getRelatedLinksForSlug } from '@config/legacy-service-meta';
import { getServiceImages } from '@config/service-images';
import { hostingPageContent, hostingPlans } from '@config/hosting-page';
import type { ServiceDetail } from '@config/service-details';

export function buildHostingServiceDetail(): ServiceDetail {
  const stockImages = getServiceImages('support', 'spodelen-hosting-ruse');

  return {
    id: 'spodelen-hosting-ruse',
    icon: 'support',
    title: hostingPageContent.title,
    metaTitle: hostingPageContent.metaTitle,
    metaDescription: hostingPageContent.metaDescription,
    eyebrow: 'Weberest · Хостинг',
    heroLead: hostingPageContent.heroLead,
    heroImage: stockImages.hero,
    canonicalPath: '/spodelen-hosting-ruse/',
    intro: {
      ...hostingPageContent.intro,
      image: stockImages.intro,
      imageAlt: hostingPageContent.title,
    },
    benefits: { title: '', items: [] },
    sections: [],
    faq: [],
    hostingPlans,
    relatedLinks: getRelatedLinksForSlug('spodelen-hosting-ruse'),
  };
}
