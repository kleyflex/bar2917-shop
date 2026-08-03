'use client'
import { TypeRootState } from "@/app/store/store"
import { useMemo } from "react"
import { useSelector } from "react-redux"

export interface ICategoryLink {
    id: number
    name: string
    slug: string
}

// Категории меню строятся из товаров выбранной точки
export const useCategoryLinks = () => {
    const { locations, selectedLocationId } = useSelector((state: TypeRootState) => state.location)

    return useMemo<ICategoryLink[]>(() => {
        const location = (selectedLocationId
            ? locations.find(item => item.id === selectedLocationId)
            : undefined)
            ?? locations.find(item => item.isDefault && item.isActive)
            ?? locations.find(item => item.isActive)

        if (!location) return []

        const byId = new Map<number, ICategoryLink>()

        for (const item of location.products) {
            const category = item.product?.category
            if (category && !byId.has(category.id)) {
                byId.set(category.id, {
                    id: category.id,
                    name: category.name,
                    slug: category.slug
                })
            }
        }

        return Array.from(byId.values()).sort((a, b) => a.id - b.id)
    }, [locations, selectedLocationId])
}
