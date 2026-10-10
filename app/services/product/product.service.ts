import { instance } from "@/app/api/api.interceptor"
import { IProductFull, TypeProducts } from "@/app/types/product.interface"
import { LocationService } from "../location.service"
import { PRODUCTS, TypeProductCreateData, TypeProductDataFilters, TypeProductUpdateData } from "./product.types"

// Витрина (каталог, товар, похожие) загружается на сервере — см. app/api/server-api.ts.
// Здесь — клиентские запросы и админка
export const ProductService = {
  async getAll(queryData = {} as TypeProductDataFilters) {
    const locationId = await LocationService.getLocationId();
    return instance<TypeProducts>({
      url: PRODUCTS,
      method: 'GET',
      params: { ...queryData, locationId }
    })
  },

  // Админка: все товары, включая скрытые, с ценами по всем точкам
  async getAllAdmin() {
    return instance<IProductFull[]>({
      url: `${PRODUCTS}/admin`,
      method: 'GET'
    })
  },

  async getByIdFull(id: string | number) {
    return instance<IProductFull>({
      url: `${PRODUCTS}/admin/${id}`,
      method: 'GET'
    })
  },

  async create(data: TypeProductCreateData) {
    return instance<IProductFull>({
      url: PRODUCTS,
      method: 'POST',
      data
    })
  },

  async update(id: string | number, data: TypeProductUpdateData) {
    return instance<IProductFull>({
      url: `${PRODUCTS}/${id}`,
      method: 'PUT',
      data
    })
  },

  async delete(id: string | number) {
    return instance<IProductFull>({
      url: `${PRODUCTS}/${id}`,
      method: 'DELETE'
    })
  }
}
