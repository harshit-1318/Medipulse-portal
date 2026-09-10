import { Search, Hash, Calendar, User } from "lucide-react";

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
        <div className="p-4 pb-6 space-y-3.5">
            <section className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-[#00a294]/10 text-[#00a294] rounded-md border border-[#00a294]/20 shadow-xs">
                        <User size={13} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-700 tracking-[0.12em] uppercase">Customer Criteria</h3>
                    <div className="h-px flex-1 bg-slate-200/70 ml-2 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Search Customer */}
                    <div className="flex flex-col gap-1 text-left group">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">
                            Search Customer
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                                <Search size={15} strokeWidth={2.5} />
                            </div>
                            <input
                                className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search by Name, Email, or ID..."
                            />
                        </div>
                    </div>

                    {/* Total Pens */}
                    <div className="flex flex-col gap-1 text-left group">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">
                            Total Pens
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                                <Hash size={15} strokeWidth={2.5} />
                            </div>
                            <input
                                type="number"
                                className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                                value={localTotalPens}
                                onChange={(e) => setLocalTotalPens(e.target.value)}
                                placeholder="Total Pens (e.g. 5)"
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col gap-1 text-left group">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">
                            Start Date
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                                <Calendar size={15} strokeWidth={2.5} />
                            </div>
                            <input
                                type="date"
                                className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13px] font-semibold text-slate-800 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs cursor-pointer"
                                value={localStartDate}
                                onChange={(e) => setLocalStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
