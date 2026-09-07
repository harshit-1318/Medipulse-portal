import { useRecentOrders } from './hooks/useRecentOrders';
import { OrdersFilterBar } from './components/OrdersFilterBar';
import { OrderPreviewTableBody } from './components/OrderPreviewTableBody';
import { QueryProvider } from '../common/QueryProvider';

/**
 * OrdersListPreview Component
 * 
 * Refactored into modular components for better maintainability.
 */
function OrdersListPreviewInternal() {
    const { orders, loading } = useRecentOrders();

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Filters Bar Area */}
            <OrdersFilterBar />

            {/* Main Table Area */}
            <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-[#00609C] tracking-tight">
                        Order List <span className="text-[14px] font-normal text-slate-500 ml-2">(Only Clinical Product Orders)</span>
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[12px] font-bold text-slate-800 uppercase border-b border-slate-100">
                                <th className="px-6 py-5 whitespace-nowrap">#ORDER <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap">ORDER DATE <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap">STATUS <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap">CUSTOMER <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap">ORDERS <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap">PRODUCTS <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap">DOCS <span className="text-slate-400 font-normal ml-1">↑↓</span></th>
                                <th className="px-6 py-5 whitespace-nowrap text-left">ACTIONS</th>
                            </tr>
                        </thead>

                        <OrderPreviewTableBody
                            orders={orders}
                            loading={loading}
                        />
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function OrdersListPreview() {
    return (
        <QueryProvider>
            <OrdersListPreviewInternal />
        </QueryProvider>
    );
}

