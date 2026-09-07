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
        <section className="space-y-3.5 text-left bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100/50">
            <div className="flex items-center gap-3 px-1 group/section">
                <div className="relative p-2 bg-white text-indigo-600 rounded-xl border border-indigo-100 shadow-sm transition-all duration-300">
                    <User size={15} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-[12px] font-black text-slate-800 tracking-[0.15em] uppercase leading-none">Order & Prescriber Discovery</h3>
                    <div className="h-0.5 w-12 bg-indigo-500/30 mt-1.5 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Order ID</label>
                    <div className="relative group/input">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" />
                        <input
                            className="w-full h-11 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-[14px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white focus:outline-none shadow-xs transition-all placeholder:text-slate-400 font-bold text-slate-700"
                            value={localOrderId}
                            onChange={(e) => setLocalOrderId(e.target.value)}
                            placeholder="Order ID..."
                        />
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Customer ID</label>
                    <div className="relative group/input">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" />
                        <input
                            className="w-full h-11 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-[14px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white focus:outline-none shadow-xs transition-all placeholder:text-slate-400 font-bold text-slate-700"
                            value={localCustomerId}
                            onChange={(e) => setLocalCustomerId(e.target.value)}
                            placeholder="Customer ID..."
                        />
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Prescriber</label>
                    <div className="relative group/input">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" />
                        <input
                            className="w-full h-11 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-[14px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white focus:outline-none shadow-xs transition-all placeholder:text-slate-400 font-bold text-slate-700"
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
