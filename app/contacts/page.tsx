import Contact from '@/components/templates/ContactPage/Contact'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакты Bar2917 | Адреса ресторанов и служба доставки',
  description: 'Контакты суши-бара Bar2917 | Телефоны для заказа | Адреса ресторанов | Время работы | Зоны доставки | Свяжитесь с нами для заказа вкусных роллов и суши!',
  keywords: 'контакты бар2917, адрес суши бар, телефон доставки суши, заказать суши по телефону, время работы суши бар, зона доставки суши, bar2917 контакты',
  alternates: {
    canonical: '/contacts'
  }
}

export default function Contacts() {
  return <Contact />
}
