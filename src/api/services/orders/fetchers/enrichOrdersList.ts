export function enrichOrdersList(data: any): any[] {
    const rawOrders = Array.isArray(data?.orders) ? data.orders : [];
    const enrichedOrders = Array.isArray(data?.enrichedOrders) ? data.enrichedOrders : [];

    if (enrichedOrders.length > 0) {
        const rawMap = new Map();
        rawOrders.forEach((o: any) => rawMap.set(o._id || o.id, o));

        return enrichedOrders.map((eo: any) => {
            const id = eo._id || eo.id;
            const raw = rawMap.get(id);
            if (!raw) return eo;

            const merged = { ...raw, ...eo };
            const hasRawItems = (raw.line_items?.length > 0 || raw.lineItems?.length > 0);
            const hasEnrichedItems = (eo.line_items?.length > 0 || eo.lineItems?.length > 0);
            if (!hasEnrichedItems && hasRawItems) {
                merged.line_items = raw.line_items;
                merged.lineItems = raw.lineItems;
            }

            const countFields = ['repeatedOrders', 'repeated_orders', 'repeat_count', 'repeatCount', 'totalOrders', 'total_orders', 'orders_count', 'order_count'];
            countFields.forEach(field => {
                if (raw[field] !== undefined) {
                    merged[field] = raw[field];
                }
            });

            return merged;
        });
    }
    
    return rawOrders.length > 0 ? rawOrders : (Array.isArray(data) ? data : []);
}
