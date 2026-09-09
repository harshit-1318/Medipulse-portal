import {
    Activity,
    TrendingUp,
    LogIn,
    AlertTriangle,
    Users,
} from "lucide-react";
import { SectionCard } from "./activity-dashboard/SectionCard";
import { BarList } from "./activity-dashboard/BarList";
import { DailySparkline } from "./activity-dashboard/Charts";
import { SuccessfulLoginsTable, FailedLoginsTable } from "./activity-dashboard/LogTables";
import { formatActionLabel } from "./activity-dashboard/utils";
import { ActivityDashboardHeader } from "./activity-dashboard/ActivityDashboardHeader";
import { ActivityDashboardTiles } from "./activity-dashboard/ActivityDashboardTiles";
import { ActivityDashboardChartsGroup } from "./activity-dashboard/ActivityDashboardChartsGroup";
import { BrowserOSDeviceSection } from "./activity-dashboard/BrowserOSDeviceSection";
import { useActivityDashboardData } from "./activity-dashboard/useActivityDashboardData";

export default function ActivityDashboardSection() {
    const {
        days,
        setDays,
        loading,
        data,
        load,
        totals,
        maxAction,
        maxUser,
        maxSite,
        maxComm,
    } = useActivityDashboardData();

    return (
        <div className="space-y-5">
            <ActivityDashboardHeader
                days={days}
                setDays={setDays}
                loading={loading}
                load={load}
                data={data}
            />

            <ActivityDashboardTiles days={days} totals={totals} />

            <SectionCard title={`Events per Day (last ${days} days)`} icon={<TrendingUp size={16} />}>
                {loading ? (
                    <div className="h-24 flex items-center justify-center text-slate-400 text-sm">Loading&hellip;</div>
                ) : (
                    <>
                        <DailySparkline byDay={data?.byDay ?? []} days={days} />
                        <p className="text-xs text-slate-400 mt-2">Hover a bar to see the count. Each bar = 1 day.</p>
                    </>
                )}
            </SectionCard>

            <ActivityDashboardChartsGroup
                data={data}
                loading={loading}
                totals={totals}
                maxComm={maxComm}
                maxSite={maxSite}
            />

            <SectionCard title="Top Action Types" icon={<Activity size={16} />}>
                {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <BarList items={(data?.byActionType ?? []).map((a) => ({ label: formatActionLabel(a.action), count: a.count }))} max={maxAction} colorClass="bg-[#00A294]" />}
            </SectionCard>

            <BrowserOSDeviceSection data={data} loading={loading} />

            <SectionCard title={`Most Active Staff (last ${days} days)`} icon={<Users size={16} />}>
                {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : (data?.topUsers ?? []).length === 0 ? <p className="text-sm text-slate-400 italic">No staff activity recorded in this period.</p> : <BarList items={(data?.topUsers ?? []).map((u) => ({ label: u.email, count: u.count }))} max={maxUser} colorClass="bg-amber-500" />}
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Recent Successful Logins" icon={<LogIn size={16} />}>
                    {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <SuccessfulLoginsTable logins={data?.recentLogins ?? []} />}
                </SectionCard>

                <SectionCard title="Recent Failed Logins" icon={<AlertTriangle size={16} className="text-red-500" />} badge={totals.failedLogins > 0 ? `${totals.failedLogins} in ${days}d` : undefined}>
                    {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <FailedLoginsTable logins={data?.recentFailedLogins ?? []} />}
                </SectionCard>
            </div>
        </div>
    );
}

