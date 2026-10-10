'use client'
import { ICategory } from '@/app/types/category.interface'
import { createContext, PropsWithChildren, useContext } from 'react'

const MenuCategoriesContext = createContext<ICategory[]>([])

// Категории меню приходят с сервера (layout) уже для выбранной точки,
// поэтому сайдбар и мобильное меню есть в первом HTML и не мигают при гидрации
export const MenuCategoriesProvider = ({ categories, children }: PropsWithChildren<{ categories: ICategory[] }>) => (
  <MenuCategoriesContext.Provider value={categories}>
    {children}
  </MenuCategoriesContext.Provider>
)

export const useMenuCategories = () => useContext(MenuCategoriesContext)
