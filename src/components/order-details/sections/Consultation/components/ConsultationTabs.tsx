import type { Product } from "@/components/order-details/types";

interface ConsultationTabsProps {
    products: Product[];
    activeProductId: number | string;
    onTabChange: (id: number | string) => void;
}

export const ConsultationTabs = ({ products, activeProductId, onTabChange }: ConsultationTabsProps) => {
    return (
        <div className="flex border-b border-slate-100 mb-6">
            {products.map((product, index) => {
                const id = product.product_id || index;
                const isActive = activeProductId === id;
                return (
                    <button
                        key={`${product.name}-${id}`}
                        onClick={() => onTabChange(id)}
                        className={`px-6 py-3 text-[13px] font-semibold transition-all duration-200 border-b-2 -mb-[2px] ${
                            isActive
                                ? "text-brand-teal border-brand-teal"
                                : "text-text-secondary border-transparent hover:text-text-primary hover:border-slate-200"
                        }`}
                    >
                        {product.name}
                    </button>
                );
            })}
        </div>
    );
};
