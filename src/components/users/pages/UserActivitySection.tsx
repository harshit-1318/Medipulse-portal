import { useState } from "react";
import ActivityTable from "@/components/activity-logs/ActivityTable";
import UserActivitySummary from "@/components/users/components/UserActivitySummary";
import { useActivityLogs } from "@/components/activity-logs/hooks/useActivityLogs";

interface UserActivitySectionProps {
    userId: string;
    userEmail: string;
}

export function UserActivitySection({ userId, userEmail }: UserActivitySectionProps) {
    const [filtersEnabled, setFiltersEnabled] = useState(false);

    const {
        page,
        setPage,
        sortBy,
        setSortBy,
        sortDir,
        setSortDir,
        filters,
        setFilters,
        logs,
        loading,
        total,
    } = useActivityLogs({
        storageSuffix: `user_activity_${userId}`,
        syncToUrl: false,
        defaultFilters: { search: userEmail },
    });

    const onSort = (column: string) => {
        if (sortBy === column) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDir("asc");
        }
        setPage(1);
    };

    return (
        <>
            <UserActivitySummary userEmail={userEmail} />

            <ActivityTable
                logs={logs}
                loading={loading}
                page={page}
                setPage={setPage}
                total={total}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                title="User Activities"
                filters={filters}
                setFilters={setFilters}
                filtersEnabled={filtersEnabled}
                setFiltersEnabled={setFiltersEnabled}
            />
        </>
    );
}
