import { cn } from '../../lib/utils';

const Select = ({ className, label, children, ...props }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <select
            className={cn(
                'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white text-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
                'transition duration-150',
                className
            )}
            {...props}
        >
            {children}
        </select>
    </div>
);

export default Select;