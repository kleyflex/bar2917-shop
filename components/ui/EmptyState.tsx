import { FC, ReactNode } from "react";

interface IEmptyState {
    title: string
    description?: string
    action?: ReactNode
}

// Вид пустых состояний и ошибок по всему приложению
const EmptyState: FC<IEmptyState> = ({ title, description, action }) => {
    return (
        <div className="w-full flex flex-col items-center text-center py-10 px-4">
            <h3 className="text-lg text-white">{title}</h3>
            {description && (
                <p className="mt-2 text-sm text-gray-400 leading-5 max-w-md">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;
