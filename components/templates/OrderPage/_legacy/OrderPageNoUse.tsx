import { FolderNameForImage, yandexJSAPI } from '@/app/constants/app.constants';
import { OrderService } from '@/app/services/order.service';
import { ProductService } from '@/app/services/product/product.service';
import { IProduct } from '@/app/types/product.interface';
import { useActions } from '@/components/hocs/useActions';
import { useAuth } from '@/components/hocs/useAuth';
import { useCart } from '@/components/hocs/useCart';
import { useProfile } from '@/components/hocs/useProfile';
import MainLayout from '@/components/layouts/MainLayout';
import Loader from '@/components/ui/Loader';
import ButtonCustom from '@/components/ui/button/ButtonCustom';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, Select, SelectItem } from '@nextui-org/react';
import { FullscreenControl, Map, Placemark, Polygon, YMaps, ZoomControl } from '@pbe/react-yandex-maps';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Импортируем иконку маркера
import OrderItem from './OrderItem/OrderItem';


const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string

const OrderPage = () => {
    // Определение типа данных, возвращаемых OrderService.place
    type PlaceOrderResponse = {
        confirmation: {
            confirmation_url: string;
        };
    };

    // Определение типа данных, передаваемых в OrderService.place
    type OrderItem = {
        price: number;
        quantity: number;
        productId: string;
    };

    const { reset } = useActions();
    const { items, total } = useCart();
    const minOrderAmount = 500;
    const [isBelowMinOrder, setIsBelowMinOrder] = useState(false);
    useEffect(() => {
        if (total < minOrderAmount) {
          setIsBelowMinOrder(true);
        } else {
          setIsBelowMinOrder(false);
        }
      }, [total]);
    const { push } = useRouter();
    const [additionalProducts, setAdditionalProducts] = useState<IProduct[]>([]);
    const { user } = useAuth();
    const router = useRouter();

    if(!user) {
        router.push('/');
        return null;
    }
    

    useEffect(() => {
        const fetchAdditionalProducts = async () => {
            try {
                const response: AxiosResponse<IProduct[]> = await ProductService.getByCategory('additionally');
                setAdditionalProducts(response.data); // Установка данных в состояние
            } catch (error) {
                console.error('Ошибка получения дополнительных продуктов:', error);
            }
        };

        fetchAdditionalProducts();
    }, []);

    const placeOrder = async (): Promise<PlaceOrderResponse> => {
        const fullAddress = `${selectedAddress}, кв. ${apartment}${entrance ? `, пар. ${entrance}` : ''}${floor ? `, этаж ${floor}` : ''}`;
        const response: AxiosResponse<PlaceOrderResponse> = await OrderService.place({
            items: items.map(item => ({
                price: item.price,
                quantity: item.quantity,
                productId: item.product.id
            })),
            address: fullAddress,
            commentary: comment,
            deliveryDate: deliveryDatePick,
            deliveryTime: deliveryTimePick
        });
        return response.data;
    };

    const { mutate } = useMutation<PlaceOrderResponse, Error, void>({
        mutationFn: placeOrder,
        onSuccess: (data) => {
            push(data.confirmation.confirmation_url);
            reset();
        }
    });

    const { profile } = useProfile();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [tempAddress, setTempAddress] = useState('');
    const [markerCoords, setMarkerCoords] = useState([59.81, 30.08]);
    const [comment, setComment] = useState('');
    const [apartment, setApartment] = useState('');
    const [entrance, setEntrance] = useState('');
    const [floor, setFloor] = useState('');
    const [isAddressValid, setIsAddressValid] = useState(false);
    const [isCartEmpty, setIsCartEmpty] = useState(true);
    const [isUserValid, setIsUserValid] = useState(false);
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [datesObject, setDatesObject] = useState<{ key: string; label: string; }[]>([]);
    const [timesObject, setTimesObject] = useState<{ key: string; label: string; }[]>([]);
    const [deliveryDatePick, setDeliveryDatePick] = useState('');
    const [deliveryTimePick, setDeliveryTimePick] = useState('');
    const [isTimeSelectDisabled, setIsTimeSelectDisabled] = useState(true);
    const [isDateSelectDisabled, setIsDateSelectDisabled] = useState(false);
    const [isDeliveryClosed, setIsDeliveryClosed] = useState(false);
    const [disabledTimes, setDisabledTimes] = useState<string[]>([]);



    // Проверка на заполненность адреса и квартиры
    useEffect(() => {
        setIsAddressValid(selectedAddress.trim() !== '' && apartment.trim() !== '');
    }, [selectedAddress, apartment]);

    // Проверка на наличие товаров в корзине
    useEffect(() => {
        setIsCartEmpty(items.length === 0);
    }, [items]);

    // Проверка на наличие имени и телефона у пользователя
    useEffect(() => {
        setIsUserValid(profile?.name?.trim() !== '' && profile?.phone?.trim() !== '');
    }, [profile]);

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleApartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApartment(event.target.value);
    };

    const handleEntranceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEntrance(event.target.value);
    };

    const handleFloorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFloor(event.target.value);
    };

    // Функция для сохранения выбранного адреса
    const handleSaveAddress = () => {
        setSelectedAddress(tempAddress);
        setModalVisible(false);
    };

