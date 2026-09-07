import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ActionButtonProps {
    icon: LucideIcon;
    label: string;
    variant?: 'cyan' | 'slate';
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    disabled?: boolean;
    title?: string;
    target?: string;
    rel?: string;
}

/**
 * Standardized action button with glassmorphism effect and consistent sizing
 */
export const ActionButton: React.FC<ActionButtonProps> = ({ 
    icon: Icon, 
    label, 
    variant = 'cyan', 
    href, 
    onClick,
    className = '', 
    disabled,
    title,
    target,
    rel
}) => {
    const variantStyles = {
        cyan: "border-cyan-200/80 text-cyan-700 hover:bg-cyan-50/50 hover:border-cyan-300 hover:shadow-[0_4px_12px_-2px_rgba(6,182,212,0.18)] shadow-[0_2px_8px_-2px_rgba(6,182,212,0.12)]",
        slate: "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_4px_12px_-2px_rgba(71,85,105,0.12)] shadow-[0_2px_8px_-2px_rgba(71,85,105,0.08)]"
    };

    const iconColors = {
        cyan: "text-cyan-500",
        slate: "text-slate-400"
    };

    const commonClasses = "h-[34px] w-[88px] rounded-[8px] bg-white border text-[11.5px] font-bold font-montserrat tracking-wide flex items-center justify-center gap-2 hover:-translate-y-[1.5px] active:translate-y-0 transition-all duration-300 ease-in-out group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none";

    const content = (
        <>
            <Icon size={16} className={`${iconColors[variant]} opacity-85 stroke-[2.5] group-hover:scale-110 transition-transform duration-300`} />
            <span className="uppercase">{label}</span>
        </>
    );

    if (href && !disabled) {
        return (
            <a 
                href={href} 
                className={`${commonClasses} ${variantStyles[variant]} ${className}`}
                title={title}
                target={target}
                rel={rel}
            >
                {content}
            </a>
        );
    }

    return (
        <button 
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${commonClasses} ${variantStyles[variant]} ${className}`}
            title={title}
        >
            {content}
        </button>
    );
};
