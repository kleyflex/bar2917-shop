'use client'
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import AuthForm from "./AuthForm";

interface IAuthModal {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: IAuthModal) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            backdrop="blur"
            size="md"
            classNames={{
                base: "bg-background-card border border-card-border shadow-2xl shadow-black/50",
                backdrop: "bg-black/60",
                closeButton: "top-3 right-3 text-gray-400 hover:text-white hover:bg-white/5"
            }}
        >
            <ModalContent>
                <ModalBody className="px-6 pt-10 pb-7 sm:px-8">
                    <AuthForm onSuccess={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
