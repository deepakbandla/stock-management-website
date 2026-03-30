import { cn } from '../../lib/utils';

const variants = {
    success: 'bg-green-50 text-green-700 border border-green-100',
    danger: 'bg-red-50 text-red-600 border border-red-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const Badge = ({ children, variant = 'neutral', className }) => (
    <span
        className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            variants[variant],
            className
        )}
    >
        {children}
    </span>
);

export default Badge;