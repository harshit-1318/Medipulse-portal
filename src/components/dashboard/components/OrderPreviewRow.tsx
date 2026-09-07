import { Eye } from 'lucide-react';
import type { OrderType } from '@/api/services/orders';
import { renderStatus, renderDocs } from './PreviewStatusBadge';

interface OrderPreviewRowProps {
    order: OrderType;
}

export function OrderPreviewRow({ order }: OrderPreviewRowProps) {
    const renderRepeat = (repeatedOrders: number) => {
        if (repeatedOrders > 1) return <span className="text-[12px] font-bold text-[#10B981] tracking-wide whitespace-nowrap">Repeat</span>;
        return <span className="text-[12px] font-bold text-slate-400 tracking-wide whitespace-nowrap">New</span>;
    };

    const customerObj = typeof order.customer === 'object' && order.customer !== null
        ? order.customer : { first_name: 'Unknown', last_name: '', email: 'unknown@example.com', id: 'N/A' };

    const productName = Array.isArray(order.products) && order.products.length > 0
        ? order.products[0].name : (typeof order.products === 'string' ? order.products : 'Unknown Product');

    return (
        <tr className="hover:bg-slate-50/50 transition-colors duration-200">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <span className="text-[14px] font-extrabold text-slate-900 tracking-tight">{order.id || '#----'}</span>
                    {order.isUrgent && (
                        <div className="badge-pro-urgent transition-all duration-500 animate-in slide-in-from-left-2">
                            <div className="flex items-center gap-1.5 relative z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Urgent</span>
                            </div>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="text-[14px] font-medium text-slate-600">{order.date || 'N/A'}</span></td>
            <td className="px-6 py-4 whitespace-nowrap">{renderStatus(order.fulfillment_status)}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-slate-900">{customerObj.first_name} {customerObj.last_name}</span>
                    <span className="text-[12px] font-normal text-indigo-500">{customerObj.email}</span>
                    <span className="text-[11px] font-normal text-indigo-400">ID: {customerObj.id}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{renderRepeat(order.repeatedOrders)}</td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="text-[14px] font-medium text-slate-600">{productName}</span></td>
            <td className="px-6 py-4 whitespace-nowrap">{renderDocs(order.documents)}</td>
            <td className="px-6 py-3 whitespace-nowrap">
                <div className="flex flex-col gap-1.5">
                    <a href={`/orders/view/${order.id?.replace('#', '')}`} className="flex items-center justify-center gap-1.5 bg-[#00A294] hover:bg-[#008F83] text-white text-[11px] font-bold px-4 py-1.5 rounded-md transition-colors"><Eye size={12} strokeWidth={2.5} /> View</a>
                    <button className="flex items-center justify-center gap-1.5 bg-[#E62E45] hover:bg-[#D42236] text-white text-[11px] font-bold px-4 py-1.5 rounded-md transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Urgent</button>
                </div>
            </td>
        </tr>
    );
}
