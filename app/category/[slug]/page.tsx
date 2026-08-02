import { ICategory } from "@/app/types/category.interface";
import type { Metadata } from 'next';
import CategoryPageClient from "./CategoryPageClient";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface ICategoryPageParams {
  params: {
    slug: string;
  };
}

async function getCategory(slug: string): Promise<ICategory | null> {
  try {
    const response = await fetch(`${API_URL}/categories/by-slug/${slug}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ICategoryPageParams): Promise<Metadata> {
  const category = await getCategory(params.slug);

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

export default function CategoryPage({ params }: ICategoryPageParams) {
  return <CategoryPageClient slug={params.slug} />;
}