// Генерация дат и времени при загрузке компонента

const generateDates = () => {
    const today = new Date();
    const dates = [];

    // Первым элементом добавляем сегодняшнюю дату
    dates.push({ key: today.toLocaleDateString('ru-RU'), label: today.toLocaleDateString('ru-RU') });

    // Затем добавляем следующие три дня
    for (let i = 1; i < 4; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        dates.push({ key: date.toLocaleDateString('ru-RU'), label: date.toLocaleDateString('ru-RU') });
    }

    return dates;
};

const generateTimes = (isToday: boolean) => {
    const times = [];
    const now = new Date();
    let startTime = new Date();

    if (isToday) {
        // Увеличиваем текущее время на 1 час и 30 минут
        startTime.setHours(now.getHours() + 1);
        startTime.setMinutes(now.getMinutes() + 30 - (now.getMinutes() % 30));
        // Проверяем, если минуты равны 60 или больше, то увеличиваем час и сбрасываем минуты на 0
        if (startTime.getMinutes() >= 60) {
            startTime.setHours(startTime.getHours() + 1);
            startTime.setMinutes(0);
        }
    } else {
        startTime.setHours(12, 0, 0, 0); // Начало времени для не сегодняшнего дня
    }

    const endTime = new Date();
    endTime.setHours(22, 30, 0, 0); // Задаем конечное время 22:30

    while (startTime <= endTime) {
        if (!isToday || startTime > now) {
            times.push({ key: startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), label: startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) });
        }
        startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return times;
}




const checkDeliveryTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour < 11 || (currentHour === 22 && currentMinute > 30) || currentHour >= 23) {
        setIsDeliveryClosed(true);
    } else {
        setIsDeliveryClosed(false);
    }
};


useEffect(() => {
    setDatesObject(generateDates());
    setTimesObject(generateTimes(true));
    checkDeliveryTime()
}, []);

useEffect(() => {
    setIsTimeSelectDisabled(selectedDate === ''); // Если selectedDate пустая строка, то селект времени должен быть disabled

    if (selectedDate) {
        const today = new Date().toLocaleDateString('ru-RU');
        const isToday = selectedDate === today;
        setTimesObject(generateTimes(isToday));
    }
}, [selectedDate]);

