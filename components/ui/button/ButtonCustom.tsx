import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonCustom: FC<PropsWithChildren<IButton>> = ({ children, className, ...rest }) => {
  return (
    <button className={`btn__default ${className ?? ''}`.trim()} {...rest}>
        {children}
    </button>
)
};

export default ButtonCustom
