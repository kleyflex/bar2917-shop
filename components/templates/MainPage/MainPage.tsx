'use client'

import { LocationService } from '@/app/services/location.service';
import { setLocations } from '@/app/store/location/location.slice';
import { TypeRootState } from '@/app/store/store';
import MainLayout from '@/components/layouts/MainLayout';
import Hero from '@/components/modules/MainPage/Hero/Hero';
import EmptyState from '@/components/ui/EmptyState';
import CatalogMain from '@/components/ui/catalog/CatalogMain';
import CatalogSkeleton from '@/components/ui/catalog/CatalogSkeleton';
import LocationSelectorHero from '@/components/ui/location/LocationSelectorHero';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MainPage = () => {
  const dispatch = useDispatch();
  const { locations, selectedLocationId } = useSelector((state: TypeRootState) => state.location);

  // Загружаем локации
  const { data: locationsData} = useQuery({
    queryKey: ['get locations'],
    queryFn: () => LocationService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 минут
  });
  
  // Сохраняем локации в store
  useEffect(() => {
    if (locationsData) {
      dispatch(setLocations(locationsData));
    }
  }, [locationsData, dispatch]);

  // Загружаем продукты
  const { data: productsData, isLoading, error, refetch } = useQuery({
    queryKey: ['main-products', selectedLocationId],
    queryFn: async () => {
      const result = await LocationService.getLocationWithProducts();
      return result;
    },
    enabled: !!locations.length,
  });

  // Пока локации не пришли, запрос товаров ещё даже не стартовал —
  // это тоже загрузка, а не «товаров нет»
  const isCatalogLoading = isLoading || !locations.length;

  return (
    <MainLayout>
      <LocationSelectorHero />
      <Hero />
      {isCatalogLoading ? (
        <section className="media-768">
          <h1>Популярное</h1>
          <CatalogSkeleton count={8} />
        </section>
      ) : error ? (
        <EmptyState
          title="Не удалось загрузить меню"
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
      ) : (
        <CatalogMain
          title="Популярное"
          products={productsData?.products || []}
        />
      )}
    </MainLayout>
  );
};

export default MainPage;
