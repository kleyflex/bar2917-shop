import { instance } from "@/app/api/api.interceptor"
import { store } from "@/app/store/store"
import { IProduct, TypeProducts } from "@/app/types/product.interface"
import { LocationService } from "../location.service"
import { PRODUCTS, TypeProductData, TypeProductDataFilters } from "./product.types"

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
  
  async getBySlug(slug: string) {
    try {
      // Получаем текущую локацию из store
      const { locations, selectedLocationId } = store.getState().location;

      if (!locations.length) {
        throw new Error('No locations available');
      }

      // Находим выбранную локацию
      const targetLocation = selectedLocationId 
        ? locations.find(loc => loc.id === selectedLocationId)
        : locations.find(loc => loc.isDefault && loc.isActive) || locations.find(loc => loc.isActive);

      if (!targetLocation) {
        throw new Error('No active locations found');
      }

      // Ищем продукт в локации
      const locationProduct = targetLocation.products.find(item => item.product.slug === slug);
      
      if (!locationProduct) {
        throw new Error('Product not found');
      }

      // Возвращаем в нужном формате
      return {
        data: {
          data: {
            ...locationProduct.product,
            price: locationProduct.price,
            isAvailable: locationProduct.isAvailable
          }
        }
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getByCategory(categorySlug: string) {
    const locationId = await LocationService.getLocationId();
    return instance<IProduct[]>({
      url: `${PRODUCTS}/by-category/${categorySlug}`,
      method: 'GET',
      params: { locationId }
    })
  },

  async getById(id: string | number) {
    try {
      // Получаем текущую локацию из store
      const { locations, selectedLocationId } = store.getState().location;

      if (!locations.length) {
        throw new Error('No locations available');
      }

      // Находим выбранную локацию
      const targetLocation = selectedLocationId 
        ? locations.find(loc => loc.id === selectedLocationId)
        : locations.find(loc => loc.isDefault && loc.isActive) || locations.find(loc => loc.isActive);

      if (!targetLocation) {
        throw new Error('No active locations found');
      }

      // Ищем продукт в локации
      const locationProduct = targetLocation.products.find(item => item.product.id === Number(id));
      
      if (!locationProduct) {
        throw new Error('Product not found');
      }

      // Возвращаем в нужном формате
      return {
        data: {
          ...locationProduct.product,
          price: locationProduct.price,
          isAvailable: locationProduct.isAvailable
        }
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async create() {
    return instance<IProduct>({
      url: PRODUCTS,
      method: 'POST'
    })
  },

  async update(id: string | number, data: TypeProductData) {
    return instance<IProduct>({
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

