import { m } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectDropdownProps {
    options: Option[];
    value: string;
    highlightedIndex: number;
    setHighlightedIndex: (i: number) => void;
    onSelect: (val: string) => void;
}

export function CustomSelectDropdown({
    options,
    value,
    highlightedIndex,
    setHighlightedIndex,
    onSelect,
}: CustomSelectDropdownProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute z-100 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden p-2"
        >
            <div className="max-h-[280px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-200 pr-1">
                {options.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-slate-400 text-center italic font-medium">No options available</div>
                ) : (
                    options.map((option, index) => (
                        <button
                            key={option.value}
                            type="button"
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => onSelect(option.value)}
                            className={`
                                w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] transition-all duration-200
                                ${option.value === value ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-xs' : 'text-slate-600 font-medium hover:bg-slate-50'}
                                ${highlightedIndex === index && option.value !== value ? 'bg-slate-50 text-slate-900' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3 truncate">
                                <span className="truncate">{option.label}</span>
                            </div>
                            {option.value === value && (
                                <m.div 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00A294] text-white shadow-xs"
                                >
                                    <Check size={12} strokeWidth={4} />
                                </m.div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </m.div>
    );
}
