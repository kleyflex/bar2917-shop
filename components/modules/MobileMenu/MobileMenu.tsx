'use client';

import { useCategoryLinks } from '@/components/hocs/useCategoryLinks';
import { Button, Modal, ModalBody, ModalContent } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useCategoryLinks();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="mobile-menu-container">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        aria-label="Открыть меню"
        className="mobile-menu-button"
        onClick={handleOpen}
      >
        <RxHamburgerMenu size={24} className="text-white" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        placement="center"
        classNames={{
          base: "bg-[#1A1A1A]",
          wrapper: "z-[2000]"
        }}
        isDismissable={true}
        className="mobile-menu-modal"
        size="full"
        hideCloseButton={true}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            },
            exit: {
              x: "100%",
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }
          },
          initial: { x: "100%", opacity: 0 },
          animate: "enter",
          exit: "exit"
        }}
      >
        <ModalContent className="h-screen w-[280px] absolute right-0 top-0 m-0 rounded-none">
          {(onClose) => (
            <ModalBody className="p-6 overflow-y-auto">
              <Button
                isIconOnly
                variant="light"
                aria-label="Закрыть меню"
                className="absolute top-3 right-3 z-[2001]"
                onClick={onClose}
              >
                <IoClose size={24} className="text-white" />
              </Button>

              <div className="mobile-menu__logo">
                <Image
                  src="/img/logo.svg"
                  alt="Bar2917 Logo"
                  width={120}
                  height={75}
                />
              </div>

              <nav className="mobile-menu__items" aria-label="Категории меню">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="mobile-menu__item"
                    onClick={onClose}
                  >
                    <div className={`mobile-menu__icon item--${category.slug}`}></div>
                    <span className="mobile-menu__text">{category.name}</span>
                  </Link>
                ))}
              </nav>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MobileMenu;
