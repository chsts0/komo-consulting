import type { APIRoute } from 'astro';

export const prerender = false;

// Шаг 2: меняем код от GitHub на токен и передаём его окну админки (протокол Decap)
const page = (status: 'success' | 'error', payload: object, origin: string) => `<!doctype html>
<html><body><script>
  (function () {
    var message = 'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))};
    function receive(e) {
      if (e.origin !== ${JSON.stringify(origin)}) return;
      window.opener.postMessage(message, e.origin);
      window.removeEventListener('message', receive);
    }
    window.addEventListener('message', receive);
    window.opener.postMessage('authorizing:github', ${JSON.stringify(origin)});
  })();
</script></body></html>`;

export const GET: APIRoute = async ({ url, cookies }) => {
  const html = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  const origin = url.origin;

  const state = url.searchParams.get('state');
  const saved = cookies.get('oauth_state')?.value;
  cookies.delete('oauth_state', { path: '/api/oauth' });
  if (!state || state !== saved) return html(page('error', { message: 'Неверный state' }, origin));

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: url.searchParams.get('code'),
    }),
  });
  const data = (await response.json()) as { access_token?: string; error_description?: string };

  if (!data.access_token) return html(page('error', { message: data.error_description ?? 'Нет токена' }, origin));
  return html(page('success', { token: data.access_token, provider: 'github' }, origin));
};
