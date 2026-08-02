import { IProduct } from "@/app/types/product.interface";
import { useActions } from "@/components/hocs/useActions";
import { useCart } from "@/components/hocs/useCart";
import ButtonCustom from "@/components/ui/button/ButtonCustom";
import { FC } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";

const AddToCartButtonAddition: FC<{ product: IProduct }> = ({ product }) => {
    // const { user } = useAuth()
    // if(!user) return toast('Сначала авторизуйтесь')

    const { addToCart, removeFromCart, changeQuantity } = useActions();
    const { items } = useCart();

    const currentElement = items.find(
        cartItem => cartItem.product.id === product.id
    );

    return (
        <div>
            {currentElement ? (
                <div className="flex-row items-center justify-between w-32 h-8 bg-background-button-card rounded-lg">
                    <ButtonCustom
                        className="w-8 flex items-center justify-center h-full"
                        onClick={() => {
                            if (currentElement.quantity === 1) {
                                removeFromCart({ id: currentElement.id });
                            } else {
                                changeQuantity({
                                    id: currentElement.id,
                                    type: 'minus'
                                });
                            }
                        }}
                    >
                        <FiMinus fontSize={13} />
                    </ButtonCustom>
                    <div className="h-full justify-center ">    
                    <span className="text-white text-xs font-normal">
                        {currentElement.quantity} x {product.price} ₽
                    </span>
                    </div>
                    <ButtonCustom
                        className="w-8 flex items-center justify-center h-full"
                        onClick={() => {
                            if (currentElement.quantity < 50) {
                                changeQuantity({
                                    id: currentElement.id,
                                    type: "plus",
                                });
                            } else {
                                toast.error("Максимальное количество — 50");
                            }
                        }}
                        disabled={currentElement.quantity >= 51}
                    >
                        <FaPlus fontSize={13}/>
                    </ButtonCustom>
                </div>
            ) : (
                <ButtonCustom
                    className="w-24 flex bg-background-button-card rounded-lg h-8 flex-row items-center justify-center"
                    onClick={() => 
                        addToCart({
                            product,
                            quantity: 1,
                            price: product.price,
                        })
                    }
                >
                    <div className="flex-row items-center justify-between">
                        <FaPlus />
                    </div>
                </ButtonCustom>
            )}
        </div>
    );
}

export default AddToCartButtonAddition;
