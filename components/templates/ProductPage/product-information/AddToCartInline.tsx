'use client'
import { IProduct } from "@/app/types/product.interface";
import { useCartStepper } from "@/components/hocs/useCartStepper";
import { useIsMobile } from "@/components/hocs/useIsMobile";
import ButtonCustom from "@/components/ui/button/ButtonCustom";
import { FC } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";

interface AddToCartInlineProps {
    product: IProduct;
    alignRight?: boolean;
}

const AddToCartInline: FC<AddToCartInlineProps> = ({ product, alignRight = false }) => {
    const isMobile = useIsMobile(480);
    const { currentElement, quantity, isMaxReached, add, increase, decrease } = useCartStepper(product);

    return (
        <div className={`${isMobile ? 'w-full' : ''} ${alignRight ? 'flex justify-end' : ''}`}>
            {currentElement ? (
                <div className={`flex-row items-center ${isMobile ? 'justify-center' : 'justify-between'}`}>
                    <ButtonCustom
                        className="btn__card product__item__card__button left h-mobile-card"
                        aria-label="Уменьшить количество"
                        onClick={decrease}
                    >
                        <FiMinus fontSize={13} />
                    </ButtonCustom>
                    <span className={`text-white font-normal ${isMobile ? 'w-64 text-center h-mobile-card text-xs' : 'w-60 text-center h-full'} bg-background-button-card flex justify-center items-center`}>
                        {quantity} x {product.price} ₽
                    </span>
                    <ButtonCustom
                        className="btn__card product__item__card__button right h-mobile-card"
                        aria-label="Увеличить количество"
                        onClick={increase}
                        disabled={isMaxReached}
                    >
                        <FaPlus />
                    </ButtonCustom>
                </div>
            ) : (
                <ButtonCustom
                    className={`btn__card product__item__card__button ${isMobile ? 'w-full h-mobile-card' : ''}`}
                    onClick={add}
                >
                    <div className={`flex-row items-center ${isMobile ? 'w-full justify-center' : 'w-20 justify-between '}`}>
                        <FaPlus />
                        <span className="text-white font-normal ml-2">{product.price} ₽</span>
                    </div>
                </ButtonCustom>
            )}
        </div>
    );
}

export default AddToCartInline
