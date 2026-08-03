"use client"
import LogoSidebar from '@/components/elements/LogoSidebar/LogoSidebar';
import { useCategoryLinks } from '@/components/hocs/useCategoryLinks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarMenu = () => {
  const pathname = usePathname();
  const categories = useCategoryLinks();

  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className='sidebar__container h-screen'>
      <div className='sidebar__logo'>
        <LogoSidebar />
      </div>
      <nav className='sidebar__menu' aria-label={isAdmin ? 'Меню админки' : 'Категории меню'}>
        {isAdmin ? (
          <>
            <Link className='sidebar__menu__item' href='/admin'>
              <span className='sidebar__menu__item__span'>Статистика</span>
            </Link>
            <Link className='sidebar__menu__item' href='/admin/products'>
              <span className='sidebar__menu__item__span'>Товары</span>
            </Link>
          </>
        ) : (
          categories.map(category => (
            <Link
              key={category.id}
              className='sidebar__menu__item animate-scaleIn'
              href={`/category/${category.slug}`}
            >
              <div className={`sidebar__menu__item__div item--${category.slug}`} />
              <span className='sidebar__menu__item__span'>{category.name}</span>
            </Link>
          ))
        )}
      </nav>
    </div>
  )
}

export default SidebarMenu;
