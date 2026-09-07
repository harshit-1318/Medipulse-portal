import { Calendar, FileText } from "lucide-react";

interface Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
}

export const PrescriptionTimelineFields: React.FC<Props> = ({ filters, updateFilter }) => {
    return (
        <section className="space-y-3.5 text-left bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100/50">
            <div className="flex items-center gap-3 px-1 group/section">
                <div className="relative p-2 bg-white text-indigo-600 rounded-xl border border-indigo-100 shadow-sm transition-all duration-300">
                    <Calendar size={15} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-[12px] font-black text-slate-800 tracking-[0.15em] uppercase leading-none">Timeline Constraints</h3>
                    <div className="h-0.5 w-12 bg-indigo-500/30 mt-1.5 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-100/50 transition-all group/date">
                    <label className="text-[13px] font-black text-[#003B73] flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/50 transition-colors">
                            <Calendar size={14} strokeWidth={2.5} />
                        </div>
                        Order Date
                    </label>
                    <div className="flex flex-col gap-1.5">
                        <input type="date" className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all cursor-pointer" value={filters.startDate} onChange={(e) => updateFilter("startDate", e.target.value)} />
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-3 rounded-xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-100/50 transition-all group/date">
                    <label className="text-[13px] font-black text-[#003B73] flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/50 transition-colors">
                            <FileText size={14} strokeWidth={2.5} />
                        </div>
                        Review Date
                    </label>
                    <div className="flex flex-col gap-1.5">
                        <input type="date" className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all cursor-pointer" value={filters.reviewStartDate} onChange={(e) => updateFilter("reviewStartDate", e.target.value)} />
                    </div>
                </div>
            </div>
        </section>
    );
};
