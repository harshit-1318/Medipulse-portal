import { useMemo } from 'react';
import type { Product } from "@/components/order-details/types";
import { isClinicalProduct } from "@/components/order-details/utils";

export function useSortedConsultationProducts(products: Product[]) {
    const clinicalProducts = useMemo(
        () => products.filter((product) => isClinicalProduct(product)),
        [products],
    );

    const nonClinicalWithData = useMemo(
        () => products.filter(
            (p) =>
                !isClinicalProduct(p) &&
                (
                    (p.consultationQuestions && p.consultationQuestions.length > 0) ||
                    (p.lineItemsRaw && p.lineItemsRaw.some((item) => item.properties && item.properties.length > 0))
                ),
        ),
        [products],
    );

    const sortedProducts = useMemo(
        () => [
            ...[...clinicalProducts].sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const aIsMounjaro = aName.includes("mounjaro");
                const bIsMounjaro = bName.includes("mounjaro");

                if (aIsMounjaro && !bIsMounjaro) return -1;
                if (!aIsMounjaro && bIsMounjaro) return 1;
                return 0;
            }),
            ...nonClinicalWithData,
        ],
        [clinicalProducts, nonClinicalWithData],
    );

    return sortedProducts;
}
