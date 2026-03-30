import { cn } from '../../lib/utils';

const Input = ({ className, label, error, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                className={cn(
                    'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white text-gray-800 placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
                    'transition duration-150',
                    error && 'border-red-300 focus:ring-red-400',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;