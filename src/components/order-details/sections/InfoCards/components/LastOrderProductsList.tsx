import React from 'react';
import { Package } from 'lucide-react';

interface LastOrderProductsListProps {
    relevantProducts: Array<{ name: string }>;
}

export const LastOrderProductsList: React.FC<LastOrderProductsListProps> = ({ relevantProducts }) => {
    if (relevantProducts.length === 0) return null;

    return (
        <div className="flex flex-row items-start justify-between py-2 border-b border-gray-100 last:border-0 w-full min-h-[38px] group/row gap-4">
            <div className="flex items-center gap-2 shrink-0">
                <Package size={16} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                <span className="text-text-secondary font-medium text-[13px] shrink-0">Products</span>
            </div>
            <div className="flex flex-col gap-0.5 items-end text-right">
                {relevantProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 justify-end">
                        <Package size={12} strokeWidth={2.5} className="text-gray-400 shrink-0" />
                        <span className="text-[12px] font-medium text-gray-700 leading-tight">{p.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
