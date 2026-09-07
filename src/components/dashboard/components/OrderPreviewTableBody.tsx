import { OrderPreviewRow } from './OrderPreviewRow';
import type { OrderType } from '@/api/services/orders';

interface OrderPreviewTableBodyProps {
    orders: OrderType[];
    loading: boolean;
}

export function OrderPreviewTableBody({ orders, loading }: OrderPreviewTableBodyProps) {
    if (loading) {
        return (
            <tbody className="divide-y divide-slate-100/60">
                <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500 font-medium">Loading orders...</td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="divide-y divide-slate-100/60">
            {orders.map((order, idx) => (
                <OrderPreviewRow key={idx} order={order} />
            ))}
        </tbody>
    );
}
