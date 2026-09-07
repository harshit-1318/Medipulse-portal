import { useState } from "react";
import { ActivityTable } from "@/components/activity-logs";
import { QueryProvider } from "@/components/common/QueryProvider";
import { useSiteDetail, useSiteLogs } from "./hooks/useSiteDetail";
import { SiteDetailHeader } from "./components/SiteDetailHeader";
import { SiteStatsSidebar } from "./components/SiteStatsSidebar";
import { SiteInfoPanel } from "./components/SiteInfoPanel";

function SiteDetailContent({ siteId }: { siteId: string }) {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<string>("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const [filters, setFilters] = useState({ search: "", orderId: "", action: "", view: "", startDate: "", endDate: "" });

    const { site, loadingSite, dashboardStats, loadingStats } = useSiteDetail(siteId);
    const { logs, loadingLogs, total } = useSiteLogs(siteId, page, filters, sortBy, sortDir);

    const handleSort = (column: string) => {
        if (sortBy === column) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else { setSortBy(column); setSortDir("asc"); }
        setPage(1);
    };

    return (
        <div className="space-y-6 font-montserrat animate-in fade-in duration-500 pb-12">
            <SiteDetailHeader siteId={siteId} />

            {/* Primary Grid Row: Info Panel and Stats Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8">
                    <SiteInfoPanel site={site} loadingSite={loadingSite} />
                </div>
                <div className="lg:col-span-4">
                    <SiteStatsSidebar dashboardStats={dashboardStats} loadingStats={loadingStats} />
                </div>
            </div>

            {/* Secondary Row: Activity Table */}
            <div className="mt-2">
                <ActivityTable
                    logs={logs} loading={loadingLogs} page={page} setPage={setPage} total={total}
                    sortBy={sortBy} sortDir={sortDir} onSort={handleSort}
                    filters={filters} setFilters={setFilters} filtersEnabled={filtersEnabled} setFiltersEnabled={setFiltersEnabled}
                    title="Activity Logs"
                />
            </div>
        </div>
    );
}

export default function SiteDetailPage(props: { siteId: string }) {
    return (
        <QueryProvider>
            <SiteDetailContent {...props} />
        </QueryProvider>
    );
}
