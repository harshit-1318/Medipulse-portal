/**
 * Centralized date formatting for the portal platform.
 * Ensures consistent display across tables and detailed views.
 */

export interface FormattedDate {
    date: string;     // e.g. "25 Feb 24"
    subtext: string;  // e.g. "2 days ago"
}

/**
 * Formats a date string into an object with separated date and "time ago" info.
 * USES UTC STRICTLY so the displayed date matches what Shopify shows (Shopify stores
 * and displays all dates in UTC).
 * 
 * @param {string | undefined | null} date - The date string to format
 * @returns {FormattedDate} Object containing separated date and ago strings
 */
export function formatDate(date: string | undefined | null, mockNow?: Date): FormattedDate {
    if (!date) return { date: "—", subtext: "" };
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return { date: String(date), subtext: "" };

        // 1. Top line: "DD MMM YY" (e.g. 25 Feb 26)
        //    UTC timezone keeps parity with Shopify's date display
        const dateStr = new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
            timeZone: "UTC",
        }).format(d);

        // 2. Bottom line: "Time Ago"
        const subtext = getTimeAgo(d, mockNow);

        return {
            date: dateStr,
            subtext: subtext
        };
    } catch {
        return { date: String(date), subtext: "" };
    }
}

/**
 * Helper to calculate relative time (Time Ago)
 */
export function getTimeAgo(date: Date, mockNow?: Date): string {
    const now = mockNow || new Date();
    const rawDiffMs = now.getTime() - date.getTime();
    let diffInMs = rawDiffMs;

    // Handle mock seed data where local wall-clock hours were saved directly as UTC
    if (rawDiffMs < -60000) {
        const nowLocalMs = now.getTime() - (now.getTimezoneOffset() * 60000);
        const localWallDiffMs = nowLocalMs - date.getTime();
        if (localWallDiffMs >= -60000) {
            diffInMs = localWallDiffMs;
        }
    }

    const diffInSeconds = Math.floor(diffInMs / 1000);

    // Less than 1 minute ago (or within 60s clock drift)
    if (diffInSeconds < 60) return "Just now";

    // 1–59 minutes ago
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
    }

    // 1 hour ago
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";

    // 2–23 hours ago
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    // 1 day ago / 2+ days ago (normalized to UTC calendar days)
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const diffInDays = Math.floor((nowUTC - dateUTC) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) return "Yesterday";
    if (diffInDays >= 2) return `${diffInDays} days ago`;

    const elapsedDays = Math.max(1, Math.floor(diffInHours / 24));
    return elapsedDays === 1 ? "Yesterday" : `${elapsedDays} days ago`;
}
