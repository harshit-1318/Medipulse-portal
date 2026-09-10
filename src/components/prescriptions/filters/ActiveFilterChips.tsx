import { Hash, UserCircle, Calendar, CalendarCheck, User, ExternalLink } from "lucide-react";

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
        <div className="hidden md:flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-right-4 duration-500">
            {chips.map((chip) => {
                const Icon = chip.icon ? IconMap[chip.icon] : null;

                return (
                    <span
                        key={chip.key}
                        className="group flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-indigo-700 bg-white border border-indigo-100 rounded-full whitespace-nowrap shadow-sm ring-1 ring-indigo-200/20 hover:border-indigo-300 transition-all duration-300"
                    >
                        {Icon && <Icon size={12} className="text-indigo-500 group-hover:scale-110 transition-transform" />}
                        <span className="opacity-60 tracking-tight">{chip.label}:</span>
                        <span className="tracking-tight">{chip.value}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(chip.key); }}
                            className="hover:bg-red-50 hover:text-red-600 rounded-full p-0.5 transition-colors ml-0.5 cursor-pointer"
                            title={`Remove ${chip.label} filter`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </span>
                );
            })}
        </div>
    );
}
