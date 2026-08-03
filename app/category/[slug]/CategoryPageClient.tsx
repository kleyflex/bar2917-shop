'use client';

import NotFound from '@/app/not-found';
import { CategoryService } from '@/app/services/category.service';
import { IProductsByLocation, LocationService } from '@/app/services/location.service';
import { RootState } from '@/app/store/store';
import MainLayout from '@/components/layouts/MainLayout';
import EmptyState from '@/components/ui/EmptyState';
import CatalogSkeleton from '@/components/ui/catalog/CatalogSkeleton';
import { Tab, Tabs } from '@nextui-org/tabs';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Catalog = dynamic(() => import('@/components/ui/catalog/Catalog'), { ssr: false });

interface ICategoryPageClient {
  slug: string;
}

export default function CategoryPageClient({ slug }: ICategoryPageClient) {
  const selectedLocationId = useSelector((state: RootState) => state.location.selectedLocationId);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => CategoryService.getBySlug(slug),
    enabled: !!slug
  });

  const { data: productsData, isLoading: productsLoading, error: productsError, refetch } = useQuery<IProductsByLocation>({
    queryKey: ['category-products', slug, selectedLocationId],
    queryFn: () => LocationService.getProductsByCategory(slug),
    enabled: !!slug && !!selectedLocationId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1
  });

  const category = categoryData?.data;
  const products = productsData?.products || [];

  const filteredProducts = slug === 'rolls' ?
    activeTab === 0 ? products :
    activeTab === 1 ? products.filter(product => product.image.includes('classicrolls')) :
    products.filter(product => product.image.includes('baked'))
    : products;

  if (categoryLoading || productsLoading) {
    return (
      <MainLayout>
        <CatalogSkeleton />
      </MainLayout>
    );
  }

  if (categoryError || !category) {
    return <NotFound />;
  }

  if (productsError) {
    return (
      <MainLayout>
        <EmptyState
          title="Не удалось загрузить товары"
          description="Проверьте соединение и попробуйте ещё раз."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 h-10 rounded-lg bg-mainprimary text-white hover:opacity-90 transition-opacity"
            >
              Повторить
            </button>
          }
        />
      </MainLayout>
    );
  }

  return (
    <main>
      <MainLayout>
        <div className='flex-row justify-between ctg'>
          <h1>{category.name}</h1>
          {slug === 'rolls' && (
            <div className='flex flex-row items-center mb-3'>
              <Tabs
                aria-label="Rolls Filter Tabs"
                selectedKey={activeTab.toString()}
                onSelectionChange={(key) => setActiveTab(Number(key))}
                classNames={{
                  tabList: "flex-row",
                  tab: "text-[10px] sm:text-sm",
                  cursor: "bg-mainprimary",
                  tabContent: "py-0 group-data-[selected=true]:text-white",
                }}
                size="sm"
                radius="sm"
                color="warning"
              >
                <Tab key="0" title="Все" />
                <Tab key="1" title="Классические" />
                <Tab key="2" title="Запеченные" />
              </Tabs>
            </div>
          )}
        </div>
        {filteredProducts.length > 0 ? (
          <Catalog products={filteredProducts} />
        ) : (
          <EmptyState
            title="В этом ресторане нет блюд из этой категории"
            description="Выберите другую категорию или другой ресторан."
          />
        )}
      </MainLayout>
    </main>
  );
}
