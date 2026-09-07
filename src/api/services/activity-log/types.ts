export interface ActivityLogType {
    id: string;
    action: string;
    page: string;
    userName: string;
    userEmail: string;
    orderId: string;
    target: string;
    details: string;
    createdAt: string;
    count?: number; // number of grouped occurrences (1 = not grouped)
}

export interface ActivityLogsResponse {
    activityLogs: ActivityLogType[];
    total: number;
    page: number;
    limit: number;
}

export interface ActivityFilterParams {
    siteId?: string;
    search?: string;
    sortBy?: string;
    sortDir?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
    action?: string;
    orderId?: string;
    view?: string;
}

export interface UserActivitySummaryDay {
    date: string;
    total: number;
    actions: Record<string, number>;
    activeMinutes: number;
    activeHoursApprox: number;
    sessionCount: number;
    firstActivityAt: string | null;
    lastActivityAt: string | null;
}

export interface UserActivitySummaryResponse {
    userEmail: string;
    uniqueOrdersViewed: number;
    summary: UserActivitySummaryDay[];
    estimationModel: {
        sessionGapMinutes: number;
        minimumSessionMinutes: number;
        dayBoundaryTimezone: string;
        excludedActionsFromActiveHours: string[];
    };
}

