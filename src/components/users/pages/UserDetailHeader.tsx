import { ArrowLeft, Mail, ShieldCheck, Building2, Activity } from "lucide-react";
import type { User } from "@/components/users/types";

interface UserDetailHeaderProps {
    user: User | null;
    loadingUser: boolean;
    subtitle: string;
    statusLabel: string;
}

export function UserDetailHeader({ user, loadingUser, subtitle, statusLabel }: UserDetailHeaderProps) {
    return (
        <>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <a
                        href="/users"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={15} />
                        Back to Users
                    </a>
                    <h1 className="mt-2 text-[24px] font-bold text-slate-900 tracking-tight">User Details</h1>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
                {user && (
                    <a
                        href={`/users/${user._id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#00A294] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008F83] transition-colors shadow-xs"
                    >
                        Edit User
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Name</p>
                        <ShieldCheck size={16} className="text-slate-400" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{loadingUser ? "Loading..." : user?.name || "-"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Email</p>
                        <Mail size={16} className="text-slate-400" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{loadingUser ? "Loading..." : user?.email || "-"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Role</p>
                        <Building2 size={16} className="text-slate-400" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                        {loadingUser ? "Loading..." : user?.is_super_admin ? "Super Admin" : user?.role || "-"}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Status</p>
                        <Activity size={16} className="text-slate-400" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{loadingUser ? "Loading..." : statusLabel}</p>
                </div>
            </div>
        </>
    );
}
