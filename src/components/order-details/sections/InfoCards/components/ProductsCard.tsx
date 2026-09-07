import { ShoppingBag, Package } from "lucide-react";
import type { ApiResponse } from "@/components/order-details/types";

interface ProductsCardProps {
    products: ApiResponse["products"];
}

export function ProductsCard({ products }: ProductsCardProps) {
    return (
        <div className="relative group p-4 bg-white border border-slate-200 shadow-premium rounded-2xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:border-slate-300 overflow-hidden h-full">
            <div className="flex items-center gap-3 mb-2 relative z-10 shrink-0">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-200 transition-transform group-hover:scale-105 duration-500">
                    <ShoppingBag size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-text-primary leading-none">Products</h3>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start relative z-10 overflow-hidden">
                <div className="space-y-1 overflow-y-auto custom-scrollbar pr-1 w-full flex-col flex h-full">
                    {products.map((p, idx) => (
                        <div key={idx} className="flex flex-col gap-1 py-2 border-b border-gray-100 last:border-0 shrink-0">
                            <div className="flex gap-2 items-start shrink-0">
                                <Package size={16} strokeWidth={2.5} className="text-gray-400 shrink-0 mt-px" />
                                <span className="text-text-primary font-semibold text-[13px] leading-tight block">
                                    {p.name}
                                </span>
                            </div>
                            <div className="flex items-center justify-between ml-[24px]">
                                <span className="text-[12px] font-medium text-text-secondary">Qty: {p.quantity}</span>
                                <span className="text-[13px] font-semibold text-text-primary">
                                    £{p.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
