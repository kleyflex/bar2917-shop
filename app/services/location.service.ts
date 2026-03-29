import { instance } from "@/app/api/api.interceptor";
import { store } from "../store/store";

export interface ILocation {
  id: number;
  name: string;
  address: string;
  isDefault: boolean;
  isActive: boolean;
  phone: string;
  products: Array<{
    price: number;
    isAvailable: boolean;
    product: {
      id: number;
      name: string;
      slug: string;
      description: string;
      weight: number;
      image: string;
      category: {
        id: number;
        name: string;
        slug: string;
      };
    };
  }>;
}

const LOCATIONS = 'locations';

export interface IProductsByLocation {
  products: any[];
  locationId: number;
}

export const LocationService = {
  async getAll() {
    const response = await instance<ILocation[]>({
      url: `/${LOCATIONS}`,
      method: 'GET'
    });
    return response.data;
  },

  async getDefault() {
    const response = await instance<ILocation>({
      url: `/${LOCATIONS}/default`,
      method: 'GET'
    });
    return response.data;
  },

  getUserLocation(): number | null {
    const locationId = store.getState().location.selectedLocationId;
    return locationId;
  },

  async getLocationId(): Promise<number> {
    const locationId = this.getUserLocation();

    if (locationId !== null) {
      return locationId;
    }

    try {
      const locations = await this.getAll();

      if (locations && locations.length > 0) {
        const defaultLocation = locations.find(loc => loc.isDefault);
        if (defaultLocation) {
          return defaultLocation.id;
        }
        const activeLocation = locations.find(loc => loc.isActive);
        if (activeLocation) {
          return activeLocation.id;
        }
      }

      throw new Error('No locations available');
    } catch (error) {
      console.error('Error getting location ID:', error);
      throw error;
    }
  },

  async getProductsByCategory(categorySlug: string): Promise<{ products: any[], locationId: number }> {
    // Получаем текущую локацию из store
    const { locations, selectedLocationId } = store.getState().location;

    if (!locations.length) {
      throw new Error('No locations available');
    }

    // Находим выбранную локацию
    let targetLocation = selectedLocationId 
      ? locations.find(loc => loc.id === selectedLocationId)
      : locations.find(loc => loc.isDefault && loc.isActive) || locations.find(loc => loc.isActive);

    if (!targetLocation) {
      throw new Error('No active locations found');
    }

    // Фильтруем продукты для нужной категории
    const processedProducts = targetLocation.products
      .filter(item => item.isAvailable && item.product.category.slug === categorySlug)
      .map(item => ({
        ...item.product,
        price: item.price,
        isAvailable: item.isAvailable
      }));

    return {
      products: processedProducts,
      locationId: targetLocation.id
    };
  },

  async getLocationWithProducts(): Promise<{ products: any[], locationId: number }> {
    const { locations, selectedLocationId } = store.getState().location;
    
    if (!locations.length) {
      throw new Error('No locations available');
    }

    let targetLocation = selectedLocationId 
      ? locations.find(loc => loc.id === selectedLocationId)
      : locations.find(loc => loc.isDefault && loc.isActive) || locations.find(loc => loc.isActive);

    if (!targetLocation) {
      throw new Error('No active locations found');
    }

    const processedProducts = targetLocation.products
      .filter(item => item.isAvailable)
      .map(item => ({
        ...item.product,
        price: item.price,
        isAvailable: item.isAvailable
      }));

    return {
      products: processedProducts,
      locationId: targetLocation.id
    };
  },

  async getPhoneByAddress(address: string) {
    return instance<{ phone: string }>({
      url: `/${LOCATIONS}/phone/by-address?address=${address}`,
      method: 'GET'
    })
  }
}; 