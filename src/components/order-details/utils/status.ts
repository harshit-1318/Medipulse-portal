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
    return STATUS_MAP[normalized] || { ...DEFAULT_STYLE, label: status };
}

export function detectOrderStatus(fulfillmentStatus: string | null | undefined, status: string | null | undefined): string {
    if (fulfillmentStatus?.toLowerCase() === 'on_hold' || status?.toLowerCase() === 'on_hold') {
        return 'ON_HOLD';
    }
    return (fulfillmentStatus || status || "UNFULFILLED").toUpperCase();
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
