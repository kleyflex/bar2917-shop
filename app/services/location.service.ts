import { instance } from "@/app/api/api.interceptor";
import { ILocation } from "@/app/types/location.interface";
import { store } from "../store/store";

export type { ILocation } from "@/app/types/location.interface";

const LOCATIONS = 'locations';

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
    return store.getState().location.selectedLocationId;
  },

  // Выбранная точка, иначе точка по умолчанию с сервера
  async getLocationId(): Promise<number> {
    const locationId = this.getUserLocation();

    if (locationId !== null) {
      return locationId;
    }

    const location = await this.getDefault();
    return location.id;
  },

  async getPhoneByAddress(address: string) {
    return instance<{ phone: string }>({
      url: `/${LOCATIONS}/phone/by-address`,
      method: 'GET',
      params: { address }
    })
  }
};
