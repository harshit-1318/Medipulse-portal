import { useState, useEffect } from 'react';
import type { Product } from "@/components/order-details/types";

export function useConsultationActiveProduct(sortedProducts: Product[]) {
    const initialProduct = sortedProducts.find(p => 
        (p.consultationQuestions && p.consultationQuestions.length > 0) || 
        (p.lineItemsRaw && p.lineItemsRaw.some(item => item.properties && item.properties.length > 0)) ||
        p.hasValidData
    ) || sortedProducts[0];

    const [activeProductId, setActiveProductId] = useState<number | string>(initialProduct?.product_id ?? 0);

    useEffect(() => {
        if (!sortedProducts.length) {
            setActiveProductId(0);
            return;
        }

        const hasActiveProduct = sortedProducts.some((p, index) => (p.product_id ?? index) === activeProductId);
        if (!hasActiveProduct) {
            const fallbackId = sortedProducts[0]?.product_id ?? 0;
            setActiveProductId(fallbackId);
        }
    }, [activeProductId, sortedProducts]);

    const activeProduct = sortedProducts.find((p, index) => (p.product_id ?? index) === activeProductId) || initialProduct;

    return {
        activeProductId,
        setActiveProductId,
        activeProduct,
    };
}
