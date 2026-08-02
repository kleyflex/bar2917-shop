'use client'

import { ProductService } from "@/app/services/product/product.service";
import { RootState } from "@/app/store/store";
import { IProduct, IProductFull } from "@/app/types/product.interface";
import MainLayout from "@/components/layouts/MainLayout";
import Product from "@/components/templates/ProductPage/Product";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

interface IProductPageClient {
    initialProduct: IProductFull;
}

export default function ProductPageClient({ initialProduct }: IProductPageClient) {
    const selectedLocationId = useSelector((state: RootState) => state.location.selectedLocationId);

    // Цена и доступность по выбранной локации
    // Если нет выбора берём первую доступную
    const locationInfo = (selectedLocationId
        ? initialProduct.locations.find(item => item.location?.id === selectedLocationId)
        : undefined) ?? initialProduct.locations[0];

    const product: IProduct = {
        id: initialProduct.id,
        name: initialProduct.name,
        slug: initialProduct.slug,
        description: initialProduct.description,
        image: initialProduct.image,
        weight: initialProduct.weight,
        category: initialProduct.category,
        createdAt: initialProduct.createdAt,
        price: locationInfo?.price ?? 0,
        isAvailable: locationInfo?.isAvailable ?? false
    };

    const { data: similarProducts } = useQuery({
        queryKey: ['similar products', product.id, selectedLocationId],
        queryFn: () => ProductService.getSimilar(product.id),
        refetchOnWindowFocus: false
    });

    return (
        <MainLayout>
            <Product
                initialProduct={product}
                similarProducts={similarProducts?.data || []}
                slug={initialProduct.slug}
            />
        </MainLayout>
    );
}
