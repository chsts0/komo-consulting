// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Домен пока не куплен: SITE_URL задаётся на хостинге, плейсхолдер только для локальной сборки
const site = process.env.SITE_URL ?? 'https://komo-consulting.ru';

export default defineConfig({
  site,
  // Страницы собираются статикой, на сервере работают только /api/* (заявки и вход в админку)
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  // Встроенная проверка Origin спотыкается за прокси хостинга, проверяем сами в /api/lead
  security: { checkOrigin: false },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
