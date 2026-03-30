import { cn } from '../../lib/utils';

const Card = ({ children, className, ...props }) => (
    <div
        className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm', className)}
        {...props}
    >
        {children}
    </div>
);

const CardHeader = ({ children, className }) => (
    <div className={cn('px-6 py-5 border-b border-gray-50', className)}>{children}</div>
);

const CardTitle = ({ children, className }) => (
    <h3 className={cn('text-base font-semibold text-gray-800', className)}>{children}</h3>
);

const CardContent = ({ children, className }) => (
    <div className={cn('px-6 py-5', className)}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardContent };