import { AlertCircle } from "lucide-react";
import type { PageType } from "../../types";

interface Props {
    isUrgent: boolean;
    pageType: PageType;
    onToggle: (val: boolean) => void;
}

export const UrgentToggle: React.FC<Props> = ({ isUrgent, pageType, onToggle }) => {
    const isActive = isUrgent || pageType === 'urgent';
    const isDisabled = pageType === 'urgent';

    return (
        <div
            onClick={() => !isDisabled && onToggle(!isUrgent)}
            className={`flex items-center gap-3 p-1.5 px-3 bg-slate-50/70 border rounded-xl transition-all duration-200 cursor-pointer group/urgent ${isActive
                ? 'border-red-200 bg-red-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs'
                } ${isDisabled ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : ''}`}
        >
            <div className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${isActive ? 'bg-red-500 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-400 group-hover/urgent:text-[#00a294]'}`}>
                <AlertCircle size={15} strokeWidth={2.5} />
            </div>

            <div className="flex items-center gap-2">
                <h3 className={`text-[13px] font-bold transition-colors duration-200 ${isActive ? 'text-red-600' : 'text-slate-700'}`}>
                    Mark as Urgent Orders
                </h3>
                {isActive && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                        Active
                    </span>
                )}
            </div>

            <div className="ml-auto pr-1">
                <div className={`w-9 h-5 rounded-full flex items-center transition-all duration-300 p-0.5 relative ${isActive ? 'bg-red-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-xs transition-all duration-300 flex items-center justify-center ${isActive ? 'translate-x-4' : 'translate-x-0'}`}>
                        <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-red-500' : 'bg-slate-300'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};
