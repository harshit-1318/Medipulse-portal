import React from 'react';
import { ShoppingBag, ClipboardList, ShieldCheck, HelpCircle } from 'lucide-react';
import { useUserInfo } from '@/store';

export function CustomerDashboardView() {
    const user = useUserInfo();
    const name = user?.username || 'Customer';

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-linear-to-r from-cyan-900/40 via-blue-900/30 to-slate-900/40 border border-cyan-500/20 p-6 sm:p-8 backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    Welcome back, {name}!
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                    Manage your prescriptions, consultations, and medical orders from your personal account portal.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
                        <ShoppingBag size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">My Orders</h3>
                    <p className="text-xs text-slate-500 mt-1">Track pending and past order shipments</p>
                    <a href="/account" className="inline-block mt-3 text-xs font-semibold text-cyan-600 hover:text-cyan-700">
                        View orders →
                    </a>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <ClipboardList size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Prescriptions</h3>
                    <p className="text-xs text-slate-500 mt-1">Approved digital prescriptions</p>
                    <a href="/account" className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700">
                        View records →
                    </a>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Account Status</h3>
                    <p className="text-xs text-slate-500 mt-1">Verified patient profile active</p>
                    <span className="inline-block mt-3 text-xs font-bold text-emerald-600">Active ✓</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                        <HelpCircle size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Support Desk</h3>
                    <p className="text-xs text-slate-500 mt-1">Need clinical or prescription help?</p>
                    <a href="mailto:support@medipulse.io" className="inline-block mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700">
                        Contact pharmacy →
                    </a>
                </div>
            </div>
        </div>
    );
}
