'use client'
import { ORDERS_ENABLED } from '@/app/config/features'
import { useCart } from '@/components/hocs/useCart'
import { withClickOutside } from '@/components/hocs/withClickOutside'
import { IWrappedComponentProps } from '@/types/hocs'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { forwardRef } from 'react'
import CartItem from '../CartItem/CartItem'

const CartPopup = forwardRef<HTMLDivElement, IWrappedComponentProps>(
  ({ open, setOpen }, ref) => {

    const { items, total } = useCart()

    const handleShowPopup = () => setOpen(true)
    const handleHidePopup = () => setOpen(false)

    return (
      <div className='cart-popup' ref={ref}>
        <button
          type='button'
          className='header__icon__links__item item__busket'
          aria-label={`Корзина, товаров: ${items.length}`}
          aria-expanded={open}
          onMouseEnter={handleShowPopup}
          onFocus={handleShowPopup}
          onClick={() => setOpen(!open)}
        >
          <div className='header__icon__links__card__item--busket' />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className='cart-popup__wrapper'
              onMouseLeave={handleHidePopup}
            >
              <div className='cart-popup__up'>
                <span className='cart-popup__title'>Корзина</span>
                <button
                  type='button'
                  className='btn-reset cart-popup__close'
                  aria-label='Закрыть корзину'
                  onClick={handleHidePopup}
                />
              </div>
              <div className='list-reset cart-popup__cart-list'>
                {items.length ? (
                  items.map(item => <CartItem item={item} key={item.id} />)
                ) : (
                  <div className='cart-popup__cart-list__empty-cart'>
                    <span className='text-sm text-gray-400'>Корзина пуста</span>
                  </div>
                )}
              </div>
              <div className='cart-popup__footer'>
                <div className='cart-popup__footer__inner'>
                  <span>Сумма заказа:</span>
                  <span>{total} ₽</span>
                </div>

                {ORDERS_ENABLED ? (
                  <Link href='/order' className='cart-popup__footer__link'>
                    Перейти к оформлению
                  </Link>
                ) : (
                  <p className='text-sm text-gray-400 text-center leading-5'>
                    Онлайн-оформление временно недоступно.<br />
                    Позвоните нам, чтобы сделать заказ.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

CartPopup.displayName = 'CartPopup'

export default withClickOutside(CartPopup)
