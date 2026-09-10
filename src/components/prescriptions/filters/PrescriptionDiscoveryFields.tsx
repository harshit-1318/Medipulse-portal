import { Search, User } from "lucide-react";

interface Props {
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localPrescriber: string;
    setLocalPrescriber: (v: string) => void;
    localCustomerId: string;
    setLocalCustomerId: (v: string) => void;
}

export const PrescriptionDiscoveryFields: React.FC<Props> = ({
    localOrderId, setLocalOrderId, localPrescriber, setLocalPrescriber, localCustomerId, setLocalCustomerId
}) => {
    return (
        <section className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
                <div className="p-1 bg-[#00a294]/10 text-[#00a294] rounded-md border border-[#00a294]/20 shadow-xs">
                    <User size={13} strokeWidth={2.5} />
                </div>
                <h3 className="text-[11px] font-black text-slate-700 tracking-[0.12em] uppercase">Order & Prescriber Discovery</h3>
                <div className="h-px flex-1 bg-slate-200/70 ml-2 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-3 flex flex-col gap-1 text-left group">
                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">
                        Order ID
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                            <Search size={15} strokeWidth={2.5} />
                        </div>
                        <input
                            className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                            value={localOrderId}
                            onChange={(e) => setLocalOrderId(e.target.value)}
                            placeholder="Order ID..."
                        />
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 flex flex-col gap-1 text-left group">
                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">
                        Customer ID
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                            <User size={15} strokeWidth={2.5} />
                        </div>
                        <input
                            className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                            value={localCustomerId}
                            onChange={(e) => setLocalCustomerId(e.target.value)}
                            placeholder="Customer ID..."
                        />
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 flex flex-col gap-1 text-left group">
                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider group-focus-within:text-[#00a294] transition-colors">
                        Prescriber
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00a294] transition-colors pointer-events-none">
                            <User size={15} strokeWidth={2.5} />
                        </div>
                        <input
                            className="w-full h-9.5 pl-9 pr-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#00a294]/10 focus:border-[#00a294] focus:bg-white focus:outline-none transition-all duration-200 hover:border-slate-300 shadow-xs"
                            value={localPrescriber}
                            onChange={(e) => setLocalPrescriber(e.target.value)}
                            placeholder="Search Prescriber (Name, Email, RegNo)"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
