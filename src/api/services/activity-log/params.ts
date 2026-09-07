import type { ActivityFilterParams } from "./types";

export const sortMapping: Record<string, string> = {
    action_type: "action_type",
    user_email: "user_email",
    subject_guid: "object_guid",
    object_guid: "object_guid",
    view: "view",
    page: "view",
    target: "target",
    details: "target",
    createdAt: "createdAt",
};

export const buildActivityLogParams = (
    page: number,
    limit: number,
    filters: ActivityFilterParams
) => {
    const params: any = {
        page,
        limit,
        sort: filters.sortDir || "desc",
    };

    if (filters.siteId) {
        params.siteId = filters.siteId;
        params.site_guid = filters.siteId;
    }

    if (filters.sortBy) {
        params.sortBy = sortMapping[filters.sortBy] || filters.sortBy;
        params.sort = filters.sortDir || "desc";
    }

    if (filters.search) params.search = filters.search;
    if (filters.orderId) {
        params.orderId = filters.orderId;
        params.subject_guid = filters.orderId;
        params.target_guid = filters.orderId;
    }
    if (filters.action) {
        params.action = filters.action;
        params.action_type = filters.action;
    }
    if (filters.view) {
        params.pageName = filters.view;
        params.view = filters.view;
        params.page_name = filters.view;
    }

    if (filters.startDate) {
        params.startDate = filters.startDate;
        params.start_date = filters.startDate;
    }
    if (filters.endDate) {
        params.endDate = filters.endDate;
        params.end_date = filters.endDate;
    }

    // Always request grouped results (merges same action+order+user within same day)
    params.group = 'true';

    return params;
};

export const hasAnyFilters = (filters: ActivityFilterParams) => {
    return !!(
        filters.siteId ||
        filters.search ||
        filters.orderId ||
        filters.action ||
        filters.view ||
        filters.startDate ||
        filters.endDate
    );
};
