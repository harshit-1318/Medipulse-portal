export const TEMPLATE_ENTRIES: { key: string; label: string; hint: string }[] = [
    {
        key: "missing-docs",
        label: "Missing Documents (1st reminder)",
        hint: "\"Don't forget to upload\" email sent ~5 days after order",
    },
    {
        key: "oops-missing-all",
        label: "Oops Reminder (2nd / 3rd reminder)",
        hint: "Follow-up reminder sent at ~10 and ~11 days",
    },
    {
        key: "docs-now-complete",
        label: "All Set / Documents Complete",
        hint: "Sent when all required documents have been uploaded",
    },
    {
        key: "gp-letterNotification",
        label: "GP Letter Notification",
        hint: "Sent to the GP when a treatment letter PDF is ready",
    },
    {
        key: "survey-invite",
        label: "Survey Invitation",
        hint: "Sent to patients invited to complete a survey",
    },
    {
        key: "video-room-template",
        label: "Video Room Link",
        hint: "Sent to the customer when their Daily.co video consultation room is created",
    },
    {
        key: "mounjaro-already-documents",
        label: "Prescription In Review — Mounjaro",
        hint: "Sent every 3 days to returning Mounjaro customers while prescription awaits approval",
    },
    {
        key: "wegovy-already-documents",
        label: "Prescription In Review — Wegovy",
        hint: "Sent every 3 days to returning Wegovy customers while prescription awaits approval",
    },
    {
        key: "order-email",
        label: "Document Reminder",
        hint: "Sent when pharmacist clicks 'Send Document Reminder' on an order",
    },
    {
        key: "prescription-email",
        label: "Prescription Sent",
        hint: "Sent to customer when their prescription is issued",
    },
    {
        key: "age-verified-email",
        label: "Age Verification Request",
        hint: "Sent when customer needs to verify their age for a non-weight-loss order",
    },
    {
        key: "order-message",
        label: "Order Message",
        hint: "Sent when a pharmacist sends a custom message to a customer via the order page",
    },
    {
        key: "oops-video-verification",
        label: "Oops — Video Only Missing",
        hint: "Variant of the oops reminder sent when only the verification video is still missing",
    },
    {
        key: "six-month-progress",
        label: "Six Month Progress",
        hint: "Sent at the 6-month mark to weight-loss customers tracking their progress",
    },
];
