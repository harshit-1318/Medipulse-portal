import { useEffect, useRef } from "react";
import { shouldAutoResyncOrder } from "@/components/order-details/utils";
import { useUserInfo } from '@/store';
import { useResyncOrder } from "./useResyncOrder";
import {
    getFirstDefinedEnvValue,
    isEnvFlagEnabled,
    isLocalStorageDebugFlagEnabled,
} from "@/utils/env";

export function useAutoResyncOrder(order: any, orderId: string) {
    const logAutoResync = (...args: unknown[]) => {
        if (!isLocalStorageDebugFlagEnabled("DEBUG_AUTO_RESYNC")) return;
        console.log("[AUTO_RESYNC_DEBUG]", ...args);
    };

    const autoResyncEnv = getFirstDefinedEnvValue(
        typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_AUTO_RESYNC : undefined,
        typeof process !== 'undefined' ? process.env.PUBLIC_AUTO_RESYNC : undefined,
        typeof process !== 'undefined' ? process.env.VITE_AUTO_RESYNC : undefined,
        typeof process !== 'undefined' ? process.env.AUTO_RESYNC : undefined,
        (import.meta as any).env?.VITE_AUTO_RESYNC,
        (import.meta as any).env?.PUBLIC_AUTO_RESYNC,
        (import.meta as any).env?.AUTO_RESYNC,
    );
    const isAutoResyncEnabled = isEnvFlagEnabled(autoResyncEnv);

    const userInfo = useUserInfo();
    const role = userInfo?.effectiveRole;
    const canResync =
        role === "admin" ||
        role === "super_admin" ||
        role === "prescriber" ||
        role === "pharmacist" ||
        role === "customer_support";
    const hasAutoResyncedRef = useRef(false);

    const resyncState = useResyncOrder();
    const shouldAutoResync = isAutoResyncEnabled && canResync && shouldAutoResyncOrder(order?.orderInfo?.resyncedAt);

    useEffect(() => {
        hasAutoResyncedRef.current = false;
        logAutoResync("reset auto-resync ref for order", { orderId });
    }, [orderId]);

    useEffect(() => {
        if (!shouldAutoResync || resyncState.isLoading || hasAutoResyncedRef.current) return;
        hasAutoResyncedRef.current = true;
        logAutoResync("auto-resync triggered", { orderId });
        void resyncState.handleResync(orderId);
    }, [shouldAutoResync, resyncState.isLoading, resyncState.handleResync, orderId]);

    return {
        role,
        canResync,
        ...resyncState,
    };
}
