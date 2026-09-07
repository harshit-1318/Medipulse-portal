import { Plus, Users } from 'lucide-react';

export default function UsersHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-[#00a294]/10 border border-[#00a294]/20 text-[#00a294] flex items-center justify-center shadow-xs">
                    <Users size={22} strokeWidth={2.2} />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                        User Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Manage platform staff accounts, assign site permissions, and track status.
                    </p>
                </div>
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
