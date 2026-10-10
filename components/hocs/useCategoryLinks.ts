'use client'
import { useMenuCategories } from "@/components/layouts/MenuCategoriesContext"

export type { ICategory as ICategoryLink } from "@/app/types/category.interface"

// Категории меню выбранной точки (загружаются на сервере в layout)
export const useCategoryLinks = () => useMenuCategories()
