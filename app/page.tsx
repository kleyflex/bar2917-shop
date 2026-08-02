import MainPage from '@/components/templates/MainPage/MainPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Доставка суши и роллов в Bar2917 | Японская кухня с доставкой',
  description: 'Заказать суши и роллы с доставкой в Bar2917 | Свежие ингредиенты | Большой выбор роллов и сетов | Быстрая доставка | Выгодные цены | Заказывайте онлайн или по телефону!',
  keywords: 'доставка суши, заказать роллы, суши бар, японская кухня, сеты роллов, бар2917, доставка роллов, доставка японской еды, заказ суши онлайн, суши сет, роллы филадельфия, роллы калифорния, запеченные роллы, новоселье, санкт-петербург',
  alternates: {
    canonical: '/'
  }
}

export default function Home() {
  return <MainPage />
}
