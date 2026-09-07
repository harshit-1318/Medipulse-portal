import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/api/services/orders";
import { useGlobalLoader } from '@/store';
import { useEffect } from "react";
import { normalizeOrderData } from "@/components/order-details/utils";

export function useOrderDetails(shopifyId: string | undefined) {
    const { data: order, isLoading: loading, error } = useQuery({
        queryKey: ["order", shopifyId],
        queryFn: async () => {
            if (!shopifyId) return null;
            const res = await getOrderById(shopifyId);
            if (!res) return null;

            return normalizeOrderData(res);
        },
        enabled: !!shopifyId,
    });

    useEffect(() => {
        const store = useGlobalLoader.getState();
        if (loading) {
            store.start("fetch-order-details");
        } else {
            store.stop("fetch-order-details");
        }
    }, [loading]);

    return { order, loading, error };
}
