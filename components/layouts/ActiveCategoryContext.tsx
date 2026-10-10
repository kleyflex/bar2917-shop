'use client'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

interface IActiveCategoryContext {
  activeCategorySlug: string | null
  setActiveCategorySlug: (slug: string | null) => void
}

const ActiveCategoryContext = createContext<IActiveCategoryContext>({
  activeCategorySlug: null,
  setActiveCategorySlug: () => {}
})

// Категория, которую нужно подсветить в меню, когда её не видно из URL (страница товара)
export const ActiveCategoryProvider = ({ children }: PropsWithChildren) => {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)

  return (
    <ActiveCategoryContext.Provider value={{ activeCategorySlug, setActiveCategorySlug }}>
      {children}
    </ActiveCategoryContext.Provider>
  )
}

export const useActiveCategorySlug = () => useContext(ActiveCategoryContext).activeCategorySlug

// Страница сообщает свою категорию на время, пока она открыта
export const useSetActiveCategory = (slug: string | null | undefined) => {
  const { setActiveCategorySlug } = useContext(ActiveCategoryContext)

  useEffect(() => {
    setActiveCategorySlug(slug ?? null)
    return () => setActiveCategorySlug(null)
  }, [slug, setActiveCategorySlug])
}
