'use client'
import { AppDispatch } from "@/app/store/store";
import { login, register } from "@/app/store/user/user.actions";
import { IAuthError } from "@/app/store/user/user.interface";
import FormAlert from "@/components/ui/FormAlert";
import { Button, Input, InputProps, Tab, Tabs } from "@nextui-org/react";
import { KeyboardEvent, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FiAlertTriangle, FiCheck, FiLock, FiMail } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { validEmail } from "./valid-email";

// Требование бэка (AuthDto)
const MIN_PASSWORD_LENGTH = 6;

// Неразрывный пробел в description: держит место под подсказку/ошибку, чтобы поля не прыгали
const RESERVED_HELPER = String.fromCharCode(160);

type TypeMode = 'login' | 'register';

interface IAuthFields {
    email: string
    password: string
    passwordConfirm: string
}

interface IAuthForm {
    onSuccess?: () => void;
}

// Единый вид полей формы. Место под подсказку/ошибку зарезервировано, поэтому форма не прыгает
const inputClassNames: InputProps['classNames'] = {
    label: "!text-gray-300 text-sm",
    inputWrapper: [
        "h-12 bg-background-input border-card-border",
        "data-[hover=true]:border-[#3a3a3a]",
        "group-data-[focus=true]:border-mainprimary",
        "group-data-[invalid=true]:!border-danger"
    ].join(' '),
    input: "!text-white placeholder:text-gray-500",
    helperWrapper: "min-h-[24px] px-1 pt-1 pb-0",
    errorMessage: "text-xs",
    description: "text-xs"
};

const TITLES: Record<TypeMode, { title: string; subtitle: string; submit: string }> = {
    login: { title: 'С возвращением', subtitle: 'Войдите, чтобы видеть историю заказов и данные профиля', submit: 'Войти' },
    register: { title: 'Создать аккаунт', subtitle: 'Пара секунд — и можно сохранять данные для заказов', submit: 'Зарегистрироваться' }
};

