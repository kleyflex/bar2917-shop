'use client'
import { RootState } from '@/app/store/store';
import { useAuth } from '@/components/hocs/useAuth';
import LocationSelector from '@/components/ui/location/LocationSelector';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AuthModal from '../Auth/AuthModal';
import MobileMenu from '../MobileMenu/MobileMenu';
import CartPopup from './CartPopup/CartPopup';

const Header = () => {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { selectedLocationId, locations } = useSelector((state: RootState) => state.location);

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const phoneNumber = selectedLocation?.phone || '+7 (981) 156-56-67';

  return (
    <header className='header'>
      <div className='header__container'>
        <div className='header__content'>
          <div className='header__content__info'>
            <div className='header__content__info__time'>
              <div className='header__content__info__time__carbon'></div>
              <div className='header__content__info__time__work'>
                <span className='header__span__up'>режим работы</span>
                <span className='header__span__down'>11:00-23:00</span>
              </div>
              <div className='header__content__info__time__slash'></div>
              <div className='header__content__info__time__delivery'>
                <span className='header__span__up'>доставка от</span>
                <span className='header__span__down'>60 мин.</span>
              </div>
            </div>
            <div className='header__content__info__geo'>
              <div className='flex flex-row items-center gap-1 self-end'>
                <div className='geo-icon'>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FF8A00"/>
                  </svg>
                </div>
                <LocationSelector />
              </div>
              <a href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`} className='header__a__down'>
                {phoneNumber}
              </a>
            </div>
          </div>
          
          <div className='header__logo__center'>
            <Link href='/'>
              <Image
                src='/img/logo.svg'
                alt='Bar2917 Logo'
                width={140}
                height={85}
                className='header__logo__img'
              />
            </Link>
          </div>
          
          <nav aria-label='Основная навигация'>
            <ul className='header__links'>
            {user?.isAdmin ? (
              <li className='header__links__item pl-5'>
                <Link href='/admin' className='header__links__item__a'>
                  Панель администратора
                </Link>
              </li>
            ) : (
              <>
                <li className='header__links__item'>
                  <Link href='/contacts' className='header__links__item__a'>
                    Контакты
                  </Link>
                </li>
                <li className='header__links__item'>
                  <Link href='/delivery-info' className='header__links__item__a'>
                    Доставка и оплата
                  </Link>
                </li>
              </>
            )}
            </ul>
          </nav>
          <div className='header__icon__links'>
            {user ? (
              <Link className='header__icon__links__item' href='/users/profile' aria-label='Личный кабинет'>
                <div className='header__icon__links__card__item--profile' />
              </Link>
            ) : (
              <button
                type='button'
                className='header__icon__links__item'
                aria-label='Войти в аккаунт'
                onClick={() => setIsAuthOpen(true)}
              >
                <div className='header__icon__links__card__item--profile' />
              </button>
            )}
            <CartPopup />
            <div className='mobile-menu-wrapper'>
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Header;
