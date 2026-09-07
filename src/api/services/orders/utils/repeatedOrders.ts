/**
 * Resolves repeated orders count from dirty order object with fallback logic.
 */
export function resolveRepeatedOrders(o: any, filterHint?: string): number {
    const rawVal =
        o.repeatedOrders ??
        o.repeated_orders ??
        o.repeat_count ??
        o.repeatCount ??
        o.totalOrders ??
        o.total_orders ??
        o.orders_count ??
        o.order_count ??
        o.customer?.orders_count ??
        o.customer?.total_orders ??
        o.customerInfo?.totalOrders ??
        o.customerInfo?.total_orders ??
        o.customer_order_count ??
        o.customerInfo?.orders_count ??
        o.ordersCount ??
        o.total_orders_count;

    const num = Number(rawVal);

    const totalOrdersFallback = Number(
        o.customer?.orders_count ||
            o.customer?.total_orders ||
            o.customerInfo?.totalOrders ||
            o.customerInfo?.total_orders ||
            o.customer?.ordersCount ||
            0,
    );

    if ((num === 0 || Number.isNaN(num)) && totalOrdersFallback > 1) {
        return totalOrdersFallback - 1;
    }

    if (!Number.isNaN(num)) {
        return num;
    }

    const type = String(o.order_type || "").toLowerCase();
    const tags = Array.isArray(o.tags) ? o.tags.join(" ").toLowerCase() : String(o.tags || "").toLowerCase();

    if (type.includes("repeat") || tags.includes("repeat") || tags.includes("returning")) {
        return 1;
    }

    if (type.includes("first") || tags.includes("first") || tags.includes("new")) {
        return 0;
    }

    if (filterHint === "repeat") return 1;
    if (filterHint === "first") return 0;

    return 0;
}
