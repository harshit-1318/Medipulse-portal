import React from 'react';
import { Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useUserInfo } from '@/store';

export function DriverDashboardView() {
    const user = useUserInfo();
    const name = user?.username || 'Driver';

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-linear-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    Logistics & Deliveries Portal — {name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                    Manage assigned parcel dispatches, route manifests, and delivery confirmations.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <Truck size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Assigned Deliveries</h3>
                    <p className="text-2xl font-extrabold text-slate-900 mt-2">Active</p>
                    <a href="/orders/all" className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700">
                        View orders queue →
                    </a>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                        <Clock size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">In Transit</h3>
                    <p className="text-2xl font-extrabold text-slate-900 mt-2">Dispatches</p>
                    <a href="/orders/all" className="inline-block mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700">
                        Check transit status →
                    </a>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Completed Deliveries</h3>
                    <p className="text-2xl font-extrabold text-slate-900 mt-2">Delivered</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600">
                        <MapPin size={13} /> Proof of delivery active
                    </span>
                </div>
            </div>
        </div>
    );
}
