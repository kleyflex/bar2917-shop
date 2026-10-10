import { ICategory } from '@/app/types/category.interface';
import Footer from '../modules/Footer/Footer';
import Header from '../modules/header/Header';
import MobileNav from '../modules/MobileNav/MobileNav';
import SidebarMenu from '../modules/SidebarMenu/SidebarMenu';
import { ActiveCategoryProvider } from './ActiveCategoryContext';
import LocationCookieSync from './LocationCookieSync';
import { MenuCategoriesProvider } from './MenuCategoriesContext';

interface IMainLayout {
  children: React.ReactNode
  variant?: 'shop' | 'admin'
  categories?: ICategory[]
  serverLocationId?: number | null
}

// Оболочка сайта. Подключается один раз в app/(shop)/layout.tsx и app/admin/layout.tsx,
// поэтому сайдбар и шапка не перемонтируются при переходах между страницами
const MainLayout = ({ children, variant = 'shop', categories = [], serverLocationId = null }: IMainLayout) => {
  return (
    <MenuCategoriesProvider categories={categories}>
      <ActiveCategoryProvider>
        <LocationCookieSync serverLocationId={serverLocationId} />
        <div className='main__content container'>
          <SidebarMenu variant={variant} />
          <div className='main__content__own'>
            <Header />
            <main>
            {children}
            </main>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </ActiveCategoryProvider>
    </MenuCategoriesProvider>
  )
}

export default MainLayout
