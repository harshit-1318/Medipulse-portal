import { useState, useCallback, useEffect } from "react";
import { getActivityLogs } from "@/api/services/log/logService";
import { getDashboardStats, getSiteDetail, type SiteDetail } from "@/api/services/super-admin/superAdminService";

export function useSiteDetail(siteId: string) {
    const [site, setSite] = useState<SiteDetail | null>(null);
    const [loadingSite, setLoadingSite] = useState(true);
    const [dashboardStats, setDashboardStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchData = useCallback(async () => {
        if (!siteId) return;
        setLoadingSite(true);
        setLoadingStats(true);
        try {
            const [siteResult, statsResult] = await Promise.all([
                getSiteDetail(siteId),
                getDashboardStats(siteId)
            ]);
            setSite(siteResult);
            setDashboardStats(statsResult);
        } catch (err) {
            console.error("Error fetching site details:", err);
        } finally {
            setLoadingSite(false);
            setLoadingStats(false);
        }
    }, [siteId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { site, loadingSite, dashboardStats, loadingStats, fetchData };
}

export function useSiteLogs(siteId: string, page: number, filters: any, sortBy: string, sortDir: string) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [total, setTotal] = useState(0);

    const fetchLogs = useCallback(async () => {
        if (!siteId) return;
        setLoadingLogs(true);
        try {
            const res = await getActivityLogs(page, 20, {
                siteId, sortBy, sortDir, ...filters
            });
            setLogs(res.activityLogs);
            setTotal(res.total);
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoadingLogs(false);
        }
    }, [page, sortBy, sortDir, filters, siteId]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, loadingLogs, total, fetchLogs };
}
