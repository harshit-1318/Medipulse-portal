export function normalizeCustomer(order: any) {
    if (typeof order.customer === "string") {
        return { name: order.customer, email: "--", id: "--" };
    }
    const c = order.customer || {};
    return {
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || "--",
        email: c.email || "--",
        id: c.id || "--",
    };
}
