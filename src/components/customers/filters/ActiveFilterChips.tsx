export interface ActiveFilterChipData {
    key: string;
    label: string;
    value: string | number | boolean;
    icon?: any;
}

interface Props {
    chips: ActiveFilterChipData[];
    onRemove: (key: string) => void;
}

export default function ActiveFilterChips({ chips, onRemove }: Props) {
    if (chips.length === 0) return null;

    return (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Minimalist Pills - Icon + Value Only */}
            <div className="flex items-center gap-2 max-w-[600px] overflow-x-auto no-scrollbar py-0.5">
                {chips.map((chip) => {
                    const Icon = chip.icon;
                    return (
                        <div
                            key={chip.key}
                            className="group flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-indigo-700 bg-white border border-indigo-100 rounded-full shadow-sm ring-1 ring-indigo-200/20 hover:border-indigo-300 transition-all duration-300 whitespace-nowrap"
                        >
                            {Icon && <Icon size={12} className="text-indigo-500" />}
                            <span className="opacity-60 tracking-tight">{chip.label}:</span>
                            <span className="tracking-tight">{String(chip.value)}</span>
                            <button
                                onClick={() => onRemove(chip.key)}
                                className="hover:bg-red-50 hover:text-red-600 rounded-full p-0.5 transition-colors ml-0.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
