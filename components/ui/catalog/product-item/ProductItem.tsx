import { getImageUrl } from "@/app/helpers/image"
import { IProduct } from "@/app/types/product.interface"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import AddToCartButton from "./AddToCartButton"

const ProductItem: FC<{product: IProduct}> = ({product}) => {
    return (
        <div className="bg-background-card card__template border-1 border-card-border rounded-lg animate-scaleIn flex flex-col">
            <Link href={`/product/${product.slug}`}>
                <div className="product__item__card__image">
                    <Image
                        width={262}
                        height={180}
                        sizes="(max-width: 480px) 45vw, (max-width: 768px) 40vw, 270px"
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="card__img rounded-lg"
                    />
                </div>
            </Link>
            <div className="flex-row justify-between mt-3.5 items-baseline media-480">
                <div className="w-60">
                    <Link href={`/product/${product.slug}`}>
                    <h3 className="">{product.name}</h3>
                    </Link>
                </div>
                <div className="w-14 flex-row justify-end">
                    <span className="card__weight font-normal">{product.weight} г</span>
                </div>
            </div>
            <div className="flex-col flex-grow">
                <p className="mt-2 leading-4 line-clamp-2">{product.description}</p>
                <div className="flex-grow"></div>
                {!!product.price && (
                    <span className="mt-2 text-lg text-white font-medium">{product.price} ₽</span>
                )}
                <div className="flex-row justify-center mt-auto">
                    <AddToCartButton product={product}></AddToCartButton>
                </div>
            </div>
        </div>
    )
}

export default ProductItem
