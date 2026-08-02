import { IProductFull } from "@/app/types/product.interface";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE;

interface IProductPageParams {
    params: {
        slug: string
    }
}

async function getProduct(slug: string): Promise<IProductFull | null> {
    try {
        const response = await fetch(`${API_URL}/products/by-slug/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) return null;

        return await response.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: IProductPageParams): Promise<Metadata> {
    const product = await getProduct(params.slug);

    if (!product) {
        return { title: 'Товар не найден' };
    }

    const price = product.locations[0]?.price;
    const name = product.name;
    const categoryName = product.category?.name ?? '';

    const description =
        `${name} 🍣 ${product.description} ⭐ Вес: ${product.weight}г 📏 ${price ? `Цена: ${price}₽ 💰 ` : ''}` +
        `Заказывайте ${name.toLowerCase()} в Bar2917! Свежие ингредиенты ✨`;

    // Суффикс «| Bar2917» добавит title.template из корневого layout
    return {
        title: `${name} — ${categoryName} с доставкой`,
        description,
        keywords: `${name.toLowerCase()}, ${categoryName.toLowerCase()}, заказать ${name.toLowerCase()}, ${name.toLowerCase()} цена, бар2917, суши бар`,
        alternates: {
            canonical: `/product/${product.slug}`
        },
        openGraph: {
            title: `${name} — ${categoryName} с доставкой в Bar2917`,
            description,
            images: product.image ? [`${IMAGE_URL}/assets/${product.image}`] : []
        }
    };
}

export default async function ProductPage({ params }: IProductPageParams) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    return <ProductPageClient initialProduct={product} />;
}
