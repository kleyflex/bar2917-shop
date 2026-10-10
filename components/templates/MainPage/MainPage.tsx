'use client'

import { IProduct } from '@/app/types/product.interface';
import Hero from '@/components/modules/MainPage/Hero/Hero';
import EmptyState from '@/components/ui/EmptyState';
import CatalogMain from '@/components/ui/catalog/CatalogMain';
import LocationSelectorHero from '@/components/ui/location/LocationSelectorHero';

interface IMainPage {
  // Товары выбранной точки, загружены на сервере
  products: IProduct[];
}

const MainPage = ({ products }: IMainPage) => {
  return (
    <>
      <LocationSelectorHero />
      <Hero />
      {products.length ? (
        <CatalogMain title="Популярное" products={products} />
      ) : (
        <EmptyState
          title="Не удалось загрузить меню"
          description="Обновите страницу или попробуйте чуть позже."
        />
      )}
    </>
  );
};

export default MainPage;
