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
export function formatDate(date: string | undefined | null): FormattedDate {
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
        const subtext = getTimeAgo(d);

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
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    // For days and above, normalize to UTC midnight to get full calendar day difference
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const diffInDays = Math.floor((nowUTC - dateUTC) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
}
