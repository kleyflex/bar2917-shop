import { getMenuCategories, getServerLocationId } from '@/app/api/server-api';
import MainLayout from '@/components/layouts/MainLayout';
import { PropsWithChildren } from 'react';

export default async function ShopLayout({ children }: PropsWithChildren) {
  const locationId = await getServerLocationId();
  const categories = await getMenuCategories(locationId);

  return (
    <MainLayout categories={categories} serverLocationId={locationId}>
      {children}
    </MainLayout>
  );
}
