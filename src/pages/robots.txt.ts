import type { APIRoute } from 'astro';
import { link } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const body =
    import.meta.env.PUBLIC_DEMO === 'true'
      ? ['User-agent: *', 'Disallow: /'].join('\n')
      : ['User-agent: *', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${new URL(link('/sitemap-index.xml'), site)}`].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
