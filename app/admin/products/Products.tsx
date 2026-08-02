'use client'
import MainLayout from "@/components/layouts/MainLayout"
import ButtonCustom from "@/components/ui/button/ButtonCustom"
import Loader from "@/components/ui/Loader"
import AdminActions from "@/components/ui/admin/admin-list/admin-actions/AdminActions"
import { Pagination } from "@nextui-org/pagination"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FC, useMemo, useState } from "react"
import { useAdminProducts } from "./useAdminProducts"

const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string
const ITEMS_PER_PAGE = 7

const Products: FC = () => {
    const { data, isFetching, mutate } = useAdminProducts()
    const router = useRouter()

    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return data ?? []
        return (data ?? []).filter(row =>
            row.name.toLowerCase().includes(query) ||
            row.categoryName.toLowerCase().includes(query)
        )
    }, [data, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const page = Math.min(currentPage, totalPages)
    const visibleRows = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <MainLayout>
            <section>
                <div className="flex flex-row items-center justify-between w-10/12">
                    <h1>Все товары</h1>
                    <ButtonCustom type="button" onClick={() => router.push('/admin/products/new')}>
                        Новый товар
                    </ButtonCustom>
                </div>

                <input
                    type="search"
                    placeholder="Поиск по названию или категории"
                    value={search}
                    onChange={event => {
                        setSearch(event.target.value)
                        setCurrentPage(1)
                    }}
                    className="mt-4 w-10/12 h-11 px-3 rounded-lg bg-background-input border border-card-border text-white placeholder:text-gray-500 focus:border-background-button-card outline-none transition-colors"
                />

                {isFetching ? (
                    <Loader />
                ) : filtered.length ? (
                    <>
                        <table className="mt-4 w-10/12 border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="font-normal pl-2 w-28">Фото</th>
                                    <th className="font-normal">Название</th>
                                    <th className="font-normal">Категория</th>
                                    <th className="font-normal">Статус</th>
                                    <th className="font-normal text-right pr-2">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.map(row => (
                                    <tr key={row.id} className="bg-background-card border border-card-border">
                                        <td className="p-2 rounded-l-lg">
                                            {row.image ? (
                                                <Image
                                                    src={`${SERVER_URL_FOR_IMAGE}/assets/${row.image}`}
                                                    alt={row.name}
                                                    height={64}
                                                    width={96}
                                                    className="rounded-lg object-cover h-16 w-24"
                                                />
                                            ) : (
                                                <div className="h-16 w-24 rounded-lg bg-background-input" />
                                            )}
                                        </td>
                                        <td className="text-mainprimary">{row.name}</td>
                                        <td>{row.categoryName}</td>
                                        <td>
                                            <span className={row.isActive ? 'text-green-500' : 'text-gray-500'}>
                                                {row.isActive ? 'В каталоге' : 'Скрыт'}
                                            </span>
                                        </td>
                                        <td className="rounded-r-lg">
                                            <div className="flex justify-end">
                                                <AdminActions
                                                    viewUrl={`/product/${row.slug}`}
                                                    editUrl={`/admin/products/${row.id}`}
                                                    removeHandler={() => {
                                                        if (confirm(`Удалить товар «${row.name}»?`)) mutate(row.id)
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="mt-4 w-10/12 flex justify-center">
                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={setCurrentPage}
                                    aria-label="Страницы списка товаров"
                                    showControls
                                    classNames={{ cursor: "bg-background-button-card" }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="mt-6 text-gray-400">
                        {search ? 'По запросу ничего не найдено' : 'Товаров пока нет'}
                    </div>
                )}
            </section>
        </MainLayout>
    )
}

export default Products
