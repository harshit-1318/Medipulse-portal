import { Users } from 'lucide-react';
import type { GlobalSearchCustomer } from '@/types/globalSearch';

export function CustomerRow({ customer, onSelect }: { customer: GlobalSearchCustomer; onSelect: () => void }) {
    const href = `/orders/all?customerId=${customer.customer_id}&sortBy=createdAt&sort=desc`;
    const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
    const isPartial = customer.matchType === 'partial';

    return (
        <a
            href={href}
            onClick={onSelect}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors mx-2 group ${isPartial ? 'opacity-80' : ''}`}
        >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Users size={14} className="text-emerald-500" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-800 font-montserrat group-hover:text-emerald-600 transition-colors">
                        {fullName || 'Unknown Customer'}
                    </span>
                    {customer.matchType === 'exact' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-400 border border-emerald-100 uppercase tracking-wider">
                            Exact
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-slate-400 truncate font-montserrat mt-0.5">
                    {customer.email}
                    {customer.customer_id ? ` · ID: ${customer.customer_id}` : ''}
                </p>
            </div>

            <span className="text-[10px] text-slate-300 font-montserrat whitespace-nowrap group-hover:text-emerald-400 transition-colors">
                View orders →
            </span>
        </a>
    );
}
