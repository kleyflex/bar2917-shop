'use client'
import { IProduct } from "@/app/types/product.interface";
import { FC, useMemo, useState } from "react";
import EmptyState from "../EmptyState";
import ProductItem from "./product-item/ProductItem";

interface ICatalog {
    products: IProduct[]
    // Управление скрывается там, где каталог показывается подборкой
    withControls?: boolean
}

type TypeSort = 'default' | 'price-asc' | 'price-desc' | 'name'

const SORT_OPTIONS: { value: TypeSort; label: string }[] = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'price-asc', label: 'Сначала дешевле' },
    { value: 'price-desc', label: 'Сначала дороже' },
    { value: 'name', label: 'По названию' }
]

const Catalog: FC<ICatalog> = ({ products = [], withControls = true }) => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<TypeSort>('default')

    const visibleProducts = useMemo(() => {
        const query = search.trim().toLowerCase()

        const filtered = query
            ? products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query)
              )
            : products

        // Копия массива: сортировка на месте мутировала бы пропсы
        const sorted = [...filtered]

        if (sort === 'price-asc') sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        else if (sort === 'price-desc') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'))

        return sorted
    }, [products, search, sort])

    return (
        <section>
            {withControls && products.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <input
                        type="search"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Поиск по названию или составу"
                        aria-label="Поиск по каталогу"
                        className="w-full sm:max-w-sm h-11 px-3 rounded-lg bg-background-card border border-card-border text-white placeholder:text-gray-500 focus:border-mainprimary outline-none transition-colors"
                    />
                    <select
                        value={sort}
                        onChange={event => setSort(event.target.value as TypeSort)}
                        aria-label="Сортировка товаров"
                        className="w-full sm:w-56 h-11 px-3 rounded-lg bg-background-card border border-card-border text-white focus:border-mainprimary outline-none transition-colors"
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex-row flex-wrap gap-5 media-480-gap">
                {visibleProducts.length ? (
                    visibleProducts.map(product => <ProductItem key={product.id} product={product} />)
                ) : search ? (
                    <EmptyState
                        title="Ничего не нашлось"
                        description={`По запросу «${search}» товаров нет. Попробуйте изменить запрос.`}
                    />
                ) : (
                    <EmptyState title="Здесь пока нет товаров" />
                )}
            </div>
        </section>
    )
}

export default Catalog;
