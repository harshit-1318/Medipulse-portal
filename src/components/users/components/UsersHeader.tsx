import { Plus } from 'lucide-react';

export default function UsersHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
                <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
                    User Management
                </h1>
            </div>

            <a
                href="/users/create"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-linear-to-r from-[#00a294] to-[#008f82] hover:from-[#008f82] hover:to-[#007c70] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-[0_4px_14px_rgba(0,162,148,0.25)] hover:shadow-[0_6px_20px_rgba(0,162,148,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group shrink-0"
            >
                <Plus size={16} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Add User</span>
            </a>
        </div>
    );
}
