# bar2917-shop

Сайт суши-бара Bar2917 (bar2917.ru): каталог продуктов с ценами по выбранной точке, личный кабинет, админка товаров. Оформление заказа с доставкой временно отключена.

## Стек

- Next.js 14 (App Router) + TypeScript
- Redux Toolkit + redux-persist
- TanStack Query v5
- NextUI + Tailwind CSS, глобальные стили в `app/globalStyles/`

## Запуск

```bash
yarn install
cp env.example .env   # указать адреса API и сайта
yarn dev              # http://localhost:3000
yarn build && yarn start   # прод
```

## Структура

```
app/
  page.tsx             главная (серверная, метаданные)
  category/[slug]/     страница категории (метаданные — с сервера)
  product/[slug]/      страница товара (SSR + generateMetadata)
  admin/               админка (доступ по isAdmin)
  users/profile/       личный кабинет
  order-history/       история заказов
  services/            запросы к API
  store/               Redux-слайсы
  api/                 axios-инстанс с refresh-интерцептором
  sitemap.ts, robots.ts
components/
  templates/           страницы-шаблоны
  modules/             шапка, сайдбар, футер, корзина
  ui/                  каталог, кнопки, инпуты
middleware.ts          редирект на /auth для приватных страниц без токена
```

## Полезное инфо

- SEO: корневой layout серверный, мета-теги - через Metadata API, товары и категории рендерятся на сервере.
- Токены лежат в cookies (`sameSite: lax`, в проде `secure`), access живёт 1 час, refresh — 30 дней; обновление делает axios-интерцептор.
- Цены зависят от выбранной точки: точка хранится в Redux, компоненты берут цену из `locations` товара.
- Возврат доставки: см. `components/templates/OrderPage/_legacy/Order-false.md`.
