import { FC } from "react";

// Заглушки карточек
const CatalogSkeleton: FC<{ count?: number }> = ({ count = 8 }) => {
    return (
        <div className="flex-row flex-wrap gap-5 media-480-gap" aria-hidden="true">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-background-card card__template border-1 border-card-border rounded-lg flex flex-col animate-pulse"
                >
                    <div className="w-full h-[160px] rounded-lg bg-background-input" />
                    <div className="mt-3.5 h-4 w-3/4 rounded bg-background-input" />
                    <div className="mt-2 h-3 w-full rounded bg-background-input" />
                    <div className="mt-1 h-3 w-2/3 rounded bg-background-input" />
                    <div className="mt-auto h-12 w-full rounded-lg bg-background-input" />
                </div>
            ))}
        </div>
    );
};

export default CatalogSkeleton;
