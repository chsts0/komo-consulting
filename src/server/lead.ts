import type { APIRoute } from 'astro';

export const prerender = false;

const FIELDS: [string, string][] = [
  ['name', 'Имя'],
  ['contact', 'Контакт'],
  ['kind', 'Что открывает'],
  ['area', 'Площадь, м²'],
  ['address', 'Адрес'],
  ['stage', 'Стадия'],
  ['services', 'Что нужно'],
  ['budget', 'Бюджет'],
  ['when', 'Когда открыться'],
];

const escape = (value: string) => value.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

export const POST: APIRoute = async ({ request }) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('lead: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы');
    return new Response('Not configured', { status: 503 });
  }

  // Принимаем заявки только со своего сайта
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host || new URL(origin).host !== host) {
    return new Response('Forbidden', { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Ловушка заполнена: это бот, делаем вид, что всё ок
  if (String(form.get('website') ?? '').trim()) return new Response(null, { status: 204 });

  const name = String(form.get('name') ?? '').trim();
  const contact = String(form.get('contact') ?? '').trim();
  if (!name || !contact || form.get('consent') !== 'yes') {
    return new Response('Missing fields', { status: 422 });
  }

  const lines = FIELDS.flatMap(([key, label]) => {
    const value = form
      .getAll(key)
      .map((v) => String(v).trim().slice(0, 300))
      .filter(Boolean)
      .join(', ');
    return value ? [`<b>${label}:</b> ${escape(value)}`] : [];
  });

  const text = ['<b>Новая анкета с сайта</b>', '', ...lines].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!response.ok) {
    console.error('lead: Telegram ответил', response.status, await response.text());
    return new Response('Upstream error', { status: 502 });
  }

  return new Response(null, { status: 204 });
};