const AuthForm = ({ onSuccess }: IAuthForm) => {
    const dispatch = useDispatch<AppDispatch>();

    const [mode, setMode] = useState<TypeMode>('login');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [alert, setAlert] = useState('');
    const [isEmailTaken, setIsEmailTaken] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        getValues,
        setError,
        setFocus,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<IAuthFields>({
        mode: 'onTouched',
        defaultValues: { email: '', password: '', passwordConfirm: '' }
    });

    const password = watch('password');
    const isRegister = mode === 'register';
    const isPasswordLongEnough = password.length >= MIN_PASSWORD_LENGTH;

    // Любая правка полей убирает ошибку сервера: пользователь уже исправляет
    useEffect(() => {
        const subscription = watch((_, { name, type }) => {
            // type === 'change' только у ввода пользователя; программные setValue/reset не считаем
            if (type !== 'change') return;
            setAlert('');
            if (name === 'email') setIsEmailTaken(false);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const switchMode = (next: TypeMode) => {
        if (next === mode) return;
        setMode(next);
        setAlert('');
        setIsEmailTaken(false);
        // Почту сохраняем, пароли и ошибки прошлого режима сбрасываем
        reset({ email: getValues('email'), password: '', passwordConfirm: '' });
    };

    const handleServerError = ({ status, message }: IAuthError) => {
        if (mode === 'login' && status === 401) {
            setAlert('Неверная почта или пароль');
            // Пароль выделен целиком: можно сразу перепечатать
            setFocus('password', { shouldSelect: true });
            return;
        }

        if (mode === 'register' && status === 400 && /существует/i.test(message)) {
            setIsEmailTaken(true);
            setError('email', { type: 'server', message: 'Эта почта уже зарегистрирована' });
            setFocus('email');
            return;
        }

        setAlert(message);
    };

    const onSubmit: SubmitHandler<IAuthFields> = async ({ email, password }) => {
        setAlert('');
        try {
            await dispatch(isRegister ? register({ email, password }) : login({ email, password })).unwrap();
            onSuccess?.();
        } catch (error) {
            handleServerError(error as IAuthError);
        }
    };

    const checkCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
        setIsCapsLock(event.getModifierState?.('CapsLock') ?? false);
    };

    const passwordToggle = (
        <button
            className="focus:outline-none text-gray-500 hover:text-gray-300 transition-colors"
            type="button"
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
            {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-xl pointer-events-none" />
            ) : (
                <EyeFilledIcon className="text-xl pointer-events-none" />
            )}
        </button>
    );

    const capsLockHint = isCapsLock && (
        <span className="flex items-center gap-1 text-amber-400">
            <FiAlertTriangle className="shrink-0" /> Включён Caps Lock
        </span>
    );

    const passwordHint = capsLockHint || (isRegister && (
        <span className={`flex items-center gap-1 transition-colors ${isPasswordLongEnough ? 'text-green-500' : 'text-gray-500'}`}>
            {isPasswordLongEnough && <FiCheck className="shrink-0" />}
            Минимум {MIN_PASSWORD_LENGTH} символов
        </span>
    ));

    const emailError = isEmailTaken ? (
        <span>
            Эта почта уже зарегистрирована.{' '}
            <button
                type="button"
                className="underline underline-offset-2 text-mainprimary hover:opacity-80"
                onClick={() => switchMode('login')}
            >
                Войти с этой почтой
            </button>
        </span>
    ) : errors.email?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
            <Tabs
                aria-label="Вход или регистрация"
                selectedKey={mode}
                onSelectionChange={key => switchMode(key as TypeMode)}
                fullWidth
                radius="md"
                color="warning"
                classNames={{
                    base: "mb-6",
                    tabList: "bg-background-input border border-card-border p-1",
                    cursor: "!bg-mainprimary",
                    tab: "h-9",
                    tabContent: "!text-sm text-gray-400 group-data-[selected=true]:text-white group-data-[selected=true]:font-medium"
                }}
            >
                <Tab key="login" title="Вход" />
                <Tab key="register" title="Регистрация" />
            </Tabs>

            <h2 className="text-white text-2xl font-medium mb-1">{TITLES[mode].title}</h2>
            <p className="mb-5 text-sm text-gray-400">{TITLES[mode].subtitle}</p>

            <div className="flex flex-col gap-1">
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: 'Укажите почту',
                        pattern: { value: validEmail, message: 'Похоже, в почте ошибка. Пример: name@mail.ru' }
                    }}
                    render={({ field }) => (
                        <Input
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            autoFocus
                            type="email"
                            label="Почта"
                            labelPlacement="outside"
                            placeholder="name@mail.ru"
                            variant="bordered"
                            radius="md"
                            autoComplete="email"
                            startContent={<FiMail className="text-gray-500 shrink-0" />}
                            isInvalid={!!errors.email}
                            errorMessage={emailError}
                            description={RESERVED_HELPER}
                            classNames={inputClassNames}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: 'Укажите пароль',
                        minLength: isRegister
                            ? { value: MIN_PASSWORD_LENGTH, message: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов` }
                            : undefined,
                        deps: isRegister ? ['passwordConfirm'] : []
                    }}
                    render={({ field }) => (
                        <Input
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            type={isPasswordVisible ? 'text' : 'password'}
                            label="Пароль"
                            labelPlacement="outside"
                            placeholder={isRegister ? 'Придумайте пароль' : 'Ваш пароль'}
                            variant="bordered"
                            radius="md"
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            onKeyUp={checkCapsLock}
                            startContent={<FiLock className="text-gray-500 shrink-0" />}
                            endContent={passwordToggle}
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            description={passwordHint || RESERVED_HELPER}
                            classNames={inputClassNames}
                        />
                    )}
                />

                {isRegister && (
                    <Controller
                        name="passwordConfirm"
                        control={control}
                        rules={{
                            required: 'Повторите пароль',
                            validate: value => value === getValues('password') || 'Пароли не совпадают'
                        }}
                        render={({ field }) => (
                            <Input
                                ref={field.ref}
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                type={isPasswordVisible ? 'text' : 'password'}
                                label="Повторите пароль"
                                labelPlacement="outside"
                                placeholder="Ещё раз тот же пароль"
                                variant="bordered"
                                radius="md"
                                autoComplete="new-password"
                                onKeyUp={checkCapsLock}
                                startContent={<FiLock className="text-gray-500 shrink-0" />}
                                isInvalid={!!errors.passwordConfirm}
                                errorMessage={errors.passwordConfirm?.message}
                                description={RESERVED_HELPER}
                                classNames={inputClassNames}
                            />
                        )}
                    />
                )}
            </div>

            <FormAlert message={alert} className="mb-4" />

            <Button
                type="submit"
                radius="md"
                isLoading={isSubmitting}
                className="w-full h-12 bg-mainprimary text-white text-base font-medium data-[hover=true]:opacity-90"
                spinner={<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            >
                {isSubmitting ? 'Подождите…' : TITLES[mode].submit}
            </Button>
        </form>
    );
};

export default AuthForm;
