import { FolderNameForImage } from "@/app/constants/app.constants";
import { ICartItem } from "@/app/types/cart.interface";
import Image from "next/image";
import { FC } from "react";
import CartActions from "./CartActions/CartActions";

const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string

const CartItem: FC<{item: ICartItem}> = ({item}) => {
    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}/${item.product.image}`;
    return (
        <div className="cart__item flex-row mt-4 h-22 border-b-1">
            <div className="cart__div__img ">
                <Image width={100} height={100} src={imageUrl} alt={item.product.name} className="cart__img rounded-lg"/>
            </div>
            <div className="cart__content ml-2 w-64">
                <div className="cart__contfalse)p__row flex-row h-12 justify-between">
                    <h3 className="text-sm">{item.product.name}</h3>
                    <div className="cart__content__amount h-20">
                        <CartActions item={item}/>
                    </div>
                </div>
                <div className="cart__content__down__row pb-3 w-24">
                    <span className="text-white text-sm">{item.price} ₽</span>
                </div>
            </div>
        </div>
    )
}

export default CartItem