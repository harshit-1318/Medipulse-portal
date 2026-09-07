import { useState } from "react";
import { resyncOrderFromShopify } from "../../../api/services/orders/actions/order";
import { isLocalStorageDebugFlagEnabled } from "../../../utils/env";

export function useResyncFromShopify() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const logAutoResync = (...args: unknown[]) => {
        if (!isLocalStorageDebugFlagEnabled("DEBUG_AUTO_RESYNC")) return;
        console.log("[AUTO_RESYNC_DEBUG]", ...args);
    };

    const handleResync = async (orderId: string) => {
        if (isLoading) {
            logAutoResync("manual/auto resync ignored because request already in-flight", { orderId });
            return;
        }

        logAutoResync("resync request started", { orderId });

        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            await resyncOrderFromShopify(orderId);
            setIsSuccess(true);
            logAutoResync("resync request succeeded", { orderId });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to re-sync order from Shopify";
            setError(errorMessage);
            logAutoResync("resync request failed", { orderId, errorMessage, err });
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, isSuccess, error, handleResync };
}
