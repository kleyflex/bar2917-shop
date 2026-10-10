// Точка (ресторан). Товары точки отдаёт GET /products?locationId=, в объекте их нет
export interface ILocation {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  isDefault: boolean;
}

// Cookie с выбранной точкой: по ней сервер рендерит меню, каталог и цены
export const LOCATION_COOKIE = 'locationId';
