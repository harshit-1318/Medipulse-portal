import { useEffect, useState } from "react";
import { getUserActivitySummary } from "@/api/services/activity-log/service";
import type { UserActivitySummaryDay } from "@/api/services/activity-log/types";
import { Range, getDateRange, aggregateAcrossDays } from "./utils";

export function useUserActivitySummary(userEmail: string) {
    const [range, setRange] = useState<Range>("today");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [summary, setSummary] = useState<UserActivitySummaryDay[]>([]);
    const [uniqueOrdersViewed, setUniqueOrdersViewed] = useState(0);
    const [estimationModel, setEstimationModel] = useState({
        sessionGapMinutes: 30,
        minimumSessionMinutes: 5,
        dayBoundaryTimezone: "UTC",
        excludedActionsFromActiveHours: ["login_success", "login_failed"],
    });
    const [loading, setLoading] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showMethodology, setShowMethodology] = useState(false);

    const fetchSummary = async (r: Range, cs?: string, ce?: string) => {
        if (!userEmail) return;
        setLoading(true);
        const { startDate, endDate } = getDateRange(r, cs, ce);
        const res = await getUserActivitySummary(userEmail, startDate, endDate);
        setSummary(res.summary);
        setUniqueOrdersViewed(res.uniqueOrdersViewed);
        setEstimationModel(res.estimationModel);
        setLoading(false);
    };

    useEffect(() => {
        void fetchSummary(range);
    }, [userEmail]);

    const handleRangeChange = (r: Range) => {
        setRange(r);
        if (r !== "custom") void fetchSummary(r);
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) void fetchSummary("custom", customStart, customEnd);
    };

    const combined = aggregateAcrossDays(summary);
    const totalActions = Array.isArray(summary) ? summary.reduce((s, d) => s + (d?.total ?? 0), 0) : 0;
    const totalActiveMinutes = Array.isArray(summary) ? summary.reduce((s, d) => s + (d?.activeMinutes ?? 0), 0) : 0;
    const totalActiveHoursApprox = (totalActiveMinutes / 60).toFixed(2);

    return {
        range,
        customStart,
        setCustomStart,
        customEnd,
        setCustomEnd,
        summary,
        uniqueOrdersViewed,
        estimationModel,
        loading,
        showBreakdown,
        setShowBreakdown,
        showMethodology,
        setShowMethodology,
        handleRangeChange,
        handleCustomApply,
        combined,
        totalActions,
        totalActiveHoursApprox,
    };
}
