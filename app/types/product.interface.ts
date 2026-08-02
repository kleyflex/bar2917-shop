import { ICategory } from "./category.interface"


export interface IProduct {
    id: number 
    name: string
    slug: string
    description: string
    price: number
    weight: number
    image: string
    isAvailable: boolean
    category: ICategory
    createdAt?: string
}

export interface IProductLocationInfo {
    price: number
    isAvailable: boolean
    location?: {
        id: number
        name: string | null
        address: string
    }
}

// Товар с ценами по всем локациям
export interface IProductFull {
    id: number
    name: string
    slug: string
    description: string
    weight: number
    image: string
    isActive: boolean
    category: ICategory
    locations: IProductLocationInfo[]
    createdAt?: string
}

export interface IProductDetails {
    product: IProduct
}

export type TypeProducts = {
    length: number
    products: IProduct[]
}