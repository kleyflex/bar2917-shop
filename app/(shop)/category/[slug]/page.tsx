import { getCategoryBySlug, getProducts, getServerLocationId } from "@/app/api/server-api";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

interface ICategoryPageParams {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ICategoryPageParams): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return { title: 'Категория не найдена' };
  }

  const name = category.name;
  const description = `${name} в Bar2917 | Свежие ингредиенты | Большой выбор ${name.toLowerCase()} | Быстрая доставка | Выгодные цены | Заказывайте онлайн!`;

  return {
    title: `${name} — заказать с доставкой`,
    description,
    keywords: `${name.toLowerCase()}, заказать ${name.toLowerCase()}, доставка ${name.toLowerCase()}, японская кухня, бар2917, суши бар`,
    alternates: {
      canonical: `/category/${params.slug}`
    },
    openGraph: {
      title: `${name} в Bar2917`,
      description
    }
  };
}

export default async function CategoryPage({ params }: ICategoryPageParams) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const locationId = await getServerLocationId();
  const products = await getProducts(locationId, category.slug);

  return <CategoryPageClient category={category} products={products} />;
}
