export function normalizeOrderInfo(response: any) {
    const hasResyncedAtSignal = Object.prototype.hasOwnProperty.call(response ?? {}, "resynced_at");

    const isUrgent = (() => {
        const check = (obj: any): boolean => {
            if (!obj) return false;
            if (obj.isUrgent === true || obj.urgent === true || obj.is_urgent === true || obj.isUrgent === "true" || obj.isUrgent === "1" || obj.urgent === "1" || obj.is_urgent === "1") return true;
            const tagFields = [obj.tags, obj.customer_tags, obj.order_tags, obj.customer_tags_array];
            for (const tags of tagFields) {
                if (Array.isArray(tags)) {
                    if (tags.some((t: any) => { const s = String(t).toLowerCase(); return s.includes("urgent") || s.includes("makeurgent"); })) return true;
                } else if (typeof tags === "string") {
                    const s = tags.toLowerCase();
                    if (s.includes("urgent") || s.includes("makeurgent")) return true;
                }
            }
            return false;
        };
        return check(response) || check(response.order) || check(response.orderInfo) || check(response.raw_data) || check(response.raw_data?.order);
    })();

    const isParked = (() => {
        const check = (obj: any): boolean => {
            if (!obj) return false;
            const tagFields = [obj.tags, obj.order_tags];
            for (const tags of tagFields) {
                if (Array.isArray(tags)) {
                    if (tags.some((t: any) => String(t).toLowerCase().replace(/[\s\-_]/g, '') === 'parkedorder')) return true;
                } else if (typeof tags === 'string') {
                    if (tags.toLowerCase().replace(/[\s\-_]/g, '').includes('parkedorder')) return true;
                }
            }
            return false;
        };
        return check(response) || check(response.order) || check(response.orderInfo) || check(response.raw_data) || check(response.raw_data?.order);
    })();

    return {
        orderId: response.order_name || response._id || response.id || response.guid || response.orderInfo?.orderId || response.order_id || "",
        shopifyOrderId: Number(response.shopify_order_id ?? response.shopifyOrderId ?? response.orderInfo?.shopifyOrderId ?? 0),
        createdAt: response.orderInfo?.createdAt ?? response.created_at ?? response.createdAt ?? "",
        resyncedAt: hasResyncedAtSignal ? (response.resynced_at ?? null) : undefined,
        status: response.orderInfo?.status ?? response.status ?? null,
        fulfillmentStatus: response.orderInfo?.fulfillmentStatus ?? response.fulfillment_status ?? response.fulfillmentStatus ?? null,
        readOnly: response.orderInfo?.readOnly ?? response.readOnly ?? response.read_only ?? false,
        isUrgent,
        isParked,
        tags: response.orderInfo?.tags ?? response.tags ?? null,
    };
}
