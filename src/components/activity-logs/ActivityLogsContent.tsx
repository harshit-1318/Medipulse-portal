import { useState } from "react";
import ActivityTable from "./ActivityTable";
import { LazyMotion, domAnimation } from "framer-motion";
import { useScrollPreservation } from '@/hooks';
import { useActivityLogs, useActivityLogSites } from "./hooks";
import { useUserInfo } from '@/store';

type ActivityLogsContentProps = {
    title?: string;
    storageSuffix?: string;
    defaultAction?: string;
    enableOrderSubgrouping?: boolean;
};

export default function ActivityLogsContent({
    title = "Activity Logs",
    storageSuffix = "activity_logs",
    defaultAction = "",
    enableOrderSubgrouping = true,
}: ActivityLogsContentProps) {
    const user = useUserInfo();
    const isSuperAdmin = user?.effectiveRole === "super_admin" || user?.is_super_admin === true;
    const { page, setPage, sortBy, setSortBy, sortDir, setSortDir, filters, setFilters, logs, loading, total } = useActivityLogs({
        storageSuffix,
        defaultFilters: defaultAction ? { action: defaultAction } : {},
    });
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const { normalizedSiteOptions } = useActivityLogSites(Boolean(isSuperAdmin));
    const containerRef = useScrollPreservation("activity-logs", loading);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            if (sortDir === "asc") setSortDir("desc");
            else { setSortBy(""); setSortDir("desc"); }
        } else { setSortBy(column); setSortDir("asc"); }
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">{title}</h1>
                    </div>
                </div>

                <div ref={containerRef} className="w-full">
                    <ActivityTable
                        logs={logs} 
                        loading={loading} 
                        page={page} 
                        setPage={setPage} 
                        total={total}
                        sortBy={sortBy} 
                        sortDir={sortDir} 
                        onSort={handleSort}
                        title="System Activity Logs" 
                        filters={filters} 
                        setFilters={setFilters}
                        filtersEnabled={filtersEnabled} 
                        setFiltersEnabled={setFiltersEnabled}
                        enableOrderSubgrouping={enableOrderSubgrouping}
                        siteOptions={normalizedSiteOptions}
                    />
                </div>
            </div>
        </LazyMotion>
    );
}

