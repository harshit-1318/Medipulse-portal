import { useState, useCallback, useMemo, useEffect } from "react";
import { type ActivityLogType, getActivityLogs } from "@/api/services/log/logService";
import { useUrlSync } from '@/hooks';
import { getUrlParamInt, getInitialStateFromUrl, getDashboardStorageKey } from '@/utils/url';

const DEFAULT_FILTERS = { siteId: "", search: "", orderId: "", action: "", view: "", startDate: "", endDate: "", sortBy: "", sortDir: "desc" };

type UseActivityLogsOptions = {
    storageSuffix?: string;
    defaultFilters?: Partial<typeof DEFAULT_FILTERS>;
    syncToUrl?: boolean;
};

export function useActivityLogs(options: UseActivityLogsOptions = {}) {
    const {
        storageSuffix = "activity_logs",
        defaultFilters = {},
        syncToUrl = true,
    } = options;

    const storageKey = getDashboardStorageKey(storageSuffix);
    const mergedDefaultFilters = { ...DEFAULT_FILTERS, ...defaultFilters };
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    
    const initialState = getInitialStateFromUrl(mergedDefaultFilters, storageKey);
    const [filters, setFilters] = useState({
        siteId: initialState.siteId,
        search: initialState.search,
        orderId: initialState.orderId,
        action: initialState.action,
        view: initialState.view,
        startDate: initialState.startDate,
        endDate: initialState.endDate,
    });
    const [sortBy, setSortBy] = useState(initialState.sortBy);
    const [sortDir, setSortDir] = useState<"asc" | "desc">(initialState.sortDir as "asc" | "desc");

    const [logs, setLogs] = useState<ActivityLogType[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const syncState = useMemo(() => ({ ...filters, sortBy, sortDir }), [filters, sortBy, sortDir]);
    
    const handleUrlStateChange = useCallback((newState: any) => {
        if (newState.sortBy !== undefined) setSortBy(newState.sortBy);
        if (newState.sortDir !== undefined) setSortDir(newState.sortDir);
        
        const newFilters: any = {};
        Object.keys(filters).forEach(key => { 
            if (newState[key] !== undefined) newFilters[key] = newState[key]; 
        });
        if (Object.keys(newFilters).length > 0) setFilters((prev: any) => ({ ...prev, ...newFilters }));
    }, [filters]);

    useUrlSync(syncState, handleUrlStateChange, page, setPage, storageKey, mergedDefaultFilters, syncToUrl);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getActivityLogs(page, 20, { sortBy, sortDir, ...filters });
            setLogs(res.activityLogs);
            setTotal(res.total);
        } catch (error) { console.error("Error fetching logs:", error); }
        setLoading(false);
    }, [page, sortBy, sortDir, filters]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    return { page, setPage, sortBy, setSortBy, sortDir, setSortDir, filters, setFilters, logs, loading, total };
}
