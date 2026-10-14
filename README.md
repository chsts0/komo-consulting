# Сайт KOMO Consulting

Astro 5: страницы собираются статикой, на Node-сервере работают только `/api/lead` (анкета в Telegram) и `/api/oauth/*` (вход в админку).

## Запуск

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # сборка в dist/
npm start          # прод-сервер из dist/ (нужны переменные из .env.example)
```

## Где что лежит

- `src/components/` — блоки главной, каждый блок отдельным файлом
- `src/styles/global.css` — цвета, шрифты, кнопки (токены брендбука)
- `src/content/cases`, `vacancies`, `faq` — кейсы, вакансии, вопросы. Один файл = одна запись
- `src/assets/photos/` — фото, сжимаются в WebP при сборке
- `src/lib/site.ts` — контакты, соцсети, меню
- `public/admin/` — админка Decap (`/admin`)

## Как добавить кейс

Через админку: `/admin` → «Кейсы» → «Новый кейс» → «Опубликовать». Или руками: положить фото в `src/assets/photos/` и создать `src/content/cases/<slug>.md` по образцу `santi.md`. После пуша в `main` хостинг пересобирает сайт.

## Деплой (Timeweb Cloud Apps или любой хостинг с Node 20+)

1. Подключить репозиторий, ветка `main`
2. Сборка: `npm ci && npm run build`, запуск: `npm start`
3. Переменные окружения: см. `.env.example`
4. Привязать домен, включить HTTPS
5. В `public/admin/config.yml` поменять `base_url` на домен

## Бот для анкет

1. Создать бота в @BotFather, токен положить в `TELEGRAM_BOT_TOKEN`
2. Добавить бота в чат для заявок, id чата положить в `TELEGRAM_CHAT_ID`

## Вход в админку

GitHub → Settings → Developer settings → OAuth Apps → New:
- Homepage URL: `https://<домен>`
- Callback URL: `https://<домен>/api/oauth/callback`

`Client ID` и `Client secret` положить в `GITHUB_CLIENT_ID` и `GITHUB_CLIENT_SECRET`. Редактор входит своим GitHub-аккаунтом, у которого есть доступ на запись в репозиторий.
