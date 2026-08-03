'use client'
import { IProduct } from "@/app/types/product.interface";
import { useCartStepper } from "@/components/hocs/useCartStepper";
import ButtonCustom from "@/components/ui/button/ButtonCustom";
import { FC } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";

const AddToCartButton: FC<{ product: IProduct }> = ({ product }) => {
    const { currentElement, quantity, isMaxReached, add, increase, decrease } = useCartStepper(product);

    return (
        <div className="w-full">
            {currentElement ? (
                <div className="flex-row items-center justify-between">
                    <ButtonCustom
                        className="btn__card product__item__card__button left"
                        aria-label="Уменьшить количество"
                        onClick={decrease}
                    >
                        <FiMinus fontSize={13} />
                    </ButtonCustom>
                    <div className="w-52 bg-background-button-card h-12 justify-center mobile-btn">
                        <span className="text-white font-normal">
                            {quantity} x {product.price} ₽
                        </span>
                    </div>
                    <ButtonCustom
                        className="btn__card product__item__card__button right"
                        aria-label="Увеличить количество"
                        onClick={increase}
                        disabled={isMaxReached}
                    >
                        <FaPlus />
                    </ButtonCustom>
                </div>
            ) : (
                <ButtonCustom
                    className="btn__card product__item__card__button"
                    onClick={add}
                >
                    <div className="flex-row items-center justify-center gap-2 w-full">
                        <FaPlus />
                        <span className="text-white font-normal">
                            {product.price} ₽
                        </span>
                    </div>
                </ButtonCustom>
            )}
        </div>
    );
};

export default AddToCartButton;
