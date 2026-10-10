"use client"
import LogoSidebar from '@/components/elements/LogoSidebar/LogoSidebar';
import { useActiveCategory } from '@/components/hocs/useActiveCategory';
import { useCategoryLinks } from '@/components/hocs/useCategoryLinks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Статистика', isActive: (path: string) => path === '/admin' },
  { href: '/admin/products', label: 'Товары', isActive: (path: string) => path.startsWith('/admin/products') }
];

interface ISidebarMenu {
  variant?: 'shop' | 'admin'
}

const SidebarMenu = ({ variant = 'shop' }: ISidebarMenu) => {
  const pathname = usePathname();
  const categories = useCategoryLinks();
  const activeSlug = useActiveCategory();

  const isAdmin = variant === 'admin';

  return (
    <div className='sidebar__container h-screen'>
      <div className='sidebar__logo'>
        <LogoSidebar />
      </div>
      <nav className='sidebar__menu' aria-label={isAdmin ? 'Меню админки' : 'Категории меню'}>
        {isAdmin
          ? ADMIN_LINKS.map(link => {
              const isActive = link.isActive(pathname);
              return (
                <Link
                  key={link.href}
                  className={`sidebar__menu__item${isActive ? ' is-active' : ''}`}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className='sidebar__menu__item__span'>{link.label}</span>
                </Link>
              );
            })
          : categories.map(category => {
              const isActive = category.slug === activeSlug;
              return (
                <Link
                  key={category.id}
                  className={`sidebar__menu__item${isActive ? ' is-active' : ''}`}
                  href={`/category/${category.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={`sidebar__menu__item__div item--${category.slug}`} />
                  <span className='sidebar__menu__item__span'>{category.name}</span>
                </Link>
              );
            })}
      </nav>
    </div>
  )
}

export default SidebarMenu;
