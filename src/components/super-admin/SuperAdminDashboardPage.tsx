import { useEffect, useState } from "react";
import { Building2, Users, Activity, CheckCircle2 } from "lucide-react";
import { QueryProvider } from "@/components/common/QueryProvider";
import { getSuperAdminStats, type SuperAdminStats } from "@/api/services/super-admin/superAdminService";
import { getSites } from "@/api/services/site/siteService";
import type { Site } from "@/types/site";
import ActivityDashboardSection from "./ActivityDashboardSection";
import { SitesOverviewTable } from "./dashboard/SitesOverviewTable";
import { StatCard } from "./dashboard/SuperAdminStatCard";

function SuperAdminDashboardContent() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SuperAdminStats>({
        totalSites: 0,
        activeSites: 0,
        totalUsers: 0,
        totalActivities: 0,
    });
    const [sites, setSites] = useState<Site[]>([]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const [statsRes, sitesRes] = await Promise.all([
                    getSuperAdminStats(),
                    getSites(1, ""),
                ]);

                if (!mounted) return;
                setStats(statsRes);
                setSites(sitesRes.sites || []);
            } catch {
                if (!mounted) return;
                setStats({
                    totalSites: 0,
                    activeSites: 0,
                    totalUsers: 0,
                    totalActivities: 0,
                });
                setSites([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void load();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="space-y-6 font-montserrat pb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Super Admin Dashboard</h1>
                    <p className="text-sm text-slate-500">Platform-level overview and site administration.</p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="/users"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
                    >
                        Manage Users
                    </a>
                    <a
                        href="/sites"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#00A294] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#008F83] transition-colors"
                    >
                        Manage Sites
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Sites"
                    value={stats.totalSites}
                    icon={<Building2 size={18} />}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    subtext="Configured domains"
                />
                <StatCard
                    title="Active Sites"
                    value={stats.activeSites}
                    icon={<CheckCircle2 size={18} />}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    subtext="Healthy & live"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users size={18} />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    subtext="Platform accounts"
                />
                <StatCard
                    title="Total Activities"
                    value={stats.totalActivities}
                    icon={<Activity size={18} />}
                    iconBg="bg-teal-50"
                    iconColor="text-[#00A294]"
                    subtext="System audits"
                />
            </div>

            <SitesOverviewTable sites={sites} loading={loading} />

            <ActivityDashboardSection />
        </div>
    );
}

export default function SuperAdminDashboardPage() {
    return (
        <QueryProvider>
            <SuperAdminDashboardContent />
        </QueryProvider>
    );
}

