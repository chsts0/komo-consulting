// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// DEMO=true собирает статичную демку для GitHub Pages: без сервера, в подпапке /KOMO, закрытую от индексации
const demo = process.env.DEMO === 'true';
process.env.PUBLIC_DEMO = String(demo);

// Домен пока не куплен: SITE_URL задаётся на хостинге, плейсхолдер только для локальной сборки
const site = demo ? 'https://chsts0.github.io' : (process.env.SITE_URL ?? 'https://komo-consulting.ru');

/** Серверные маршруты (анкета в Telegram и вход в админку) есть только в проде */
const serverRoutes = {
  name: 'komo-server-routes',
  hooks: {
    /** @param {{ injectRoute: (route: { pattern: string; entrypoint: string; prerender?: boolean }) => void }} options */
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({ pattern: '/api/lead', entrypoint: './src/server/lead.ts', prerender: false });
      injectRoute({ pattern: '/api/oauth/auth', entrypoint: './src/server/oauth/auth.ts', prerender: false });
      injectRoute({ pattern: '/api/oauth/callback', entrypoint: './src/server/oauth/callback.ts', prerender: false });
    },
  },
};

export default defineConfig({
  site,
  base: demo ? '/KOMO' : '/',
  // Страницы собираются статикой, на сервере работают только /api/* (заявки и вход в админку)
  output: 'static',
  ...(demo
    ? {}
    : {
        adapter: node({ mode: 'standalone' }),
        // Встроенная проверка Origin спотыкается за прокси хостинга, проверяем сами в /api/lead
        security: { checkOrigin: false },
      }),
  integrations: [
    ...(demo ? [] : [serverRoutes]),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
