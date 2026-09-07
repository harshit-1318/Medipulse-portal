export interface SuperAdminStats {
    totalSites: number;
    activeSites: number;
    totalUsers: number;
    totalActivities: number;
}

export interface SiteDetail {
    id: string;
    name: string;
    key: string;
    primaryDomain: string;
    status: "active" | "inactive";
    logo?: string;
    small_icon_url?: string;
    companyName?: string;
    shop?: string;
    createdAt?: string;
    totalOrders?: number;
    totalCustomers?: number;
    totalActivities?: number;
    product_ids?: string;
}

export interface DashboardStatsResponse {
    site: any;
    stats: {
        users: number;
        orders: number;
        activities: number;
        customers?: number;
    };
    recentOrders: any[];
    recentActivities: any[];
}
