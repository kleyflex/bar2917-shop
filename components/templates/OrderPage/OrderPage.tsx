'use client'
import { useAuth } from '@/components/hocs/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const OrderPage = () => {
    const { user, isInitialized } = useAuth();
    const router = useRouter();

    // Редирект только в эффекте и только после восстановления пользователя
    useEffect(() => {
        if (isInitialized && !user) {
            router.push('/');
        }
    }, [user, isInitialized]);

    if(!user) {
        return null;
    }

    return (
        <>
            <div className="w-10/12 mx-auto my-12 bg-background-card border border-card-border p-6 rounded-lg">
                <div className="flex justify-center items-center flex-col">
                    <div className="text-2xl text-white text-center mb-4">
                        Оформление заказа временно недоступно
                    </div>
                    <div className="text-gray-500 text-center text-sm">
                        <p>Мы работаем над улучшением процесса оформления заказов. 
                        Пожалуйста, свяжитесь с нами по телефону для размещения заказа.</p>
                    </div>
                    <button 
                        className="mt-8 bg-background-button-card hover:bg-opacity-80 text-white px-6 py-3 rounded-md transition-all duration-300"
                        onClick={() => router.push('/')}
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        </>
    );
};

export default OrderPage;