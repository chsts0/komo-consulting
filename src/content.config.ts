import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Направления: одни и те же в фильтре кейсов, в анкете и на карточках
export const SERVICES = [
  'Дизайн',
  'Проектирование',
  'СМР',
  'Снабжение',
  'Сопровождение',
  'Под ключ',
] as const;

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kind: z.string(),
      place: z.string(),
      summary: z.string(),
      services: z.array(z.enum(SERVICES)),
      cover: image(),
      coverAlt: z.string(),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

const vacancies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vacancies' }),
  schema: z.object({
    title: z.string(),
    meta: z.string(),
    order: z.number().default(100),
    published: z.boolean().default(true),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { cases, vacancies, faq };
