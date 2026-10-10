import { getProductBySlug, getServerLocationId, getSimilarProducts } from "@/app/api/server-api";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

const IMAGE_URL = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE;

interface IProductPageParams {
    params: {
        slug: string
    }
}

// Цена — точки из cookie; у поисковиков cookie нет, им отдаётся цена точки по умолчанию
async function getProduct(slug: string) {
    const locationId = await getServerLocationId();
    const product = await getProductBySlug(slug, locationId);
    return { product, locationId };
}

export async function generateMetadata({ params }: IProductPageParams): Promise<Metadata> {
    const { product } = await getProduct(params.slug);

    if (!product) {
        return { title: 'Товар не найден' };
    }

    const name = product.name;
    const categoryName = product.category?.name ?? '';

    const productDescription = product.description?.trim().replace(/[.!]+$/, '');

    const description = [
        name,
        productDescription,
        `Вес: ${product.weight} г`,
        product.price ? `Цена: ${product.price} ₽` : '',
        `Заказывайте ${name.toLowerCase()} в Bar2917 — только свежие ингредиенты`
    ].filter(Boolean).join('. ') + '.';

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
    const { product, locationId } = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    const similarProducts = await getSimilarProducts(product.id, locationId);

    return <ProductPageClient product={product} similarProducts={similarProducts} />;
}
