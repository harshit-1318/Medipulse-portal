import type { ActivityLogType } from "./types";

export const mapToActivityLog = (log: any): ActivityLogType => {
    const email = log.user_email || log.userEmail || "";
    const nameFromEmail = email ? email.split("@")[0] : "System";
    const rawName = log.userName || log.user_name || "";
    const userName = rawName && rawName !== "System" ? rawName : nameFromEmail;

    return {
        id: log._id || log.id,
        action: log.action_type || log.action,
        page: log.view || log.page,
        userName,
        userEmail: email || "-",
        orderId: log.orderId || String(log.object_guid ?? "") || "-",
        target: log.target_guid || log.target || log.view || log.page,
        details: log.details || "",
        createdAt: log.createdAt,
        role: log.role || log.user_role || log.userRole || "",
        count: typeof log.count === "number" ? log.count : 1,
    };
};

export const mapToActivityLogBySite = (log: any): ActivityLogType => {
    const email = log.user_email ?? "";
    const userName = log.user_name?.trim() || (email ? email.split("@")[0] : "System");
    return {
        id: log._id,
        action: log.action_type,
        page: log.view,
        userName,
        userEmail: email || "-",
        orderId: String(log.object_guid ?? "") || "-",
        target: log.target_guid ?? log.view,
        details: log.details ?? log.action_type ?? "",
        createdAt: log.createdAt,
        role: log.role || log.user_role || log.userRole || "",
        count: typeof log.count === "number" ? log.count : 1,
    };
};
