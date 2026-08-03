'use client'
import { AppDispatch } from "@/app/store/store";
import { login, register } from "@/app/store/user/user.actions";
import { IEmailPassword } from "@/app/store/user/user.interface";
import { useAuth } from "@/components/hocs/useAuth";
import ButtonCustom from "@/components/ui/button/ButtonCustom";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { validEmail } from "./valid-email";

// Требование бэка (AuthDto)
const MIN_PASSWORD_LENGTH = 6;

interface IAuthForm {
    onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: IAuthForm) => {
    const { isLoading } = useAuth();
    
    const dispatch = useDispatch<AppDispatch>();

    const [type, setType] = useState<'login' | 'register'>('login');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState('');

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors }
    } = useForm<IEmailPassword>({ mode: 'onChange' });

    const onSubmit: SubmitHandler<IEmailPassword> = async data => {
        setServerError('');
        try {
            await dispatch(type === 'login' ? login(data) : register(data)).unwrap();
            onSuccess?.();
        } catch (error) {
            setServerError(typeof error === 'string' ? error : 'Что-то пошло не так, попробуйте ещё раз');
        }
    };

    const toggleType = () => {
        setServerError('');
        setType(type === 'login' ? 'register' : 'login');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h2 className="text-white text-2xl mb-1">
                {type === 'login' ? 'Вход' : 'Регистрация'}
            </h2>
            <p className="mb-5 text-sm text-gray-400">
                Введите данные, чтобы {type === 'login' ? 'войти в аккаунт' : 'создать аккаунт'}
            </p>

            <Input
                {...formRegister('email', {
                    required: 'Укажите почту',
                    pattern: { value: validEmail, message: 'Неверный формат почты' }
                })}
                className="input-custom mb-3"
                type="email"
                label="Почта"
                size="sm"
                autoComplete="email"
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
            />

            <Input
                {...formRegister('password', {
                    required: 'Укажите пароль',
                    minLength: {
                        value: MIN_PASSWORD_LENGTH,
                        message: `Пароль не менее ${MIN_PASSWORD_LENGTH} символов`
                    }
                })}
                className="input-custom mb-3"
                type={isPasswordVisible ? 'text' : 'password'}
                label="Пароль"
                size="sm"
                autoComplete={type === 'login' ? 'current-password' : 'new-password'}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                endContent={
                    <button
                        className="focus:outline-none"
                        type="button"
                        aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                    </button>
                }
            />

            {serverError && (
                <div role="alert" className="mb-3 text-sm text-red-500">
                    {serverError}
                </div>
            )}

            <ButtonCustom type="submit" disabled={isLoading}>
                {isLoading
                    ? 'Подождите…'
                    : type === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </ButtonCustom>

            <div className="justify-center flex-row mt-4">
                <button
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                    type="button"
                    onClick={toggleType}
                >
                    {type === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                </button>
            </div>
        </form>
    );
};

export default AuthForm;
