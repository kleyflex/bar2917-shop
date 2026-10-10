import DeliveryInfo from '@/components/templates/DeliveryInfoPage/DeliveryInfo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Доставка суши и роллов Bar2917 | Условия доставки и оплаты',
  description: 'Условия доставки Bar2917 | Быстрая доставка суши и роллов | Зоны доставки | Минимальная сумма заказа | Способы оплаты | Время доставки | Закажите прямо сейчас!',
  keywords: 'доставка суши, условия доставки роллов, зона доставки бар2917, стоимость доставки суши, время доставки роллов, оплата заказа суши, минимальный заказ роллов',
  alternates: {
    canonical: '/delivery-info'
  }
}

export default function DeliveryInfoPage() {
  return <DeliveryInfo />
}
