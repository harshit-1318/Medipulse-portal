export const ACTION_OPTIONS = [
    { label: "All Actions", value: "" },
    // Order actions
    { label: "Order Viewed", value: "order_viewed" },
    { label: "Order Created", value: "order_created" },
    { label: "Order Status Changed", value: "order_status_changed" },
    { label: "Order Urgent Flagged", value: "order_urgent_flagged" },
    { label: "GP Email Sent", value: "gp_email_sent" },
    { label: "Document Reminder Sent", value: "document_reminder_sent" },
    { label: "Prescription Email Sent", value: "prescription_email_sent" },
    { label: "Email Skipped", value: "email_skipped" },
    // Shopify actions
    { label: "Order Imported", value: "order_imported" },
    { label: "Webhook Processed", value: "webhook_processed" },
    // Auth
    { label: "Login", value: "login_success" },
    { label: "Logout", value: "logout" },
];

export const PAGE_OPTIONS = [
    { label: "All Pages", value: "" },
    { label: "Orders", value: "orders" },
    { label: "Auth", value: "auth" },
    { label: "Users", value: "users" },
    { label: "Shopify Import", value: "shopify-import" },
    { label: "Shopify Webhook", value: "shopify-webhook" },
];

export const ROLE_OPTIONS = [
    { label: "All Roles", value: "" },
    { label: "Super Admin", value: "super_admin" },
    { label: "Admin", value: "admin" },
    { label: "Prescriber", value: "prescriber" },
    { label: "Pharmacist", value: "pharmacist" },
    { label: "Pharmacy Staff", value: "pharmacy_staff" },
    { label: "Customer Support", value: "customer_support" },
    { label: "Driver", value: "driver" },
    { label: "Customer", value: "customer" },
];
