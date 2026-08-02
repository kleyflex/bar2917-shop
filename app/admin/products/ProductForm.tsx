'use client'

import { CategoryService } from "@/app/services/category.service";
import { FileService } from "@/app/services/file.service";
import { LocationService } from "@/app/services/location.service";
import { ProductService } from "@/app/services/product/product.service";
import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/ui/Loader";
import ButtonCustom from "@/components/ui/button/ButtonCustom";
import Field from "@/components/ui/input/Field";
import { Switch } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string;

interface IProductFormValues {
    name: string;
    description: string;
    weight: string;
    categoryId: string;
    isActive: boolean;
    // Ключ — id локации, значение — цена строкой (пустая = нет цены в этой точке)
    prices: Record<string, string>;
}

interface IProductForm {
    productId?: number;
}

const ProductForm = ({ productId }: IProductForm) => {
    const isEdit = productId !== undefined;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<IProductFormValues>({
        defaultValues: { isActive: true, prices: {} }
    });

    const isActive = watch('isActive');

    // Текущее имя файла картинки на сервере и локально выбранный новый файл
    const [imageName, setImageName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    const { data: categories } = useQuery({
        queryKey: ['admin categories'],
        queryFn: () => CategoryService.getAllCategories(),
        select: response => response.data
    });

    const { data: locations } = useQuery({
        queryKey: ['admin locations'],
        queryFn: () => LocationService.getAll()
    });

    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ['admin product', productId],
        queryFn: () => ProductService.getByIdFull(productId!),
        select: response => response.data,
        enabled: isEdit
    });

    // Заполняем форму данными товара при редактировании
    useEffect(() => {
        if (!product) return;

        const prices: Record<string, string> = {};
        for (const item of product.locations) {
            if (item.location) prices[String(item.location.id)] = String(item.price);
        }

        reset({
            name: product.name,
            description: product.description,
            weight: String(product.weight),
            categoryId: String(product.category?.id ?? ''),
            isActive: product.isActive,
            prices
        });
        setImageName(product.image);
        setImagePreview(product.image ? `${SERVER_URL_FOR_IMAGE}/assets/${product.image}` : '');
    }, [product, reset]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const { mutateAsync: saveProduct, isPending } = useMutation({
        mutationKey: ['save product'],
        mutationFn: async (values: IProductFormValues) => {
            let image = imageName;

            if (imageFile) {
                const uploaded = await FileService.uploadImage(imageFile);
                image = uploaded.data.filename;
            }

            const items = Object.entries(values.prices)
                .filter(([, price]) => String(price).trim() !== '')
                .map(([locationId, price]) => ({
                    locationId: Number(locationId),
                    price: Number(price)
                }));

            const baseData = {
                name: values.name.trim(),
                description: values.description.trim(),
                weight: Number(values.weight) || 0,
                categoryId: Number(values.categoryId),
                image
            };

            let id = productId;

            if (!isEdit) {
                const created = await ProductService.create(baseData);
                id = created.data.id;
            }

            return ProductService.update(id!, {
                ...baseData,
                isActive: values.isActive,
                items
            });
        },
        onSuccess: () => {
            toast.success(isEdit ? 'Товар обновлён' : 'Товар создан');
            queryClient.invalidateQueries({ queryKey: ['getAdminProducts'] });
            router.push('/admin/products');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message;
            toast.error(Array.isArray(message) ? message.join(', ') : message || 'Не удалось сохранить товар');
        }
    });

    const onSubmit: SubmitHandler<IProductFormValues> = values => saveProduct(values);

    if (isEdit && isProductLoading) {
        return (
            <MainLayout>
                <Loader />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <section className="max-w-2xl">
                <h1>{isEdit ? 'Редактирование товара' : 'Новый товар'}</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
                    <Field
                        label="Название"
                        placeholder="Например: Филадельфия"
                        error={errors.name?.message}
                        {...register('name', { required: 'Введите название' })}
                    />

                    <div>
                        <label className="block mb-1 text-sm text-gray-400">Описание</label>
                        <textarea
                            rows={3}
                            placeholder="Состав, особенности"
                            className="w-full p-3 rounded-lg bg-background-input border border-card-border text-white placeholder:text-gray-500 focus:border-background-button-card outline-none transition-colors"
                            {...register('description')}
                        />
                    </div>

                    <div className="flex flex-row gap-4">
                        <Field
                            label="Вес, г"
                            type="number"
                            placeholder="250"
                            error={errors.weight?.message}
                            {...register('weight', { required: 'Укажите вес' })}
                        />

                        <div className="w-full">
                            <label className="block mb-1 text-sm text-gray-400">Категория</label>
                            <select
                                className="w-full h-11 px-3 rounded-lg bg-background-input border border-card-border text-white focus:border-background-button-card outline-none transition-colors"
                                {...register('categoryId', { required: 'Выберите категорию' })}
                            >
                                <option value="">— выберите —</option>
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <div className="mt-1 text-sm text-red-500">{errors.categoryId.message}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-400">Фото</label>
                        <div className="flex flex-row items-center gap-4">
                            {imagePreview && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imagePreview}
                                    alt={watch('name') || 'Фото товара'}
                                    className="w-28 h-20 object-cover rounded-lg border border-card-border"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="text-sm text-gray-400 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-background-button-card file:text-white file:cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-400">Цены по точкам</label>
                        <div className="flex flex-col gap-2">
                            {locations?.map(location => (
                                <div key={location.id} className="flex flex-row items-center gap-3">
                                    <span className="w-1/2 text-sm">{location.name || location.address}</span>
                                    <Field
                                        placeholder="Цена, ₽"
                                        type="number"
                                        className="w-1/2"
                                        {...register(`prices.${location.id}`)}
                                    />
                                </div>
                            ))}
                            {!locations?.length && (
                                <span className="text-sm text-gray-500">Точки не загружены</span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Пустое поле — товар не продаётся в этой точке (существующая цена останется прежней)
                        </p>
                    </div>

                    <Switch
                        isSelected={isActive}
                        onValueChange={value => setValue('isActive', value)}
                        size="sm"
                        classNames={{ wrapper: 'group-data-[selected=true]:bg-background-button-card' }}
                    >
                        Показывать в каталоге
                    </Switch>

                    <div className="flex flex-row gap-3 mt-2">
                        <ButtonCustom type="submit" disabled={isPending}>
                            {isPending ? 'Сохранение…' : 'Сохранить'}
                        </ButtonCustom>
                        <button
                            type="button"
                            className="px-4 rounded-lg border border-card-border text-gray-400 hover:text-white transition-colors"
                            onClick={() => router.push('/admin/products')}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </section>
        </MainLayout>
    );
};

export default ProductForm;
