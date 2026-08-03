'use client'
import { UserService } from "@/app/services/user.service";
import { useActions } from "@/components/hocs/useActions";
import { useProfile } from "@/components/hocs/useProfile";
import Loader from "@/components/ui/Loader";
import ButtonCustom from "@/components/ui/button/ButtonCustom";
import { Input, Link } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaHistory } from "react-icons/fa";
import InputMask from "react-input-mask-next";

interface IProfileForm {
    name: string;
    phone: string;
    email: string;
}

const ProfilePage = () => {
    const { profile, isLoading } = useProfile();
    const { logout } = useActions();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<IProfileForm>({
        defaultValues: { name: '', phone: '', email: '' },
        values: {
            name: profile.name || '',
            phone: profile.phone || '',
            email: profile.email || ''
        }
    });

    const { mutate: saveProfile, isPending } = useMutation({
        mutationKey: ['update profile'],
        // Уникальность телефона проверяет сервер
        mutationFn: (data: IProfileForm) => UserService.updateProfile(data),
        onSuccess: () => toast.success('Профиль обновлён'),
        onError: (error: any) => {
            const message = error?.response?.data?.message;
            const text = Array.isArray(message) ? message.join(', ') : message;

            if (typeof text === 'string' && text.toLowerCase().includes('телефон')) {
                setError('phone', { message: text });
            } else if (typeof text === 'string' && text.toLowerCase().includes('почт')) {
                setError('email', { message: text });
            } else {
                toast.error(text || 'Не удалось обновить профиль');
            }
        }
    });

    const onSubmit: SubmitHandler<IProfileForm> = data => saveProfile(data);

    return (
        <section>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <form className="rounded-lg shadow-sm" onSubmit={handleSubmit(onSubmit)}>
                        {isLoading ? (<Loader />) : (
                            <>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Введите ваше имя' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            className="input-custom mb-3"
                                            type="text"
                                            label="Ваше имя"
                                            size="md"
                                            isInvalid={!!errors.name}
                                            errorMessage={errors.name?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <InputMask
                                            mask="+7 (999) 999-99-99"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            {
                                                <Input
                                                    className="input-custom mb-3"
                                                    type="text"
                                                    label="Ваш телефон"
                                                    size="md"
                                                    isInvalid={!!errors.phone}
                                                    errorMessage={errors.phone?.message}
                                                />
                                            }
                                        </InputMask>
                                    )}
                                />

                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            className="input-custom mb-3"
                                            type="text"
                                            label="Почта"
                                            size="md"
                                            isReadOnly
                                        />
                                    )}
                                />

                                <ButtonCustom type="submit" disabled={isPending}>
                                    {isPending ? 'Сохранение…' : 'Сохранить'}
                                </ButtonCustom>
                            </>
                        )}
                    </form>
                    <button
                        className="mt-6 self-start text-sm text-gray-400 transition duration-300 hover:text-white"
                        type="button"
                        onClick={logout}
                    >
                        Выйти
                    </button>
                </div>

                <div className="w-full md:w-1/2">
                    <Link href="/order-history">
                        <div className="w-full max-w-[220px] h-40 rounded-lg shadow-sm bg-background-card border border-background-button-card p-5 justify-between">
                            <h3 className="text-xl font-semibold text-white">История заказов</h3>
                            <FaHistory size={25} color="white" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
