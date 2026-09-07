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
        <div className="space-y-2.5">
            <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                <input
                    type="date"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 text-[14px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all shadow-sm hover:border-slate-300 cursor-pointer"
                    value={startDate}
                    onChange={(e) => updateFilter("startDate", e.target.value)}
                />
            </div>
        </div>

        <div className="space-y-2.5">
            <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                <input
                    type="date"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 text-[14px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all shadow-sm hover:border-slate-300 cursor-pointer"
                    value={endDate}
                    onChange={(e) => updateFilter("endDate", e.target.value)}
                />
            </div>
        </div>
    </>
);
