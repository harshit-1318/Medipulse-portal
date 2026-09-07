export type OrderStatus = "UNFULFILLED" | "FULFILLED" | "CANCELLED" | "ON_HOLD" | "PAID" | "SHIPPED" | "VOIDED";

export interface StatusStyle {
    bg: string;
    border: string;
    text: string;
    dot: string;
    label: string;
}

export const STATUS_MAP: Record<string, StatusStyle> = {
    UNFULFILLED: {
        bg: "bg-amber-50/80",
        border: "border-amber-100",
        text: "text-amber-700",
        dot: "bg-amber-500",
        label: "Unfulfilled"
    },
    ON_HOLD: {
        bg: "bg-orange-50/80",
        border: "border-orange-100",
        text: "text-orange-700",
        dot: "bg-orange-500",
        label: "On Hold"
    },
    CANCELLED: {
        bg: "bg-red-50/80",
        border: "border-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
        label: "Cancelled"
    },
    FULFILLED: {
        bg: "bg-emerald-50/80",
        border: "border-emerald-100",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Fulfilled"
    },
    PAID: {
        bg: "bg-emerald-50/80",
        border: "border-emerald-100",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Paid"
    },
    SHIPPED: {
        bg: "bg-blue-50/80",
        border: "border-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
        label: "Shipped"
    },
    VOIDED: {
        bg: "bg-slate-50/80",
        border: "border-slate-100",
        text: "text-slate-700",
        dot: "bg-slate-500",
        label: "Voided"
    }
};

export const DEFAULT_STYLE: StatusStyle = {
    bg: "bg-slate-50/80",
    border: "border-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    label: "Unknown"
};
