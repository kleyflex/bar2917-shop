'use client'
import { FolderNameForImage } from "@/app/constants/app.constants";
import { IProduct } from "@/app/types/product.interface";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SimilarProducts from "./SimilarProducts";
import AddToCartInline from "./product-information/AddToCartInline";

interface IProductPage {
    initialProduct: IProduct;
    similarProducts: IProduct[];
    slug?: string;
}

const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string;

export default function Product({
    initialProduct,
    similarProducts,
    slug = '',
}: IProductPage) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 480);
        };
        
        // Проверяем при загрузке
        checkIsMobile();
        
        // Слушаем изменение размера экрана
        window.addEventListener('resize', checkIsMobile);
        
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    // Данные приходят с сервера через ProductPageClient и уже учитывают выбранную локацию
    const product = initialProduct;
    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}/${product.image}`;

    return (
        <section className="mt-6">
            <div className={`${isMobile ? 'flex-col' : 'flex-row'} w-10/12 bg-background-card border border-card-border p-3 rounded-lg mx-auto`}>
                <div className={`${isMobile ? 'w-full mb-4' : 'w-5/12'}`}>
                    <Image 
                        width={427} 
                        height={217} 
                        src={imageUrl} 
                        alt={product.name} 
                        className="rounded-lg w-full h-auto" 
                    />
                </div>
                <div className={`${isMobile ? 'w-full' : 'ml-3 flex-wrap w-7/12'} justify-between`}>
                    <div className={`${isMobile ? '' : 'h-10/12'}`}>
                        <h2 className="text-2xl">{product.name}</h2>
                        <div className="w-full">
                            <p className="mt-2 break-words leading-4">{product.description}</p>
                        </div>
                        <span className="mt-2 block">{product.weight} г.</span>
                    </div>
                    {isMobile ? (
                        // Мобильная версия - цена слева, кнопка справа
                        <div className="flex flex-row justify-between items-center mt-4 w-full">
                            <div className="w-1/2 pr-2">
                                <h2 className="text-2xl">{product.price} ₽</h2>
                                <span className="text-sm">Полная цена</span>
                            </div>
                            <div className="w-1/2 pl-2">
                                <AddToCartInline product={product} alignRight={true} />
                            </div>
                        </div>
                    ) : (
                        // Десктопная версия - без изменений
                        <div className="h-2/12 w-full flex-row justify-between mt-4">
                            <div className="w-3/12">
                                <h2 className="text-2xl">{product.price} ₽</h2>
                                <span>Полная цена</span>
                            </div>
                            <div className="w-64 mt-2">
                                <AddToCartInline product={product} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {similarProducts.length > 0 && (
                <SimilarProducts similarProducts={similarProducts} />
            )}
        </section>
    );
}