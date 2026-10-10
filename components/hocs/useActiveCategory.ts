'use client'
import { useActiveCategorySlug } from '@/components/layouts/ActiveCategoryContext'
import { usePathname } from 'next/navigation'

// Slug категории для подсветки в меню: из URL /category/[slug],
// а на странице товара — категория товара (её сообщает сама страница)
export const useActiveCategory = (): string | null => {
    const pathname = usePathname()
    const fromPage = useActiveCategorySlug()

    const match = pathname.match(/^\/category\/([^/]+)/)
    if (match) return decodeURIComponent(match[1])

    if (pathname.startsWith('/product/')) return fromPage

    return null
}
