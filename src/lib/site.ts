// Ссылки внутри сайта: на GitHub Pages сайт живёт в подпапке /komo-consulting, в проде в корне
export const link = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

// Всё, что заказчик ещё не прислал, помечено TODO: ники, почта, адрес, юрлицо

export const site = {
  name: 'KOMO Consulting',
  shortName: 'KOMO',
  tagline: 'Управляющая компания полного цикла в коммерческой недвижимости',
  city: 'Москва',
  contacts: [
    { name: 'Константин Морозов', role: 'Операционный директор', phone: '+7 904 555-74-05' },
    { name: 'Мария Лебедева', role: 'Менеджер по продажам', phone: '+7 911 250-38-71' },
  ],
  links: [
    { label: 'Instagram', note: 'ник ждём', href: '#' }, // TODO
    { label: 'Telegram', note: 'ник ждём', href: '#' }, // TODO
    { label: 'Авито', note: 'профиль', href: '#' }, // TODO
    { label: 'Почта', note: 'адрес ждём', href: '#' }, // TODO
  ],
  telegram: '#', // TODO: ссылка t.me для «Написать в Telegram»
};

// Пока внутренних страниц нет, меню скроллит к блокам главной (решение Стаса)
export const nav = [
  { label: 'О нас', href: link('/#o-nas') },
  { label: 'Услуги', href: link('/#uslugi') },
  { label: 'Кейсы', href: link('/#kejsy') },
  { label: 'Q&A', href: link('/#voprosy') },
  { label: 'Вакансии', href: link('/#vakansii') },
  { label: 'Контакты', href: link('/#kontakty') },
];

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
