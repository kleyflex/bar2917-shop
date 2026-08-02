
export const PRODUCTS = 'products'

// POST /products — создание товара
export type TypeProductCreateData = {
  name: string
  description?: string
  image?: string
  weight?: number
  categoryId: number
}

// PUT /products/:id — обновление товара с ценами по локациям
export type TypeProductUpdateData = {
  name: string
  description?: string
  image: string
  weight: number
  isActive: boolean
  categoryId: number
  items: {
    locationId: number
    price: number
  }[]
}

export type TypeProductDataFilters = {
    sort?: EnumProductSort
    searchTerm?: string
}

export enum EnumProductSort {
    HIGH_PRICE = 'high-price',
    LOW_PRICE = 'low-price',
    NEWEST = 'newest',
    OLDEST = 'oldest',
}
