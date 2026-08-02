import { forwardRef } from "react";
import { IField } from "./field.interface";

const Field = forwardRef<HTMLInputElement, IField>(
    ({ placeholder, label, error, type = 'text', className, ...rest }, ref) => {
        return (
            <div className={`w-full ${className ?? ''}`}>
                {label && (
                    <label className="block mb-1 text-sm text-gray-400">{label}</label>
                )}
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    className="w-full h-11 px-3 rounded-lg bg-background-input border border-card-border text-white placeholder:text-gray-500 focus:border-background-button-card outline-none transition-colors"
                    {...rest}
                />
                {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
            </div>
        )
    }
)

Field.displayName = "Field"

export default Field
