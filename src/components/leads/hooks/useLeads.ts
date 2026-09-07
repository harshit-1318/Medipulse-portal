import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeads, getLeadStats } from '@/api/services/lead/leadService';
import type { LeadFilters, LeadStatus } from '@/types/lead';

export function useLeads() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<LeadFilters>({
        status: '',
        search: '',
        sortBy: 'createdAt',
        sort: 'desc',
    });

    const { data, isLoading: loading } = useQuery({
        queryKey: ['leads', page, filters],
        queryFn: () => getLeads({ ...filters, page, limit: 20 }),
        placeholderData: prev => prev,
    });

    const { data: stats } = useQuery({
        queryKey: ['lead-stats'],
        queryFn: getLeadStats,
        staleTime: 30_000,
    });

    const setStatusFilter = (status: LeadStatus | '') => {
        setFilters(prev => ({ ...prev, status }));
        setPage(1);
    };

    const setSearch = (search: string) => {
        setFilters(prev => ({ ...prev, search }));
        setPage(1);
    };

    return { data, loading, stats, page, setPage, filters, setStatusFilter, setSearch };
}
