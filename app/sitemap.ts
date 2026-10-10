import { MetadataRoute } from 'next';
import { ICategory } from './types/category.interface';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

async function fetchJson<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
        { url: `${SITE_URL}/contacts`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/delivery-info`, changeFrequency: 'monthly', priority: 0.5 }
    ];

    const categories = await fetchJson<ICategory[]>(`${API_URL}/categories`) ?? [];

    const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
        url: `${SITE_URL}/category/${category.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8
    }));

    // Товары всех точек: у разных ресторанов меню может отличаться
    const locations = await fetchJson<{ id: number }[]>(`${API_URL}/locations`) ?? [];
    const productSlugs = new Set<string>();
    for (const location of locations) {
        const data = await fetchJson<{ products: { slug: string }[] }>(`${API_URL}/products?locationId=${location.id}`);
        data?.products.forEach(product => productSlugs.add(product.slug));
    }

    const productPages: MetadataRoute.Sitemap = Array.from(productSlugs, slug => ({
        url: `${SITE_URL}/product/${slug}`,
        changeFrequency: 'weekly',
        priority: 0.7
    }));

    return [...staticPages, ...categoryPages, ...productPages];
}
