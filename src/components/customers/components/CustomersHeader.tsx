import { Users } from "lucide-react";

export default function CustomersHeader() {
    return (
        <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm transition-transform duration-300 hover:rotate-3">
                <Users size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
                Customers
            </h1>
        </div>
    );
}
