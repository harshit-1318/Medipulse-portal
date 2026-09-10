import React from 'react';
import { Calendar } from 'lucide-react';

interface ActivityDateInputsProps {
    startDate: string;
    endDate: string;
    updateFilter: (key: string, value: any) => void;
}

export const ActivityDateInputs: React.FC<ActivityDateInputsProps> = ({
    startDate,
    endDate,
    updateFilter,
}) => (
    <>
        <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                <Calendar size={13} className="text-slate-400" />
                Start Date
            </label>
            <div className="relative group">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                <input
                    type="date"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none cursor-pointer"
                    value={startDate}
                    onChange={(e) => updateFilter("startDate", e.target.value)}
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5">
                <Calendar size={13} className="text-slate-400" />
                End Date
            </label>
            <div className="relative group">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                <input
                    type="date"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none cursor-pointer"
                    value={endDate}
                    onChange={(e) => updateFilter("endDate", e.target.value)}
                />
            </div>
        </div>
    </>
);

