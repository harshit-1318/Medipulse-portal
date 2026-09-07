import { ParkingCircle } from "lucide-react";
import type { PageType } from "../../types";

interface Props {
    isParked: boolean;
    pageType: PageType;
    onToggle: (val: boolean) => void;
}

export const ParkedToggle: React.FC<Props> = ({ isParked, pageType, onToggle }) => {
    const isActive = isParked || pageType === 'parked';
    const isDisabled = pageType === 'parked';

    return (
        <div
            onClick={() => !isDisabled && onToggle(!isParked)}
            className={`flex items-center gap-3 p-1.5 px-3 bg-slate-50/70 border rounded-xl transition-all duration-200 cursor-pointer group/parked ${isActive
                ? 'border-amber-200 bg-amber-50/40 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs'
                } ${isDisabled ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : ''}`}
        >
            <div className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${isActive ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-400 group-hover/parked:text-[#00a294]'}`}>
                <ParkingCircle size={15} strokeWidth={2.5} />
            </div>

            <div className="flex items-center gap-2">
                <h3 className={`text-[13px] font-bold transition-colors duration-200 ${isActive ? 'text-amber-600' : 'text-slate-700'}`}>
                    Mark as Parked Orders
                </h3>
                {isActive && (
                    <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                        Active
                    </span>
                )}
            </div>

            <div className="ml-auto pr-1">
                <div className={`w-9 h-5 rounded-full flex items-center transition-all duration-300 p-0.5 relative ${isActive ? 'bg-amber-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-xs transition-all duration-300 flex items-center justify-center ${isActive ? 'translate-x-4' : 'translate-x-0'}`}>
                        <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-amber-500' : 'bg-slate-300'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};
