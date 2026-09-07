import apiClient from "@/api/apiClient";

export interface DashboardStats {
    totalOrders: number;
    onHoldOrders: number;
    prescriptionsUploaded: number;
    urgentOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<DashboardStats>("/orders/dashboard-stats");
    return res;
}
