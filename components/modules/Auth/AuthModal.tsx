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
            classNames={{
                base: "bg-background-card border border-card-border",
                closeButton: "text-white hover:bg-background-input"
            }}
        >
            <ModalContent>
                <ModalBody className="py-8">
                    <AuthForm onSuccess={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
