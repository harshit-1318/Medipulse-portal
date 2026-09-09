export function normalizeCustomer(order: any) {
    if (typeof order.customer === "string") {
        return {
            name: order.customer || order.customerName || "--",
            email: order.customerEmail || "--",
            id: order.customerId || order.customer_id || order.store_order_id || "--",
        };
    }
    const c = order.customer || {};
    const composedName = `${c.first_name || ""} ${c.last_name || ""}`.trim();
    const name = composedName || c.name || order.customerName || order.customer_name || "--";
    const email = c.email || order.customerEmail || order.customer_email || "--";
    const id = c.id || c._id || order.customerId || order.customer_id || order.store_order_id || order.shopify_order_id || "--";

    return { name, email, id };
}
