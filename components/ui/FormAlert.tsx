'use client'
import { Alert } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

interface IFormAlert {
    message?: string | null
    className?: string
}

// Общая плашка ошибки формы (вход, регистрация, профиль): плавно раскрывается и схлопывается
const FormAlert = ({ message, className }: IFormAlert) => {
    return (
        <AnimatePresence initial={false}>
            {message && (
                <motion.div
                    key="form-alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                >
                    {/* role="alert" ставит сам Alert из NextUI */}
                    <div className={className}>
                        <Alert
                            color="danger"
                            variant="flat"
                            radius="md"
                            title={message}
                            classNames={{
                                base: "bg-red-500/10 border border-red-500/30 py-2.5",
                                title: "text-sm text-red-300 font-normal",
                                iconWrapper: "bg-transparent border-0 shadow-none",
                                alertIcon: "fill-red-400"
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FormAlert;
