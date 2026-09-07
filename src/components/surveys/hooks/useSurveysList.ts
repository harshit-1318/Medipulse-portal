import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';
import { getSurveys, getSurveyStats } from '@/api/services/survey/surveyService';
import type { SurveyFilters } from '@/types/survey';
import { useSurveyFilters } from './useSurveyFilters';

export function useSurveysList() {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const [filters, setFilters] = useState<SurveyFilters>({
        search: '',
        status: '',
        sortBy: 'createdAt',
        sort: 'desc',
    });

    const filterHelpers = useSurveyFilters({ filters, setFilters, setPage, setFiltersEnabled });

    const { data, isLoading: loading } = useQuery({
        queryKey: ['surveys', page, filters],
        queryFn: () => getSurveys({ ...filters, page, limit: 20 }),
        placeholderData: prev => prev,
    });

    const { data: stats } = useQuery({
        queryKey: ['surveys-stats'],
        queryFn: getSurveyStats,
        staleTime: 30_000,
    });

    return {
        data, loading, stats,
        page, setPage,
        sorting, setSorting,
        filtersEnabled, setFiltersEnabled,
        filters, setFilters,
        ...filterHelpers,
    };
}
