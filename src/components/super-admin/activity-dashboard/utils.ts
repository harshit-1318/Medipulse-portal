export function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

export function shortDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    } catch {
        return iso;
    }
}

export function formatActionLabel(action: string): string {
    return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

export const PERIOD_OPTIONS = [
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "90 days", value: 90 },
];

export const COMM_ACTION_LABELS: Record<string, string> = {
    video_consultation_sent: "Video Consultation",
    in_person_video_consultation_sent: "In-Person / Video",
    prescription_reminder_sent: "Prescription Reminder",
    document_reminder_sent: "Document Reminder",
    six_month_review_sent: "6-Month Review",
    customer_message_sent: "Customer Message",
    gp_email_sent: "GP Correspondence",
};
