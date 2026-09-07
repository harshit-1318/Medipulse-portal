import type { Customer } from "./types";

/**
 * 🔹 Normalize raw customer data from API
 */
export function normalizeCustomer(c: any): Customer {
    const rawId = c?.customerId;

    // BIGINT / Long safe handling
    const customerId = typeof rawId === "object" && rawId !== null ? String(rawId.low ?? rawId) : String(rawId ?? "");

    return {
        customerId,
        name: c?.name?.trim() || "N/A",
        email: c?.email?.trim() || "N/A",
        totalOrders: Number(c?.totalOrders ?? 0),
        totalPens: Number(c?.totalPens ?? 0),
        createdAt: c?.createdAt || c?.created_at || "",
    };
}
