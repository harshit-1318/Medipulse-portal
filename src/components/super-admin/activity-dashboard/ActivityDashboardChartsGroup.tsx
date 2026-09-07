import { Cpu, MessageSquare, Building2, Clock } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { BarList } from "./BarList";
import { HourlyChart } from "./Charts";
import { SourceBreakdown } from "./SourceBreakdown";
import { formatActionLabel, COMM_ACTION_LABELS } from "./utils";
import type { ActivityDashboard } from "@/api/services/super-admin/superAdminService";

interface ActivityDashboardChartsGroupProps {
    data: ActivityDashboard | null;
    loading: boolean;
    totals: {
        events: number;
        legacyEvents: number;
        commActionsSent: number;
    };
    maxComm: number;
    maxSite: number;
}

export function ActivityDashboardChartsGroup({
    data,
    loading,
    totals,
    maxComm,
    maxSite,
}: ActivityDashboardChartsGroupProps) {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Activity by Hour of Day (UTC)" icon={<Clock size={16} />}>
                    {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <HourlyChart byHour={data?.byHour ?? []} />}
                </SectionCard>

                <SectionCard title="Event Source Breakdown" icon={<Cpu size={16} />}>
                    {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <SourceBreakdown bySource={data?.bySource ?? []} legacyEvents={totals.legacyEvents} total={totals.events} />}
                </SectionCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Communication Actions Sent" icon={<MessageSquare size={16} />} badge={totals.commActionsSent}>
                    {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : (data?.commActions ?? []).length === 0 ? <p className="text-sm text-slate-400 italic">No prescriber communication actions logged yet.</p> : <BarList items={(data?.commActions ?? []).map((c) => ({ label: COMM_ACTION_LABELS[c.action] ?? formatActionLabel(c.action), count: c.count }))} max={maxComm} colorClass="bg-emerald-500" />}
                </SectionCard>

                <SectionCard title="Activity by Site" icon={<Building2 size={16} />}>
                    {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <BarList items={(data?.bySite ?? []).map((s) => ({ label: s.siteName, count: s.count }))} max={maxSite} colorClass="bg-sky-500" emptyMessage="No site data available." />}
                </SectionCard>
            </div>
        </>
    );
}
