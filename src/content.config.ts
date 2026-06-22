import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  canonical: z.string().optional(),
  robots: z.string().optional(),
  ogImage: z.string().optional(),
  ogType: z.string().optional(),
  noindex: z.boolean().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: seoSchema.extend({
    template: z.enum(['default', 'landing', 'legal', 'contact', 'about', 'services', 'faq']).default('default'),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    showQuoteForm: z.boolean().default(false),
    wpId: z.number().optional(),
    wpSlug: z.string().optional(),
    wpUrl: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: seoSchema.extend({
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Weberest'),
    category: z.string().optional(),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    youtubeId: z.string().optional(),
    wpId: z.number().optional(),
    wpSlug: z.string().optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: seoSchema.extend({
    client: z.string().optional(),
    website: z.string().url().optional(),
    categories: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    order: z.number().default(0),
    pubDate: z.coerce.date().optional(),
    wpId: z.number().optional(),
    wpSlug: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: seoSchema.extend({
    icon: z.string().optional(),
    excerpt: z.string().optional(),
    order: z.number().default(0),
    wpId: z.number().optional(),
    wpSlug: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(0),
    category: z.string().optional(),
  }),
});

export const collections = { pages, blog, portfolio, services, faq };
