import { ProductService } from "@/app/services/product/product.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface IAdminProductRow {
    id: number;
    name: string;
    image: string;
    categoryName: string;
    isActive: boolean;
    slug: string;
}

export const useAdminProducts = () => {
    const { data, isFetching, refetch } = useQuery({
        queryKey: ['getAdminProducts'],
        queryFn: () => ProductService.getAll(),
        select: data => data.data.products.map((product): IAdminProductRow => ({
            id: product.id,
            name: product.name,
            image: product.image,
            categoryName: product.category?.name ?? '—',
            isActive: (product as { isActive?: boolean }).isActive ?? true,
            slug: product.slug
        }))
    })

    const { mutate } = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: (id: number) => ProductService.delete(id),
        onSuccess: () => {
            toast.success('Товар удалён')
            refetch()
        },
        onError: () => {
            toast.error('Не удалось удалить товар')
        }
    })

    return {
        mutate,
        data,
        isFetching
    }
}
