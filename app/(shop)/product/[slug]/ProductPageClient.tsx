'use client'

import { IProduct } from "@/app/types/product.interface";
import { useSetActiveCategory } from "@/components/layouts/ActiveCategoryContext";
import Product from "@/components/templates/ProductPage/Product";

interface IProductPageClient {
    product: IProduct;
    similarProducts: IProduct[];
}

// Товар и похожие приходят с сервера уже с ценой выбранной точки
export default function ProductPageClient({ product, similarProducts }: IProductPageClient) {
    // Подсветка категории товара в меню
    useSetActiveCategory(product.category?.slug);

    return (
        <Product
            initialProduct={product}
            similarProducts={similarProducts}
            slug={product.slug}
        />
    );
}
