import apiClient from "@/api/apiClient";

export interface ActivityDashboardTotals {
    events: number;
    uniqueStaff: number;
    userEvents: number;
    systemEvents: number;
    legacyEvents: number;
    failedLogins: number;
    commActionsSent: number;
}

export interface ActivityDashboard {
    period: { days: number; from: string; to: string };
    totals: ActivityDashboardTotals;
    byDay: Array<{ date: string; count: number }>;
    byActionType: Array<{ action: string; count: number }>;
    bySource: Array<{ source: string; count: number }>;
    byHour: Array<{ hour: number; count: number }>;
    bySite: Array<{ siteName: string; count: number }>;
    commActions: Array<{ action: string; count: number }>;
    byBrowser: Array<{ browser: string; count: number }>;
    byOS: Array<{ os: string; count: number }>;
    byDevice: Array<{ device: string; count: number }>;
    topUsers: Array<{ email: string; count: number }>;
    recentLogins: Array<{ email: string; ip: string | null; browser: string | null; os: string | null; createdAt: string }>;
    recentFailedLogins: Array<{ email: string; ip: string | null; createdAt: string }>;
}

const EMPTY_DASHBOARD: ActivityDashboard = {
    period: { days: 30, from: "", to: "" },
    totals: { events: 0, uniqueStaff: 0, userEvents: 0, systemEvents: 0, legacyEvents: 0, failedLogins: 0, commActionsSent: 0 },
    byDay: [],
    byActionType: [],
    bySource: [],
    byHour: [],
    bySite: [],
    commActions: [],
    byBrowser: [],
    byOS: [],
    byDevice: [],
    topUsers: [],
    recentLogins: [],
    recentFailedLogins: [],
};

export async function getActivityDashboard(days = 30): Promise<ActivityDashboard> {
    try {
        const res: any = await apiClient.get(`/super-admin/activity-dashboard?days=${days}`);
        return (res as ActivityDashboard) ?? EMPTY_DASHBOARD;
    } catch (err) {
        console.error("❌ [getActivityDashboard] Error:", err);
        return EMPTY_DASHBOARD;
    }
}
