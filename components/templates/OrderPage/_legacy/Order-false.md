# Законсервированный чекаут

Код оформления заказа с доставкой, написанный до заморозки этой функции.
Он не импортируется приложением и исключён из проверки типов (`tsconfig.json` → `exclude: **/_legacy/**`).

Включает в себя:

- `OrderPageNoUse.tsx` — страница оформления заказа (корзина, адрес, карта, время доставки, оплата).
- `DeliveryDateTimePicker.tsx` — выбор даты и времени доставки (использовал `react-datepicker`, пакет удалён — вернуть при реанимации).
- `OrderItem/` — карточка позиции заказа со степпером количества.
- `payment.service.ts` — создание платежа через `POST /orders` (YooKassa).

Что нужно для включения обратно:

1. На бэкенде выставить `ORDERS_ENABLED=true` и заполнить `SHOP_ID`/`PAYMENT_TOKEN`, `RETURN_URL`.
2. Бэк сам считает сумму заказа: `OrderDto` требует `locationId`, а `items` — только `productId` и `quantity` (без `price` и `status`). Обновить `payment.service.ts` под это.
3. Вернуть зависимости: `react-datepicker` (даты). Карта (`@pbe/react-yandex-maps`) осталась в package.json.
4. Перенести файлы обратно, убрать exclude из tsconfig, довести типы.
