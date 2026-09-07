import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
}

/**
 * Standard table row with hover effects and consistent border/typography
 */
export const TableRow: React.FC<TableRowProps> = ({ children, className = '', ...props }) => (
    <tr 
        className={`group transition-colors border-b border-slate-100 last:border-0 hover:bg-slate-50/50 font-montserrat ${className}`}
        {...props}
    >
        {children}
    </tr>
);

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'muted' | 'success';
    icon?: LucideIcon;
    className?: string;
}

/**
 * Pill-style badge used for IDs, Statuses, and Counts
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', icon: Icon, className = '' }) => {
    const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap uppercase tracking-wider transition-all duration-300 gap-1.5";
    const variants = {
        primary: "bg-blue-50 text-[#003B73] border-blue-100",
        muted: "bg-slate-50 text-slate-400 border-slate-100",
        success: "bg-emerald-50/80 text-emerald-700 border-emerald-200"
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`}>
            {Icon && <Icon size={12} strokeWidth={2.5} />}
            <span>{children}</span>
        </span>
    );
};

export { ActionButton } from './ActionButton';
export type { ActionButtonProps } from './ActionButton';