useEffect(() => {
    setIsTimeSelectDisabled(selectedDate === '');
 
    const fetchOrders = async () => {
        if (selectedDate) {
            const orders = await OrderService.getAllOrders()
            
            const selectedDateOrders = orders.data.filter((order: any) => 
                order.deliveryDate === selectedDate
            );
            
            const disabledKeys = selectedDateOrders.map((order: any) => 
                order.deliveryTime
            );

            setDisabledTimes(disabledKeys);
            const today = new Date().toLocaleDateString('ru-RU');
            const isToday = selectedDate === today;
            setTimesObject(generateTimes(isToday));
        }
    };

    fetchOrders();
}, [selectedDate]);



    const handleDateChange = (e: { target: { value: any; }; }) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);
        setDeliveryDatePick(selectedDate); // Записываем выбранную дату в состояние deliveryDatePick
    };

    const handleTimeChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const selectedTime = e.target.value;
        setSelectedTime(e.target.value);
        setDeliveryTimePick(selectedTime);
    };

    // Функция для обратного геокодирования и извлечения нужной части адреса
    const getAddressFromCoordinates = async (coords: any[]) => {
        try {
            const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${yandexJSAPI}&format=json&geocode=${coords[1]},${coords[0]}`);
            const data = await response.json();

            // Получаем полный адрес
            const fullAddress = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;

            // Разбиваем адрес на части
            const addressParts = fullAddress.split(', ');

            // Извлекаем нужные части адреса (городской поселок, улица и дом)
            let city = addressParts[4];
            const street = addressParts[5] || '-';
            const house = addressParts[6] || '-';

            if (city === 'городской посёлок Новоселье') {
                city = 'Новоселье';
            }

            if (city !== 'Новоселье') {
                toast.error('Доставка осуществляется только по Новоселье');
                return null;
            }

            return `${city}, ${street}, ${house}`;
        } catch (error) {
            console.error('Error fetching address:', error);
            return null; // Возвращаем null в случае ошибки
        }
    };

    const handleMapClick = async (e: { get: (arg0: string) => any; }) => {
        const coords = e.get('coords');

        // Получаем адрес по координатам
        const address = await getAddressFromCoordinates(coords);
        if (address !== null) {
            setTempAddress(`${address}`);
            setMarkerCoords(coords);
        }
    };

    const handleOpenMap = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const { isLoading } = useAuth();

    const productsToDisplay = ['Имбирь', 'Соевый соус', 'Палочки', 'Васаби'];


    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}`;
    
    return (
        <MainLayout>
            {isLoading ? (
                <Loader />
            ) : (
                <section>
                    <h1>Оформление заказа</h1>
                    <div className='d-flex flex-row'>
                        <div className='w-2/4'>
                            <div>
                                <Input
                                    type='text'
                                    label="Комментарий к заказу"
                                    className="input-custom w-11/12"
                                    isClearable
                                    value={comment}
                                    onChange={handleCommentChange}
                                />
                                <div className='w-11/12 border border-card-border p-3 rounded-lg mt-3'>
                                    <p className='leading-5'>Не забудь топпинги и палочки.</p>
                                    <p>От палочек можно отказаться, чтобы сохранить природу.</p>
                                </div>
                            </div>
                            <div>
                            {additionalProducts
                                .filter(product => productsToDisplay.includes(product.name))
                                .map(product => (       
                                    <OrderItem product={product} />
                                ))}
                            </div>
                            <div className='w-11/12 p-5 bg-background-card rounded-lg border border-card-border mt-5'>
                                <h2 className='text-2xl mb-4'>Адрес доставки</h2>
                                <div>
                                    <div className='d-flex flex-row items-center relative'>
                                        <Input
                                            value={selectedAddress}
                                            disabled
                                            label="Адрес доставки"
                                            isRequired
                                            classNames={{
                                                innerWrapper: "bg-transparent pt-4",
                                                input: "bg-transparent",
                                            }}
                                            endContent={
                                                <FaMapMarkerAlt
                                                    className=' text-blue-500 cursor-pointer absolute bottom-4'
                                                    size={24}
                                                    fill='orange'
                                                    onClick={handleOpenMap}
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='mt-5 flex-row justify-between'>
                                        <Input 
                                            type='text' 
                                            label="Квартира" 
                                            className="input-custom w-36" 
                                            isRequired 
                                            value={apartment}
                                            onChange={handleApartmentChange}
                                        />
                                        <Input 
                                            type='text' 
                                            label="Подъезд" 
                                            className="input-custom w-36"
                                            value={entrance}
                                            onChange={handleEntranceChange}
                                        />
                                        <Input 
                                            type='text' 
                                            label="Этаж" 
                                            className="input-custom w-36"
                                            value={floor}
                                            onChange={handleFloorChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='w-11/12 p-5 bg-background-card rounded-lg border border-card-border mt-5'>       
                            <h2 className='text-2xl mb-4'>Время доставки</h2>              
                            <div className='flex-row justify-between'>
                            <Select label="Выберите дату" size='sm' className='w-6/12' value={selectedDate} onChange={handleDateChange} isDisabled={isDeliveryClosed} classNames={{popoverContent: 'bg-background-card', value: 'text-white'}}>
                                {datesObject.map((dateObject) => (
                                <SelectItem key={dateObject.key} value={dateObject.label} className='selectitem-span'>
                                    {dateObject.label}
                                </SelectItem>
                                ))}
                            </Select>
                            <Select label="Выберите время" size='sm' className='w-5/12' value={selectedTime} onChange={handleTimeChange} classNames={{popoverContent: 'bg-background-card'}} isDisabled={isTimeSelectDisabled} disabledKeys={disabledTimes}>
                                {timesObject.map((timeObject) => (
                                <SelectItem key={timeObject.key} value={timeObject.label} className='selectitem-span'>
                                    {timeObject.label}
                                </SelectItem>
                                ))}
                            </Select>
                            </div>
                            </div>
                        </div>
                        <div className='w-2/4'>
                            <div className='d-flex  w-3/5  bg-background-card border border-card-border rounded-lg p-5'>
                                <div className='flex-row items-center justify-between'>
                                    <h2 className='text-2xl'>Сумма заказа</h2>
                                    <span className='text-xl text-white font-normal'>{total+100} ₽</span>
                                </div>
                                <div>
                                    {isDeliveryClosed && (
                                        <div className='mt-2'>
                                            <p className='text-mainprimary'>* Время приема заказов с 11:00 до 22:00</p>
                                        </div>
                                    )}
                                    {selectedAddress.trim() === '' && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Укажите адрес</p></div>
                                    )}
                                    {apartment.trim() === '' && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Укажите квартиру</p></div>
                                    )}
                                    {isCartEmpty && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Пустая корзина</p></div>
                                    )}
                                    {!isUserValid && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Укажите имя и телефон в профиле</p></div>
                                    )}
                                    {!selectedDate && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Выберите дату доставки</p></div>
                                    )}
                                    {!selectedTime && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Выберите время доставки</p></div>
                                    )}
                                    {isBelowMinOrder && (
                                        <div className='mt-2'><p className='text-mainprimary'>* Минимальная сумма заказа - 500 ₽</p></div>
                                    )}
                                </div>
                                <p className='mt-2'>Стоимость доставки - 100 ₽</p>
                            </div>
                            <div className='d-flex flex-row items-center w-3/5 mt-5'>
                                <Button
                                    className='w-full bg-mainprimary text-white h-14'
                                    onPress={() => mutate()}
                                    isDisabled={!isAddressValid || isCartEmpty || !isUserValid || !selectedDate || !selectedTime || isBelowMinOrder || isDeliveryClosed}
                                >
                                    Оплатить
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={modalVisible} onOpenChange={handleCloseModal} size='full' classNames={{
                        body: "text-black-500",
                        header: "text-black-500",
                        footer: "d-flex justify-center",
                    }}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalBody>
                                        <div>
                                            <p className='text-black text-xl'><strong>Текущий адрес:</strong> {tempAddress}</p>
                                        </div>
                                        <div style={{ height: '80vh' }}>
                                            <YMaps query={{ apikey: yandexJSAPI }}>
                                                <Map
                                                    defaultState={{ center: [59.81, 30.08], zoom: 14 }}
                                                    style={{ width: '100%', height: '100%' }}
                                                    onClick={handleMapClick}
                                                >
                                                    <Polygon
                                                        geometry={[[
                                                            [59.816363323874306, 30.049340797713597],
                                                            [59.80667909171499, 30.04771001463253],
                                                            [59.80161968721998, 30.059554649642294],
                                                            [59.801360209813154, 30.07663495664913],
                                                            [59.80226837187317, 30.085904671004595],
                                                            [59.80317650911478, 30.095603538802454],
                                                            [59.80438732016457, 30.105903221419652],
                                                            [59.8089274686685, 30.111053062728224],
                                                            [59.81333730460038, 30.110366417220412],
                                                            [59.8144612867991, 30.10487325315792],
                                                            [59.815758142074614, 30.080154014876662],
                                                            [59.816363323874306, 30.066335274031935],
                                                            [59.81653623093453, 30.059554649642294],
                                                            [59.816363323874306, 30.049340797713597]
                                                        ]]}
                                                        options={{
                                                            fillColor: 'rgba(160, 193, 0, 0.3)', // Прозрачный цвет заливки
                                                            strokeColor: '#ed4543',
                                                            strokeWidth: 5
                                                        }}
                                                        onClick={handleMapClick}
                                                    />
                                                    <Placemark 
                                                        geometry={markerCoords} 
                                                    />
                                                    <ZoomControl options={{ position: { right: 10, top: 10 } }} />
                                                    <FullscreenControl options={{ position: { right: 10, top: 50 } }} />
                                                </Map>
                                            </YMaps>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter >
                                        <ButtonCustom color="warning" onClick={handleSaveAddress}>
                                            <span className='text-white'>Сохранить адрес</span>
                                        </ButtonCustom>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </section>
            )}
        </MainLayout>
    );
};

export default OrderPage;


