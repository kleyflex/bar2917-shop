'use client'
import { IProduct } from "@/app/types/product.interface"
import { useActions } from "@/components/hocs/useActions"
import { useCart } from "@/components/hocs/useCart"
import toast from "react-hot-toast"

export const MAX_QUANTITY = 50

// Общая логика степпера корзины
export const useCartStepper = (product: IProduct) => {
    const { addToCart, removeFromCart, changeQuantity } = useActions()
    const { items } = useCart()

    const currentElement = items.find(cartItem => cartItem.product.id === product.id)

    const add = () => addToCart({ product, quantity: 1, price: product.price })

    const decrease = () => {
        if (!currentElement) return

        if (currentElement.quantity === 1) {
            removeFromCart({ id: currentElement.id })
        } else {
            changeQuantity({ id: currentElement.id, type: 'minus' })
        }
    }

    const increase = () => {
        if (!currentElement) return

        if (currentElement.quantity < MAX_QUANTITY) {
            changeQuantity({ id: currentElement.id, type: 'plus' })
        } else {
            toast.error(`Максимальное количество — ${MAX_QUANTITY}`)
        }
    }

    return {
        currentElement,
        quantity: currentElement?.quantity ?? 0,
        // Проверка достижения максимального кол-ва товара
        isMaxReached: (currentElement?.quantity ?? 0) >= MAX_QUANTITY,
        add,
        increase,
        decrease
    }
}
