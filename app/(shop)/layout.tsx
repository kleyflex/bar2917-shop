import { getLocations, getMenuCategories, getServerLocationId } from '@/app/api/server-api';
import MainLayout from '@/components/layouts/MainLayout';
import { PropsWithChildren } from 'react';

export default async function ShopLayout({ children }: PropsWithChildren) {
  const locationId = await getServerLocationId();
  const categories = await getMenuCategories(locationId);
  const locations = await getLocations();

  return (
    <MainLayout categories={categories} locations={locations} serverLocationId={locationId}>
      {children}
    </MainLayout>
  );
}
