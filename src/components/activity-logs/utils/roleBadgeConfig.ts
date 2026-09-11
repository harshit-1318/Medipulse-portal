export interface RoleBadgeStyle {
    label: string;
    color: string;
    bg: string;
    border: string;
}

export const getRoleBadgeConfig = (role?: string): RoleBadgeStyle => {
    const normalized = (role || "").toLowerCase().trim().replace(/\s+/g, "_");

    if (normalized === "super_admin" || normalized === "superadmin") {
        return { label: "Super Admin", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" };
    }
    if (normalized === "admin") {
        return { label: "Admin", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" };
    }
    if (normalized === "prescriber") {
        return { label: "Prescriber", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" };
    }
    if (normalized === "pharmacist") {
        return { label: "Pharmacist", color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
    }
    if (normalized === "customer_support" || normalized === "support") {
        return { label: "Support", color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" };
    }

    if (role && role.trim()) {
        const formatted = role
            .replace(/_/g, " ")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        return { label: formatted, color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
    }

    return { label: "Staff", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
};
