import { FolderNameForImage } from "@/app/constants/app.constants"
import { IProduct } from "@/app/types/product.interface"
import Image from "next/image"
import { FC } from "react"
import AddToCartButtonAddition from "./AddToCartButtonAddition"


const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string

const OrderItem: FC<{product: IProduct}> = ({product}) => {
    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}/${product.image}`
    return (
        <div key={product.id} className='w-11/12 border border-card-border p-3 rounded-lg mt-3 flex-row'>
        <div className="w-3/12">
        <Image width={90} height={90} src={imageUrl} alt={product.name} className="cart__img rounded-lg"/>
        </div>
        <div className="flex-row justify-between w-full ml-3">
        <div className="h-full w-60 justify-between">
        <h3>{product.name}</h3>
        <p className="text-white text-xl font-medium">{product.price} ₽</p>
        </div>
        <div>
        <AddToCartButtonAddition product={product} />
        </div>
        </div>
    </div>
    )
}

export default OrderItem