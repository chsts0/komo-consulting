import type { APIRoute } from 'astro';

export const prerender = false;

// Шаг 1 входа в админку: отправляем на GitHub за разрешением
export const GET: APIRoute = ({ url, redirect, cookies }) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response('GITHUB_CLIENT_ID не задан', { status: 503 });

  const state = crypto.randomUUID();
  cookies.set('oauth_state', state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/oauth', maxAge: 600 });

  const github = new URL('https://github.com/login/oauth/authorize');
  github.searchParams.set('client_id', clientId);
  github.searchParams.set('redirect_uri', new URL('/api/oauth/callback', url.origin).toString());
  github.searchParams.set('scope', url.searchParams.get('scope') ?? 'repo');
  github.searchParams.set('state', state);
  return redirect(github.toString());
};
