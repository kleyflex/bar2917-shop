'use client';

import { ProductService } from "@/app/services/product/product.service";
import { RootState } from "@/app/store/store";
import { IPageSlugParam } from "@/app/types/page-params";
import { IProduct } from "@/app/types/product.interface";
import MainLayout from "@/components/layouts/MainLayout";
import Product from "@/components/templates/ProductPage/Product";
import Loader from "@/components/ui/Loader";
import Meta from '@/components/ui/meta';
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProductPage({ params }: IPageSlugParam) {
    const selectedLocationId = useSelector((state: RootState) => state.location.selectedLocationId);
    const slug = params?.slug;
    
    if (!slug) {
        return notFound();
    }

    const { data: productData, isLoading: productLoading, error: productError } = useQuery({
        queryKey: ['get product', slug, selectedLocationId],
        queryFn: () => ProductService.getBySlug(slug),
        enabled: !!selectedLocationId,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: 1
    });

    const productId = productData?.data?.data?.id;

    const { data: similarProducts, isLoading: similarLoading } = useQuery<AxiosResponse<IProduct[]>>({
        queryKey: ['similar products', productId, selectedLocationId],
        queryFn: () => {
            if (!productId) return Promise.resolve({ 
                data: [], 
                status: 200, 
                statusText: "OK",
                headers: {},
                config: {} as any
            });
            return ProductService.getSimilar(productId);
        },
        enabled: !!productId && !!selectedLocationId,
        staleTime: 0,
        refetchOnWindowFocus: false
    });

    if (!selectedLocationId) {
        return (
            <MainLayout>
                <div className="text-center text-white mt-8">
                    Пожалуйста, выберите ресторан
                </div>
            </MainLayout>
        );
    }

    if (productLoading || similarLoading) {
        return (
            <MainLayout>
                <Loader />
            </MainLayout>
        );
    }

    if (productError || !productData?.data?.data) {
        return notFound();
    }

    const product = productData.data.data;
    const { name, description, weight, price, category, image } = product;

    const getMetaDescription = () => {
        let desc = `${name} 🍣 ${description} ⭐ `;
        desc += `Вес: ${weight}г 📏 Цена: ${price}₽ 💰 `;
        desc += `Заказывайте ${name.toLowerCase()} с доставкой в Bar2917! `;
        desc += `Свежие ингредиенты ✨ Быстрая доставка 🚗 Закажите онлайн или по телефону!`;
        return desc;
    };

    const getMetaKeywords = () => {
        return `${name.toLowerCase()}, ${category.name.toLowerCase()}, заказать ${name.toLowerCase()}, 
        купить ${name.toLowerCase()}, ${category.name.toLowerCase()} с доставкой, 
        ${name.toLowerCase()} цена, ${name.toLowerCase()} состав, бар2917, суши бар`;
    };

    return (
        <>
            <Meta 
                title={`${name} | ${category.name} в Bar2917 | Заказать с доставкой`}
                description={getMetaDescription()}
                keywords={getMetaKeywords()}
                image={image}
            />
            <MainLayout>
                <Product 
                    initialProduct={product}
                    similarProducts={similarProducts?.data || []}
                    slug={slug}
                />
            </MainLayout>
        </>
    );
}

