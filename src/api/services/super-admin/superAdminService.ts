import apiClient from "@/api/apiClient";
import { getActivityDashboard, type ActivityDashboard, type ActivityDashboardTotals } from "./superAdminActivityService";
import type { SuperAdminStats, SiteDetail, DashboardStatsResponse } from "./superAdminTypes";

export type { ActivityDashboard, ActivityDashboardTotals };
export * from "./superAdminTypes";
export { getActivityDashboard };

export async function getSuperAdminStats(): Promise<SuperAdminStats> {
    try {
        return await apiClient.get<SuperAdminStats>("/super-admin/dashboard-stats");
    } catch (error) {
        console.error("Failed to fetch super admin stats:", error);
        return {
            totalSites: 0,
            activeSites: 0,
            totalUsers: 0,
            totalActivities: 0,
        };
    }
}

export async function getSiteDetail(siteId: string): Promise<SiteDetail | null> {
    if (!siteId) return null;

    try {
        const res: any = await apiClient.get(`/sites/${siteId}`);
        const raw = res?.site ?? res ?? {};

        return {
            id: raw._id ?? raw.id ?? "",
            name: raw.site_name ?? raw.name ?? "",
            key: raw.site_key ?? raw.key ?? "",
            primaryDomain: raw.primary_domain ?? raw.url ?? "",
            status: raw.is_active ? "active" : "inactive",
            logo: raw.settings?.branding?.logo ?? raw.logo ?? raw.brandLogo ?? "",
            small_icon_url: raw.settings?.branding?.small_icon_url ?? raw.small_icon_url ?? "",
            companyName: raw.settings?.branding?.company_name ?? raw.companyName ?? "",
            shop: raw.shopify_config?.shop ?? raw.shop ?? "",
            createdAt: raw.createdAt ?? raw.updatedAt ?? "",
            totalOrders: raw.totalOrders ?? raw.metadata?.totalOrders ?? 0,
            totalCustomers: raw.totalUsers ?? raw.metadata?.totalUsers ?? 0,
            totalActivities: raw.totalActivities ?? raw.metadata?.totalActivities ?? 0,
            product_ids: raw.allowed_product_filter?.product_ids?.join(",") ?? "",
        };
    } catch (error) {
        console.error("Failed to fetch site detail:", error);
        return null;
    }
}

export const getDashboardStats = async (siteId: string): Promise<DashboardStatsResponse> => {
    return apiClient.get<DashboardStatsResponse>(`/sites/dashboard-stats/${siteId}`);
};

export async function updateSiteProductFilter(siteId: string, productIds: string): Promise<any> {
    const idsArray = productIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .map((id) => (Number.isNaN(Number(id)) ? id : Number(id)));

    return apiClient.patch(`/sites/${siteId}/product-filter`, { product_ids: idsArray });
}

export default {
    getSuperAdminStats,
    getSiteDetail,
    getDashboardStats,
    updateSiteProductFilter,
    getActivityDashboard,
};
