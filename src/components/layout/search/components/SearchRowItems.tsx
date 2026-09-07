import React from 'react';
import { Package } from 'lucide-react';
import type { GlobalSearchOrder } from '@/types/globalSearch';

export function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase() || '';
    let cls = 'bg-gray-100 border border-gray-200 text-gray-600';
    if (s === 'fulfilled') cls = 'bg-emerald-50 border border-emerald-200 text-emerald-700';
    else if (s === 'unfulfilled') cls = 'bg-red-50 border border-red-200 text-red-600';
    else if (s.includes('hold')) cls = 'bg-amber-50 border border-amber-200 text-amber-700';
    else if (s.includes('cancel')) cls = 'bg-slate-100 border border-slate-300 text-slate-600';

    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-montserrat tracking-wider ${cls}`}>
            {status ? status.toUpperCase() : '--'}
        </span>
    );
}

export function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
    return (
        <div className="flex items-center gap-2 px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {icon}
            <span>{label}</span>
            <span className="ml-auto font-semibold text-slate-300">{count}</span>
        </div>
    );
}

export function OrderRow({ order, onSelect }: { order: GlobalSearchOrder; onSelect: () => void }) {
    const href = `/orders/view/${order.shopify_order_id}`;
    const isPartial = order.matchType === 'partial';

    return (
        <a
            href={href}
            onClick={onSelect}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors mx-2 group ${isPartial ? 'opacity-80' : ''}`}
        >
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Package size={14} className="text-blue-500" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-800 font-montserrat group-hover:text-blue-600 transition-colors">
                        {order.order_name || `#${order.shopify_order_id}`}
                    </span>
                    {order.matchType === 'exact' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-400 border border-blue-100 uppercase tracking-wider">
                            Exact
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-slate-400 truncate font-montserrat mt-0.5">
                    {order.customerName ? `${order.customerName} · ` : ''}{order.email}
                </p>
            </div>

            {order.status && <StatusBadge status={order.status} />}
        </a>
    );
}

export { CustomerRow } from './CustomerRow';
