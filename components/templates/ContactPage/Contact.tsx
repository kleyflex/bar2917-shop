'use client'
import { RootState } from '@/app/store/store';
import MainLayout from "@/components/layouts/MainLayout";
import { useSelector } from 'react-redux';

const Contact = () => {
    const { selectedLocationId, locations } = useSelector((state: RootState) => state.location);
    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
    const phoneNumber = selectedLocation?.phone || '+7 (981) 156-56-67';

    return(
        <MainLayout>
            <div className="contacts">
                <section className="contacts__header">
                    <h1>Контакты BAR2917</h1>
                    <p className="contacts__subtitle">
                        Мы всегда на связи и готовы ответить на ваши вопросы
                    </p>
                </section>

                <section className="contacts__main-info">
                    <div className="contacts__block">
                        <h2>📞 Связаться с нами</h2>
                        <p><strong>Телефон:</strong> {phoneNumber}</p>
                        <p><strong>Адрес:</strong> {selectedLocation?.address || 'гп. Новоселье, проспект Питерский, дом 5'}</p>
                    </div>

                    <div className="contacts__block">
                        <h2>⏰ Время работы</h2>
                        <p><strong>Режим работы:</strong> ежедневно до 23:00</p>
                        <p><strong>Доставка:</strong> ежедневно с 11:00</p>
                    </div>
                </section>

                <section className="contacts__about">
                    <h2>🍣 О нас</h2>
                    <p>
                        <strong>BAR2917 – современная доставка самых вкусных роллов!</strong>
                    </p>
                    <p>
                        Более 2-х лет мы радуем жителей Новоселья качественными роллами и суши. 
                        Наша миссия – делать японскую кухню доступной, сохраняя высочайшие стандарты качества.
                    </p>
                    <div className="contacts__advantages">
                        <h3>Почему выбирают нас:</h3>
                        <ul>
                            <li>Используем только свежие ингредиенты от проверенных поставщиков</li>
                            <li>Строго соблюдаем технологию приготовления</li>
                            <li>Обеспечиваем быструю доставку по оптимальным маршрутам</li>
                            <li>Регулярно проводим акции и дарим подарки постоянным клиентам</li>
                        </ul>
                    </div>
                </section>

                <section className="contacts__legal">
                    <h2>📄 Юридическая информация</h2>
                    <div className="contacts__legal-details">
                        <p><strong>ИП Бондарчук Екатерина Сергеевна</strong></p>
                        <p><strong>ИНН:</strong> 780255513697</p>
                        <p><strong>ОГРН:</strong> 318470400111956</p>
                        <p><strong>Юридический адрес:</strong><br />
                        188507, Россия, Ленинградская обл., Ломоносовский р-н,<br />
                        городской посёлок Новоселье, проспект Питерский, дом 5</p>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}

export default Contact;