import { FolderNameForImage } from "@/app/constants/app.constants";
import { ICartItem } from "@/app/types/cart.interface";
import Image from "next/image";
import { FC } from "react";


const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string

const SelectedCard: FC<{item: ICartItem}> = ({item}) => {
    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}/${item.product.image}`;
    return (
        <div className="w-full flex-row mt-4 h-20 border border-card-border bg-background-card rounded-lg p-2">
            <div className="w-3/12">
                <Image width={100} height={100} src={imageUrl} alt={item.product.name} className="cart__img rounded-lg"/>
            </div>
            <div className="ml-2 w-9/12">
                    <div className="flex-row justify-between items-center">
                        <h2 className="w-9/12 text-sm">{item.product.name}</h2>
                        <h2>{item.price} ₽</h2>
                    </div>
                    <div className="flex-row justify-end mt-2">
                        <p>{item.quantity} шт.</p>
                    </div>
            </div>
        </div>
    )
}

export default SelectedCard