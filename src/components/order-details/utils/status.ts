import {
    OrderStatus,
    StatusStyle,
    STATUS_MAP,
    DEFAULT_STYLE,
} from "./statusMap";

export type { OrderStatus, StatusStyle };
export { STATUS_MAP, DEFAULT_STYLE };

export function getOrderStatusStyle(status: string | null | undefined): StatusStyle {
    if (!status) return STATUS_MAP.UNFULFILLED;

    const normalized = status.toUpperCase().replace(/\s/g, "_");
    if (STATUS_MAP[normalized]) {
        return STATUS_MAP[normalized];
    }

    const s = normalized.toLowerCase();
    if (s.includes("hold") || s === "pending") return STATUS_MAP.ON_HOLD;
    if (s.includes("unfulfilled") || s.includes("approval") || s.includes("payment")) return STATUS_MAP.UNFULFILLED;
    if (s.includes("fulfilled") || s.includes("complete") || s.includes("dispatch")) return STATUS_MAP.FULFILLED;
    if (s.includes("cancel") || s.includes("void")) return STATUS_MAP.CANCELLED;

    return { ...DEFAULT_STYLE, label: status };
}

export function detectOrderStatus(fulfillmentStatus: string | null | undefined, status: string | null | undefined): string {
    const fs = fulfillmentStatus?.toLowerCase().trim().replace(/[\s-]+/g, '_');
    const st = status?.toLowerCase().trim().replace(/[\s-]+/g, '_');

    if (fs === 'on_hold' || st === 'on_hold' || fs === 'hold' || st === 'hold') {
        return 'ON_HOLD';
    }
    if (fs === 'unfulfilled' || st === 'unfulfilled') {
        return 'UNFULFILLED';
    }
    if (fs === 'cancelled' || st === 'cancelled' || fs === 'voided' || st === 'voided') {
        return 'CANCELLED';
    }
    if (fs === 'fulfilled' || st === 'fulfilled' || fs === 'completed' || st === 'completed' || fs === 'dispatched' || st === 'dispatched') {
        return 'FULFILLED';
    }
    if (st && ['pending_doctor_approval', 'payment_pending', 'consultation_approved', 'pending'].includes(st)) {
        return 'UNFULFILLED';
    }
    return (fulfillmentStatus || status || "UNFULFILLED").toUpperCase().replace(/\s/g, '_');
}

export function getDisplayStatus(status: string | null | undefined): string {
    if (!status) return "Unfulfilled";
    const style = getOrderStatusStyle(status);

    if (style.label !== status) {
        return style.label;
    }

    return status
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
