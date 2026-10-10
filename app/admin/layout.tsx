import MainLayout from '@/components/layouts/MainLayout';
import { PropsWithChildren } from 'react';

export default function AdminLayout({ children }: PropsWithChildren) {
  return <MainLayout variant="admin">{children}</MainLayout>;
}
