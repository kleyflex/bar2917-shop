import { FolderNameForImage } from "@/app/constants/app.constants";
import { OrderService } from "@/app/services/order.service";
import { IOrder } from "@/app/types/order.interface";
import { useActions } from "@/components/hocs/useActions";
import { useAuth } from "@/components/hocs/useAuth";
import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/ui/Loader";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SelectedCard from "./SelectedCard/SelectedCard";

const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string

const OrderHistory = () => {
    const { user, isLoading } = useAuth();
    const { addToCart } = useActions();
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}/`;

    useEffect(() => {
        if (!user) {
            router.push('/auth');
        }
    }, [user, router]);

    const { data: orders, error } = useQuery({
        queryKey: ['my orders'],
        queryFn: () => OrderService.getOrdersByUser(),
        select: (data) => data.data,
        enabled: !!user
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const statusTranslations: { [key: string]: string } = {
        PENDING: "Ожидает оплату",
        PAYED: "Оплачено",
        SHIPPED: "Отправлено",
        DELIVERED: "Доставлено",
        CANCELED: "Отменено"
    };

    const statusColors: { [key: string]: string } = {
        PENDING: "text-orange-500",
        PAYED: 'text-green-500',
        SHIPPED: "text-blue-500",
        DELIVERED: "text-purple-500",
        CANCELED: "text-red-500"
    };

    const getStatusTranslation = (status: string) => statusTranslations[status] || status;

    const getStatusColor = (status: string) => statusColors[status] || "text-gray-500";

    const handleRepeatOrder = () => {
        if (selectedOrder) {
            selectedOrder.items.forEach(item => {
                addToCart(item); // Предполагаем, что addToCart принимает объект item
            });
            toast.success('Заказ добавлен в корзину!');
        }
    };

    return (
        <MainLayout>
            <section>
                <h1>Мои заказы</h1>
                <div className="flex-row">
                    <div className="w-6/12">
                        <div>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    {orders?.length ? (
                                        orders.map(order => (
                                            <div
                                                key={order.id}
                                                className={`p-4 mb-2 rounded-lg cursor-pointer ${selectedOrder?.id === order.id ? 'border border-background-button-card' : 'border border-background-card'}`}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <div className="flex-row justify-between">
                                                    <h2>{formatDate(order.createdAt)}, {new Date(order.createdAt).toLocaleTimeString()}</h2>
                                                    <h2>{order.total} ₽</h2>
                                                </div>
                                                <div className="flex-row justify-between mt-3">
                                                    <p className="w-9/12 line-clamp-1">{order.address}</p>
                                                    <p className={getStatusColor(order.status)}>{getStatusTranslation(order.status)}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>
                                            <h2>Заказов пока нет</h2>
                                        </div>
                                    )}
                                </>
                            )}
                            {error && <p>Ошибка при загрузке заказов: {error.message}</p>}
                        </div>
                    </div>
                    <div className="w-5/12 ml-5">
                        {selectedOrder && (
                            <div>
                                <div className="flex-row justify-between">
                                    <h2>Заказ № {selectedOrder.id}</h2>
                                    <p className={getStatusColor(selectedOrder.status)}>{getStatusTranslation(selectedOrder.status)}</p>
                                </div>
                                <p className="mt-1">{formatDate(selectedOrder.createdAt)}, {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                                <p className="mt-1">Доставка на {selectedOrder.deliveryDate} {selectedOrder.deliveryTime}</p>
                                <p className="mt-1">{selectedOrder.address}</p>
                                <div>
                                    {selectedOrder.items.map(item => <SelectedCard item={item} key={item.id} />)}
                                </div>
                                <div className="flex-row justify-between mt-2">
                                    <p className="text-white text-sm">Оплата:</p>
                                    <p className="text-white text-sm">Online-оплата</p>
                                </div>
                                <div className="flex-row justify-between mt-3">
                                    <p className="text-white text-lg font-medium">Сумма заказа:</p>
                                    <p className="text-white text-lg font-medium">{selectedOrder.total} ₽</p>
                                </div>
                                <Button className="bg-background-button-card mt-3" onClick={handleRepeatOrder}>Повторить заказ</Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default OrderHistory;
