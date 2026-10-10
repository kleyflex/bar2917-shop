'use client';

import { ICategory } from '@/app/types/category.interface';
import { IProduct } from '@/app/types/product.interface';
import EmptyState from '@/components/ui/EmptyState';
import Catalog from '@/components/ui/catalog/Catalog';
import { Tab, Tabs } from '@nextui-org/tabs';
import { useState } from 'react';

interface ICategoryPageClient {
  category: ICategory;
  products: IProduct[];
}

// Товары приходят с сервера уже для выбранной точки (cookie), поэтому каталог есть в HTML для поисковиков.
// При смене точки LocationCookieSync делает router.refresh(), и сюда приходят новые товары
export default function CategoryPageClient({ category, products }: ICategoryPageClient) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const filteredProducts = category.slug === 'rolls' ?
    activeTab === 0 ? products :
    activeTab === 1 ? products.filter(product => product.image.includes('classicrolls')) :
    products.filter(product => product.image.includes('baked'))
    : products;

  return (
    <>
      <div className='flex-row justify-between ctg'>
        <h1>{category.name}</h1>
        {category.slug === 'rolls' && (
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
    </>
  );
}
