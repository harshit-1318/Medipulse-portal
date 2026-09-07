export const ACTION_LABELS: Record<string, string> = {
    order_viewed: "Order Viewed",
    order_status_changed: "Status Changed",
    order_urgent_flagged: "Urgent Flagged",
    order_marked_urgent: "Marked Urgent",
    order_created: "Order Created",
    review_started: "Review Started",
    review_completed: "Review Completed",
    gp_email_sent: "GP Email Sent",
    prescription_email_sent: "Prescription Email",
    customer_message_sent: "Customer Message",
    document_reminder_sent: "Document Reminder",
    six_month_email_sent: "6-Month Email",
    email_sent: "Email Sent",
    email_failed: "Email Failed",
    pdf_generated: "PDF Generated",
    login_success: "Login",
    login_failed: "Login Failed",
    user_created: "User Created",
    user_updated: "User Updated",
    user_deleted: "User Deleted",
    site_created: "Site Created",
    site_updated: "Site Updated",
    room_created: "Video Room Created",
    room_joined: "Video Room Joined",
    recording_started: "Recording Started",
    recording_stopped: "Recording Stopped",
    webhook_processed: "Webhook Processed",
    order_imported: "Order Imported",
};

export function labelFor(action: string) {
    return ACTION_LABELS[action] ?? action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
