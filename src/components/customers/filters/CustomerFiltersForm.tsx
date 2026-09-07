import { Search, Hash, Calendar } from "lucide-react";
interface Props {
    localSearch: string;
    setLocalSearch: (v: string) => void;
    localTotalPens: string;
    setLocalTotalPens: (v: string) => void;
    localStartDate: string;
    setLocalStartDate: (v: string) => void;
}

export function CustomerFiltersForm({
    localSearch,
    setLocalSearch,
    localTotalPens,
    setLocalTotalPens,
    localStartDate,
    setLocalStartDate,
}: Props) {
    return (
        <div className="px-7 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Customer */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Search Customer</label>
                    <div className="relative group/input">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors z-10">
                            <Search size={16} strokeWidth={2.5} />
                        </div>
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-slate-200 text-[13px] font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none shadow-xs transition-all placeholder:text-slate-300"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search by Name, Email, or ID..."
                        />
                    </div>
                </div>

                {/* Total Pens */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Total Pens</label>
                    <div className="relative group/input">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors z-10">
                            <Hash size={16} strokeWidth={2.5} />
                        </div>
                        <input
                            type="number"
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-slate-200 text-[13px] font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none shadow-xs transition-all placeholder:text-slate-300"
                            value={localTotalPens}
                            onChange={(e) => setLocalTotalPens(e.target.value)}
                            placeholder="Total Pens (e.g. 5)"
                        />
                    </div>
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">Start Date</label>
                    <div className="relative group/input">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors z-10">
                            <Calendar size={16} strokeWidth={2.5} />
                        </div>
                        <input
                            type="date"
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-slate-200 text-[13px] font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none shadow-xs transition-all cursor-pointer"
                            value={localStartDate}
                            onChange={(e) => setLocalStartDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
