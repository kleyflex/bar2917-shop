"use client"
import { FeedbackService } from '@/app/services/feedback.service';
import { RootState } from '@/app/store/store';
import Logo from '@/components/elements/Logo/Logo';
import { useAuth } from '@/components/hocs/useAuth';
import AuthModal from '@/components/modules/Auth/AuthModal';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { user } = useAuth(); // Получаем информацию о пользователе
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isInvalid, setIsInvalid] = useState(false); // Состояние для проверки валидности поля
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { selectedLocationId, locations } = useSelector((state: RootState) => state.location);
  
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const phoneNumber = selectedLocation?.phone || '+7 (981) 156-56-67';

  const handleOpen = () => {
    if (user) {
      setIsOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    if (feedback.trim() === '') {
      setIsInvalid(true);
      return;
    }

    try {
      await FeedbackService.leave({ text: feedback }); // Отправляем сообщение через FeedbackService
      toast.success('Обратная связь отправлена');
      setFeedback('');
      setIsOpen(false);
    } catch (error) {
      toast.error('Ошибка при отправке обратной связи');
    }
  };

  return (
    <footer className='footer'>
      <div className='footer__container'>
        <ul className='footer__links list-reset'>
          <li className='footer__links__item'>
            <Link href='/contacts' className='footer__links__item__a'>
              Контакты
            </Link>
          </li>
          <li className='footer__links__item'>
            <Link href='/legal' className='footer__links__item__a'>
              Правовая информация
            </Link>
            {/* <a onClick={handleOpen} className='footer__links__item__a' style={{ cursor: 'pointer' }}>
              Обратная связь
            </a> */}
          </li>
          <li className='footer__links__item'>
            <Link href='/delivery-info' className='footer__links__item__a'>
              Доставка и оплата
            </Link>
          </li>
        </ul>
        <div className='footer__logo'>
          <Logo />
        </div>
        <div className='footer__telephone__link'>
          <span className='footer__telephone__link__span'>
            Заказ по телефону:
          </span>
          <a href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`} className='footer__a__phone'>
            {phoneNumber}
          </a>
        </div>
      </div>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        placement="top-center"
      >
        <ModalContent className="text-white bg-background-card">
          <>
            <ModalHeader className="flex flex-col gap-1 text-white">Обратная связь</ModalHeader>
            <ModalBody>
              <Textarea
                isInvalid={isInvalid}
                minRows={3}
                placeholder="Напишите отзыв о работе приложения"
                errorMessage="Поле не должно быть пустым"
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  if (isInvalid) setIsInvalid(false); // Сбрасываем ошибку при вводе
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button className='bg-background-button-card flex flex-row justify-center items-center p-0 m-0 w-full' onClick={handleSubmit}>
                <p className='text-white'>Отправить</p>
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </footer>
  );
}

export default Footer;
