import type { UserActivitySummaryDay } from "@/api/services/activity-log/types";

export type Range = "today" | "7d" | "30d" | "custom";

export const RANGE_LABELS: Record<Range, string> = {
    today: "Today",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    custom: "Custom",
};

export function toLocalDateKey(d: Date) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getDateRange(range: Range, customStart?: string, customEnd?: string): { startDate: string; endDate: string } {
    const today = new Date();
    const end = toLocalDateKey(today);
    if (range === "today") return { startDate: end, endDate: end };
    if (range === "7d") {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return { startDate: toLocalDateKey(start), endDate: end };
    }
    if (range === "30d") {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return { startDate: toLocalDateKey(start), endDate: end };
    }
    return { startDate: customStart ?? end, endDate: customEnd ?? end };
}

export const GROUPS = {
    viewed: ["order_viewed"],
    statusChanged: ["order_status_changed"],
    reviews: ["review_started", "review_completed"],
    emails: [
        "gp_email_sent",
        "prescription_email_sent",
        "customer_message_sent",
        "document_reminder_sent",
        "six_month_email_sent",
        "email_sent",
    ],
    urgent: ["order_urgent_flagged", "order_marked_urgent"],
    pdf: ["pdf_generated"],
};

export function sumGroup(dayActions: Record<string, number> | undefined | null, keys: string[]): number {
    if (!dayActions || typeof dayActions !== "object") return 0;
    return keys.reduce((acc, k) => acc + (dayActions[k] ?? 0), 0);
}

export function aggregateAcrossDays(summary: UserActivitySummaryDay[] | undefined | null) {
    const combined: Record<string, number> = {};
    if (!Array.isArray(summary)) return combined;
    for (const day of summary) {
        if (!day || !day.actions || typeof day.actions !== "object") continue;
        for (const [action, count] of Object.entries(day.actions)) {
            combined[action] = (combined[action] ?? 0) + (typeof count === "number" ? count : 0);
        }
    }
    return combined;
}

export function formatDate(isoDate: string) {
    const d = new Date(isoDate + "T00:00:00Z");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export { ACTION_LABELS, labelFor } from './actionLabels';

