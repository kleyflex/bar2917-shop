// Загрузка данных в серверных компонентах (layout/page). В клиентском коде не импортировать: использует cookies()
import { ICategory } from "@/app/types/category.interface";
import { ILocation, LOCATION_COOKIE } from "@/app/types/location.interface";
import { IProduct, TypeProducts } from "@/app/types/product.interface";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function fetchJson<T>(path: string, revalidate: number): Promise<T | null> {
    try {
        const response = await fetch(`${API_URL}${path}`, { next: { revalidate } });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export const getLocations = async () => (await fetchJson<ILocation[]>('/locations', 300)) ?? [];

// Точка из cookie, если она существует и активна; иначе точка по умолчанию
export async function getServerLocationId(): Promise<number | null> {
    const locations = await getLocations();
    const fromCookie = Number(cookies().get(LOCATION_COOKIE)?.value);

    const selected = locations.find(location => location.id === fromCookie)
        ?? locations.find(location => location.isDefault)
        ?? locations[0];

    return selected?.id ?? null;
}

const withLocation = (locationId: number | null) => (locationId ? `locationId=${locationId}` : '');

export const getMenuCategories = async (locationId: number | null) =>
    (await fetchJson<ICategory[]>(`/categories?${withLocation(locationId)}`, 300)) ?? [];

export const getCategoryBySlug = (slug: string) =>
    fetchJson<ICategory>(`/categories/by-slug/${encodeURIComponent(slug)}`, 300);

export const getProducts = async (locationId: number | null, categorySlug?: string) => {
    const query = [withLocation(locationId), categorySlug ? `categorySlug=${encodeURIComponent(categorySlug)}` : '']
        .filter(Boolean)
        .join('&');

    return (await fetchJson<TypeProducts>(`/products?${query}`, 60))?.products ?? [];
};

export const getProductBySlug = (slug: string, locationId: number | null) =>
    fetchJson<IProduct>(`/products/by-slug/${encodeURIComponent(slug)}?${withLocation(locationId)}`, 60);

export const getSimilarProducts = async (productId: number, locationId: number | null) =>
    locationId
        ? (await fetchJson<IProduct[]>(`/products/similar/${productId}?locationId=${locationId}&limit=8`, 60)) ?? []
        : [];
