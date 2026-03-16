import { RootState } from '@/app/store/store';
import MainLayout from "@/components/layouts/MainLayout";
import { useSelector } from 'react-redux';

const DeliveryInfo = () => {
    const { locations } = useSelector((state: RootState) => state.location);

    return(
        <MainLayout>
            <div className="delivery-info">
                <section className="delivery-info__header">
                    <h1>Доставка и оплата</h1>
                    <p className="delivery-info__subtitle">
                        Быстрая доставка вкусных роллов в любую точку зоны доставки
                    </p>
                </section>

                <section className="delivery-info__main">
                    <div className="delivery-info__block">
                        <h2>🚚 Условия доставки</h2>
                        <div className="delivery-info__conditions">
                            <div className="delivery-info__condition-item">
                                <span className="condition-label">Стоимость доставки:</span>
                                <span className="condition-value">от 150 ₽</span>
                            </div>
                            <div className="delivery-info__condition-item">
                                <span className="condition-label">Минимальная сумма заказа:</span>
                                <span className="condition-value">500 ₽</span>
                            </div>
                            <div className="delivery-info__condition-item">
                                <span className="condition-label">Среднее время доставки:</span>
                                <span className="condition-value">60 минут</span>
                            </div>
                            <div className="delivery-info__condition-item">
                                <span className="condition-label">Время работы доставки:</span>
                                <span className="condition-value">11:00 - 23:00</span>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-info__block">
                        <h2>📍 Наши адреса</h2>
                        <div className="delivery-info__locations">
                            {locations.map((location) => (
                                <div key={location.id} className="delivery-info__location-item">
                                    <div className="location-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FF8A00"/>
                                        </svg>
                                    </div>
                                    <span>{location.address}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="delivery-info__block">
                        <h2>💳 Способы оплаты</h2>
                        <div className="delivery-info__payment-methods">
                            <div className="payment-method">
                                <div className="payment-icon">💵</div>
                                <div className="payment-details">
                                    <h3>Наличными</h3>
                                    <p>Оплата наличными курьеру при получении</p>
                                </div>
                            </div>
                            <div className="payment-method">
                                <div className="payment-icon">💳</div>
                                <div className="payment-details">
                                    <h3>Картой</h3>
                                    <p>Оплата картой курьеру при получении</p>
                                </div>
                            </div>
                            <div className="payment-method">
                                <div className="payment-icon">🏃</div>
                                <div className="payment-details">
                                    <h3>Самовывоз</h3>
                                    <p>Оплата при получении в ресторане</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-info__block">
                        <h2>ℹ️ Важная информация</h2>
                        <div className="delivery-info__notes">
                            <p>Время доставки может варьироваться в зависимости от загруженности кухни и дорожной ситуации</p>
                            <p>Для компаний от 4-х человек рекомендуем делать предзаказ</p>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}

export default DeliveryInfo;
