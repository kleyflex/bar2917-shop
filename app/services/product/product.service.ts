import { instance } from "@/app/api/api.interceptor"
import { IProduct, IProductFull, TypeProducts } from "@/app/types/product.interface"
import { LocationService } from "../location.service"
import { PRODUCTS, TypeProductCreateData, TypeProductDataFilters, TypeProductUpdateData } from "./product.types"

// Приводит ответ API (цены по всем локациям) к IProduct с ценой выбранной локации
const toProductWithPrice = (product: IProductFull, locationId: number | null): IProduct => {
  const locationInfo = (locationId
    ? product.locations.find(item => item.location?.id === locationId)
    : undefined) ?? product.locations[0];

  const { locations, isActive, ...rest } = product;

  return {
    ...rest,
    price: locationInfo?.price ?? 0,
    isAvailable: locationInfo?.isAvailable ?? false
  };
}

export const ProductService = {
  async getAll(queryData = {} as TypeProductDataFilters) {
    const locationId = await LocationService.getLocationId();
    return instance<TypeProducts>({
      url: PRODUCTS,
      method: 'GET',
      params: { locationId }
    })
  },

  async getSimilar(id: number) {
    const locationId = await LocationService.getLocationId();
    return instance<IProduct[]>({
      url: `${PRODUCTS}/similar/${id}`,
      method: 'GET',
      params: { locationId }
    });
  },
  
  async getBySlug(slug: string): Promise<IProduct> {
    const response = await instance<IProductFull>({
      url: `${PRODUCTS}/by-slug/${slug}`,
      method: 'GET'
    });

    const locationId = await LocationService.getLocationId().catch(() => null);

    return toProductWithPrice(response.data, locationId);
  },

  async getByCategory(categorySlug: string) {
    const locationId = await LocationService.getLocationId();
    return instance<IProduct[]>({
      url: `${PRODUCTS}/by-category/${categorySlug}`,
      method: 'GET',
      params: { locationId }
    })
  },

  async getById(id: string | number): Promise<IProduct> {
    const response = await instance<IProductFull>({
      url: `${PRODUCTS}/${id}`,
      method: 'GET'
    });

    const locationId = await LocationService.getLocationId().catch(() => null);

    return toProductWithPrice(response.data, locationId);
  },

  // Полный ответ API с ценами по всем локациям — для формы редактирования в админке
  async getByIdFull(id: string | number) {
    return instance<IProductFull>({
      url: `${PRODUCTS}/${id}`,
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
    return instance<IProduct>({
      url: `${PRODUCTS}/${id}`,
      method: 'DELETE'
    })
  }
}

