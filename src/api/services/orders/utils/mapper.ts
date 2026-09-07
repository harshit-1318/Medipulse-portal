import type { OrderType } from "../types";
import { parseProducts, detectCategory } from "./products";
import { normalizeStatus, detectDocsStatus, getDocumentItemsStatus, resolveRawOrderStatus } from "./status";
import { resolveRepeatedOrders } from "./repeatedOrders";

/**
 * Centralized Order Mapper
 * Converts raw backend order objects into a strictly typed `OrderType`
 * for frontend table rendering.
 */
export function mapBackendOrderToFrontend(o: any, forceDocuments?: any, filterHint?: string): OrderType {
    const products = parseProducts(o);
    const documentItemsStatus = getDocumentItemsStatus(o);
    let hasDocs = detectDocsStatus(o);

    if (forceDocuments === "Uploaded") hasDocs = true;
    if (forceDocuments === "Not Uploaded") hasDocs = false;

    let internalId = o.orderId || o.name || o.order_name;

    if (!internalId || internalId.length > 15) {
        if (o.order_number) internalId = `#${o.order_number}`;
        else if (o.orderNumber) internalId = `#${o.orderNumber}`;
        else if (o.shopify_order_id && String(o.shopify_order_id).length < 15) internalId = `#${o.shopify_order_id}`;
        else internalId = o.id || o._id || "--";
    }

    const resolvedShopifyId = o.shopify_order_id || o.shopifyOrderId || o.order_id || o.orderNumber || o.order_number || o.id || o._id || "--";

    return {
        ...o,
        id: String(internalId),
        shopify_order_id: String(resolvedShopifyId),
        status: normalizeStatus(resolveRawOrderStatus(o)),
        date: o.createdAt || o.created_at || o.date,
        updatedAt: o.updatedAt || o.updated_at || o.createdAt || "",
        customer: o.customer ?? null,
        products: products,
        category: detectCategory(products),
        documents: hasDocs ? "Uploaded" : "Not Uploaded",
        documentsUploaded: hasDocs,
        documentItemsStatus,
        repeatedOrders: resolveRepeatedOrders(o, filterHint),
        isUrgent: Boolean(
            o.isUrgent ||
            o.urgent ||
            o.is_urgent ||
            (Array.isArray(o.tags) && o.tags.some((t: any) => String(t).toLowerCase() === "makeurgent")) ||
            (typeof o.tags === "string" && o.tags.toLowerCase().includes("makeurgent")),
        ),
        isParked: Boolean(
            o.isParked ||
            o.is_parked ||
            (Array.isArray(o.tags) && o.tags.some((t: any) => String(t).toLowerCase().replace(/[\s\-_]/g, '') === "parkedorder")) ||
            (typeof o.tags === "string" && o.tags.toLowerCase().replace(/[\s\-_]/g, '').includes("parkedorder")),
        ),
        tags: o.tags || [],
    };
}
