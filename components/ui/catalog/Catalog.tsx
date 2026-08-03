'use client'
import { IProduct } from "@/app/types/product.interface";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { FC, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import EmptyState from "../EmptyState";
import ProductItem from "./product-item/ProductItem";

interface ICatalog {
    products: IProduct[]
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
                    <Input
                        aria-label="Поиск по каталогу"
                        placeholder="Поиск по названию или составу"
                        value={search}
                        onValueChange={setSearch}
                        isClearable
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        startContent={<FiSearch className="text-gray-500 shrink-0" />}
                        className="input-custom w-full sm:max-w-sm"
                        classNames={{
                            inputWrapper: "h-11 bg-background-card border-card-border data-[hover=true]:border-mainprimary group-data-[focus=true]:border-mainprimary",
                            input: "text-white placeholder:text-gray-500"
                        }}
                    />
                    <Select
                        aria-label="Сортировка товаров"
                        selectedKeys={[sort]}
                        onSelectionChange={keys => setSort(Array.from(keys)[0] as TypeSort)}
                        disallowEmptySelection
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        className="select-custom w-full sm:w-56"
                        classNames={{
                            trigger: "h-11 bg-background-card border-card-border data-[hover=true]:border-mainprimary data-[open=true]:border-mainprimary",
                            value: "text-white",
                            popoverContent: "select-custom__popover bg-background-card border border-card-border"
                        }}
                    >
                        {SORT_OPTIONS.map(option => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="selectitem-span text-white data-[hover=true]:bg-background-input data-[selected=true]:bg-mainprimary"
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
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
