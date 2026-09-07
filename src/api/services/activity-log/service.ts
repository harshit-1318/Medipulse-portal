import apiClient from "../../apiClient";
import type { ActivityFilterParams, ActivityLogsResponse } from "./types";
import { mapToActivityLog, mapToActivityLogBySite } from "./mappers";
import { buildActivityLogParams } from "./params";
import { getUserActivitySummary } from "./userSummary";

export { getUserActivitySummary };

export const getActivityLogs = async (
    page: number = 1,
    limit: number = 20,
    filters: ActivityFilterParams = {},
): Promise<ActivityLogsResponse> => {
    try {
        const params = buildActivityLogParams(page, limit, filters);
        const url = "/activity-log/list/filters";

        const response: any = await apiClient.get({
            url,
            method: "GET",
            params,
        });

        const data = response?.data ?? response ?? {};
        const list: any[] = data.logs ?? (Array.isArray(data) ? data : []);
        const total = Number(data.total || list.length);

        const activityLogs = list.map(mapToActivityLog);

        return {
            activityLogs,
            total,
            page,
            limit,
        };
    } catch (error) {
        console.error("❌ [getActivityLogs] Error:", error);
        return {
            activityLogs: [],
            total: 0,
            page,
            limit,
        };
    }
};

export const getActivityLogsBySite = async (
    siteId: string,
    page: number = 1,
    limit: number = 20,
    search: string = "",
): Promise<ActivityLogsResponse> => {
    try {
        const response: any = await apiClient.get({
            url: `/activity-log/${siteId}`,
            method: "GET",
            params: { page, limit, search },
        });

        const rawLogs = Array.isArray(response) ? response : [];
        const activityLogs = rawLogs.map(mapToActivityLogBySite);

        return {
            activityLogs,
            total: activityLogs.length,
            page,
            limit,
        };
    } catch (err) {
        console.error("❌ [getActivityLogsBySite] Error:", err);
        return {
            activityLogs: [],
            total: 0,
            page,
            limit,
        };
    }
};

export interface LogActivityPayload {
    action_type: string;
    view: string;
    object_guid: string;
    user_email?: string;
    user_name?: string;
    details?: string;
}

export const logActivity = async (payload: LogActivityPayload): Promise<void> => {
    try {
        await apiClient.post("/activity-log", payload);
    } catch (err) {
        console.error("❌ [logActivity] Error:", err);
    }
};
