import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectTriggerProps {
    disabled: boolean;
    isOpen: boolean;
    error: boolean;
    icon?: React.ReactNode;
    selectedOption?: Option;
    placeholder: string;
    onClick: () => void;
}

export const CustomSelectTrigger: React.FC<CustomSelectTriggerProps> = ({
    disabled,
    isOpen,
    error,
    icon,
    selectedOption,
    placeholder,
    onClick,
}) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`
            w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-[16px] transition-all duration-300 outline-none
            ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-100/80 grayscale-[0.2]' : 'bg-slate-50/50 cursor-pointer'}
            ${isOpen ? 'border-[#00a294] ring-4 ring-[#00a294]/15 shadow-sm bg-white' : 'border-slate-200'}
            ${error ? 'border-red-400 focus:border-red-500' : 'border'}
            hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-[#00a294]/15 focus-visible:border-[#00a294] group
        `}
    >
        <div className="flex items-center gap-3.5 truncate">
            {icon && (
                <div className={`transition-colors duration-300 ${disabled ? 'text-slate-400' : 'text-slate-400 group-hover:text-[#00a294]'}`}>
                    {icon}
                </div>
            )}
            <span className={`truncate tracking-tight font-medium ${!selectedOption ? 'text-slate-400' : (disabled ? 'text-slate-500' : 'text-slate-900')}`}>
                {selectedOption ? selectedOption.label : placeholder}
            </span>
        </div>
        {!disabled && (
            <ChevronDown 
                size={20} 
                className={`text-slate-400 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180 text-[#00a294]' : ''}`}
            />
        )}
    </button>
);
