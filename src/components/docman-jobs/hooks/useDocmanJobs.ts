import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { docmanJobsService } from '../services/docmanJobsService';
import type { DocmanJobType } from '../types';
import { useUrlSync } from '@/hooks';
import { getInitialStateFromUrl, getUrlParamInt, getDashboardStorageKey } from '@/utils/url';
import { useDocmanJobActions } from './useDocmanJobActions';

const DEFAULT_FILTERS = {
    search: '',
    statusFilter: 'all',
};

export function useDocmanJobs() {
    const storageKey = getDashboardStorageKey("docman_jobs");
    const [page, setPage] = useState(() => getUrlParamInt("page", 1, storageKey));
    
    const initialFilters = getInitialStateFromUrl(DEFAULT_FILTERS, storageKey);
    const [search, setSearch] = useState(initialFilters.search);
    const [statusFilter, setStatusFilter] = useState(initialFilters.statusFilter);

    const filters = useMemo(() => ({ search, statusFilter }), [search, statusFilter]);
    const setFilters = useCallback((newFilters: typeof DEFAULT_FILTERS) => {
        if (newFilters.search !== undefined) setSearch(newFilters.search);
        if (newFilters.statusFilter !== undefined) setStatusFilter(newFilters.statusFilter);
    }, []);

    const [jobs, setJobs] = useState<DocmanJobType[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [limit] = useState(20);

    /* -------------------- URL Sync -------------------- */
    useUrlSync(filters, setFilters, page, setPage, storageKey, DEFAULT_FILTERS);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await docmanJobsService.getJobs({
                page,
                limit,
                search: search || undefined,
                status: statusFilter === 'all' ? undefined : statusFilter,
            });

            setJobs(res.jobs);
            setTotal(res.total);
        } catch (err) {
            console.error("❌ Error fetching docman jobs:", err);
            toast.error("Failed to load jobs.");
            setJobs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, statusFilter]);

    const { handleDelete, handleRetry } = useDocmanJobActions(fetchJobs);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const activeFilterCount = (search ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setPage(1);
    };

    return {
        jobs,
        loading,
        total,
        page,
        setPage,
        limit,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        activeFilterCount,
        clearFilters,
        handleDelete,
        handleRetry,
        refresh: fetchJobs,
    };
}

