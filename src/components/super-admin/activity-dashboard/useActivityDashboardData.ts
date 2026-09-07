import { useEffect, useState } from "react";
import {
    getActivityDashboard,
    type ActivityDashboard,
} from "@/api/services/super-admin/superAdminService";

export function useActivityDashboardData() {
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ActivityDashboard | null>(null);

    const load = async (d: number) => {
        setLoading(true);
        try {
            const res = await getActivityDashboard(d);
            setData(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load(days);
    }, [days]);

    const totals = data?.totals ?? {
        events: 0,
        uniqueStaff: 0,
        userEvents: 0,
        systemEvents: 0,
        legacyEvents: 0,
        failedLogins: 0,
        commActionsSent: 0,
    };

    const byActionType = Array.isArray(data?.byActionType) ? data.byActionType : [];
    const topUsers = Array.isArray(data?.topUsers) ? data.topUsers : [];
    const bySite = Array.isArray(data?.bySite) ? data.bySite : [];
    const commActions = Array.isArray(data?.commActions) ? data.commActions : [];

    const maxAction = Math.max(...(byActionType.map((a) => a.count) ?? [1]), 1);
    const maxUser = Math.max(...(topUsers.map((u) => u.count) ?? [1]), 1);
    const maxSite = Math.max(...(bySite.map((s) => s.count) ?? [1]), 1);
    const maxComm = Math.max(...(commActions.map((c) => c.count) ?? [1]), 1);

    return {
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
    };
}
