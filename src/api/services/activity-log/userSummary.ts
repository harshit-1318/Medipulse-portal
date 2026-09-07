import apiClient from "../../apiClient";
import type { UserActivitySummaryResponse } from "./types";

export const getUserActivitySummary = async (
    userEmail: string,
    startDate?: string,
    endDate?: string,
): Promise<UserActivitySummaryResponse> => {
    try {
        const params: Record<string, string> = { userEmail };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        params.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

        const response: any = await apiClient.get({
            url: "/activity-log/user-summary",
            method: "GET",
            params,
        });

        const data = response?.data ?? response ?? {};
        const estimationModel = data.estimationModel ?? {};
        return {
            userEmail: String(data.userEmail ?? userEmail),
            uniqueOrdersViewed: Number(data.uniqueOrdersViewed ?? 0),
            summary: Array.isArray(data.summary) ? data.summary : [],
            estimationModel: {
                sessionGapMinutes: Number(estimationModel.sessionGapMinutes ?? 30),
                minimumSessionMinutes: Number(estimationModel.minimumSessionMinutes ?? 5),
                dayBoundaryTimezone: String(estimationModel.dayBoundaryTimezone ?? "UTC"),
                excludedActionsFromActiveHours: Array.isArray(estimationModel.excludedActionsFromActiveHours)
                    ? estimationModel.excludedActionsFromActiveHours.map(String)
                    : ["login_success", "login_failed"],
            },
        };
    } catch (err) {
        console.error("❌ [getUserActivitySummary] Error:", err);
        return {
            userEmail,
            uniqueOrdersViewed: 0,
            summary: [],
            estimationModel: {
                sessionGapMinutes: 30,
                minimumSessionMinutes: 5,
                dayBoundaryTimezone: "UTC",
                excludedActionsFromActiveHours: ["login_success", "login_failed"],
            },
        };
    }
};
