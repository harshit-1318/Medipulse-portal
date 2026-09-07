import {
    Activity,
    ArrowRightLeft,
    ClipboardEdit,
    Eye,
    FileJson,
    LogIn,
    Mail,
    Search,
    ShoppingCart,
    UserPlus,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Bell,
    FileText,
    Webhook,
} from "lucide-react";

export const getActionConfig = (action?: string) => {
    const normalizedAction = action?.toLowerCase() || "";

    if (normalizedAction.includes("login")) {
        return { label: "Login", icon: LogIn, color: "#10B981", bg: "#ECFDF5", border: "#D1FAE5" };
    }
    if (normalizedAction.includes("order") && normalizedAction.includes("create")) {
        return { label: "Order Created", icon: ShoppingCart, color: "#0ea5e9", bg: "#f0f9ff", border: "#e0f2fe" };
    }
    if (normalizedAction.includes("order") && normalizedAction.includes("cancel")) {
        return { label: "Cancelled", icon: XCircle, color: "#ef4444", bg: "#fef2f2", border: "#fee2e2" };
    }
    if (normalizedAction.includes("order") && (normalizedAction.includes("view") || normalizedAction.includes("viewed"))) {
        return { label: "Order View", icon: Eye, color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" };
    }
    if (normalizedAction.includes("order") && normalizedAction.includes("status")) {
        return { label: "Status Changed", icon: ArrowRightLeft, color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" };
    }
    if (normalizedAction.includes("urgent")) {
        return { label: "Urgent Flagged", icon: AlertTriangle, color: "#ef4444", bg: "#fef2f2", border: "#fee2e2" };
    }
    if (normalizedAction.includes("gp_email") || (normalizedAction.includes("gp") && normalizedAction.includes("email"))) {
        return { label: "GP Email Sent", icon: Mail, color: "#ec4899", bg: "#fdf2f8", border: "#fce7f3" };
    }
    if (normalizedAction.includes("prescription_email") || (normalizedAction.includes("prescription") && normalizedAction.includes("email"))) {
        return { label: "Prescription Email", icon: Mail, color: "#8b5cf6", bg: "#f5f3ff", border: "#ede9fe" };
    }
    if (normalizedAction.includes("email") && normalizedAction.includes("skip")) {
        return { label: "Email Skipped", icon: RefreshCw, color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" };
    }
    if (normalizedAction.includes("reminder")) {
        return { label: "Reminder Sent", icon: Bell, color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" };
    }
    if (normalizedAction.includes("imported") || normalizedAction.includes("import")) {
        return { label: "Imported", icon: FileJson, color: "#8b5cf6", bg: "#f5f3ff", border: "#ede9fe" };
    }
    if (normalizedAction.includes("webhook")) {
        return { label: "Webhook", icon: Webhook, color: "#64748b", bg: "#f8fafc", border: "#f1f5f9" };
    }
    if (normalizedAction.includes("user") && normalizedAction.includes("create")) {
        return { label: "User Create", icon: UserPlus, color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" };
    }
    if (normalizedAction.includes("email")) {
        return { label: "Email Sent", icon: Mail, color: "#ec4899", bg: "#fdf2f8", border: "#fce7f3" };
    }
    if (normalizedAction.includes("review")) {
        return { label: "Review", icon: ClipboardEdit, color: "#06b6d4", bg: "#ecfeff", border: "#cffafe" };
    }
    if (normalizedAction.includes("status") || normalizedAction.includes("change")) {
        return { label: "Update", icon: ArrowRightLeft, color: "#003B73", bg: "#f1f5f9", border: "#e2e8f0" };
    }
    if (normalizedAction.includes("search")) {
        return { label: "Search", icon: Search, color: "#64748b", bg: "#f8fafc", border: "#f1f5f9" };
    }
    if (normalizedAction.includes("pdf") || normalizedAction.includes("document")) {
        return { label: "Document", icon: FileText, color: "#06b6d4", bg: "#ecfeff", border: "#cffafe" };
    }

    return { label: action || "Activity", icon: Activity, color: "#003B73", bg: "#f1f5f9", border: "#e2e8f0" };
};

export const getActionColor = (action?: string) => getActionConfig(action).color;
