import { getDocumentItemsStatus, detectDocsStatus } from "./docsStatus";

export { getDocumentItemsStatus, detectDocsStatus };

/**
 * Normalizes backend order statuses into a clean, capitalized frontend display format.
 */
export function normalizeStatus(status: string | undefined | null): string {
    if (status === null || status === undefined || String(status).toLowerCase() === "null") return "";
    if (!status || String(status).toLowerCase() === "unknown") return "";

    const s = status.toLowerCase().trim();

    if (s.includes("hold") || s === "pending") return "On Hold";
    if (s.includes("unfulfilled")) return "Unfulfilled";
    if (s.includes("fulfilled") || s.includes("complete")) return "Fulfilled";
    if (s.includes("cancel") || s.includes("void")) return "Cancelled";

    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function isOnHoldStatus(status: string | undefined | null): boolean {
    if (!status) return false;
    const normalized = String(status).toLowerCase().trim().replace(/[\s-]+/g, "_");
    return normalized === "on_hold";
}

/**
 * Resolves the raw order status with the same precedence used by order details.
 */
export function resolveRawOrderStatus(order: any): string | undefined {
    const fulfillmentStatusCandidates = [
        order?.orderInfo?.fulfillmentStatus,
        order?.fulfillmentStatus,
        order?.fulfillment_status,
        order?.raw_data?.fulfillmentStatus,
        order?.raw_data?.fulfillment_status,
        order?.raw_data?.order?.fulfillmentStatus,
        order?.raw_data?.order?.fulfillment_status,
    ];
    const statusCandidates = [
        order?.orderInfo?.status,
        order?.status,
        order?.raw_data?.status,
        order?.raw_data?.order?.status,
    ];

    const fulfillmentStatus = fulfillmentStatusCandidates.find((s) => s !== null && s !== undefined);
    const status = statusCandidates.find((s) => s !== null && s !== undefined);

    if (
        fulfillmentStatusCandidates.some((s) => isOnHoldStatus(s)) ||
        statusCandidates.some((s) => isOnHoldStatus(s))
    ) {
        return "on_hold";
    }

    return fulfillmentStatus ?? status ?? undefined;
}
