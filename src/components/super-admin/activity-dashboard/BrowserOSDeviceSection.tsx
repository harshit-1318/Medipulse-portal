import { Globe, Monitor } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { BarList } from "./BarList";
import type { ActivityDashboard } from "@/api/services/super-admin/superAdminService";

interface BrowserOSDeviceSectionProps {
    data: ActivityDashboard | null;
    loading: boolean;
}

export function BrowserOSDeviceSection({ data, loading }: BrowserOSDeviceSectionProps) {
    const byBrowser = Array.isArray(data?.byBrowser) ? data.byBrowser : [];
    const byOS = Array.isArray(data?.byOS) ? data.byOS : [];
    const byDevice = Array.isArray(data?.byDevice) ? data.byDevice : [];

    const maxBrowser = Math.max(...(byBrowser.map((b) => b.count) ?? [1]), 1);
    const maxOS = Math.max(...(byOS.map((o) => o.count) ?? [1]), 1);
    const maxDevice = Math.max(...(byDevice.map((d) => d.count) ?? [1]), 1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SectionCard title="Browser" icon={<Globe size={16} />}>
                {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <BarList items={(data?.byBrowser ?? []).map((b) => ({ label: b.browser, count: b.count }))} max={maxBrowser} colorClass="bg-sky-500" emptyMessage="No browser data yet." />}
            </SectionCard>

            <SectionCard title="Operating System" icon={<Monitor size={16} />}>
                {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <BarList items={(data?.byOS ?? []).map((o) => ({ label: o.os, count: o.count }))} max={maxOS} colorClass="bg-violet-500" emptyMessage="No OS data yet." />}
            </SectionCard>

            <SectionCard title="Device Type" icon={<Monitor size={16} />}>
                {loading ? <p className="text-sm text-slate-400">Loading&hellip;</p> : <BarList items={(data?.byDevice ?? []).map((d) => ({ label: d.device.charAt(0).toUpperCase() + d.device.slice(1), count: d.count }))} max={maxDevice} colorClass="bg-teal-500" emptyMessage="No device data yet." />}
            </SectionCard>
        </div>
    );
}
