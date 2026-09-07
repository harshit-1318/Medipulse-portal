import { X, Hash, UserCircle, Calendar, CalendarCheck, User, ExternalLink } from "lucide-react";

export type ActiveFilterChipData = {
    key: string;
    label: string;
    value: string;
    icon?: string;
};

interface Props {
    chips: ActiveFilterChipData[];
    onRemove: (key: string) => void;
}

const IconMap: Record<string, React.ElementType> = {
    Hash,
    UserCircle,
    Calendar,
    CalendarCheck,
    User,
    ExternalLink
};

export default function ActiveFilterChips({ chips, onRemove }: Props) {
    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-end gap-2 overflow-hidden py-1">
            {chips.map((chip) => {
                const Icon = chip.icon ? IconMap[chip.icon] : null;
                
                return (
                    <div 
                        key={chip.key} 
                        className="group flex items-center gap-2 px-3 py-1.5 bg-linear-to-b from-white to-indigo-50/10 text-indigo-700 text-[12px] font-bold rounded-full border border-indigo-100/60 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-default translate-y-0 hover:-translate-y-0.5"
                    >
                        <span className="flex items-center gap-1.5">
                            {Icon && (
                                <span className="text-indigo-500/80 group-hover:text-indigo-600 transition-colors">
                                    <Icon size={12} strokeWidth={2.5} />
                                </span>
                            )}
                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{chip.label}</span>
                            <div className="w-px h-3 bg-indigo-100" />
                            <span className="text-indigo-700">{chip.value}</span>
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(chip.key); }}
                            className="p-1 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors ml-0.5"
                            title={`Remove ${chip.label} filter`}
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
