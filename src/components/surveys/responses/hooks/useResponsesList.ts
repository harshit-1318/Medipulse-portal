import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSurveyResponses, getAllSurveyResponses } from '@/api/services/survey/surveyResponsesService';

interface UseResponsesListOptions {
    surveyId?: string; // if omitted, fetches all responses across surveys
}

export function useResponsesList({ surveyId }: UseResponsesListOptions = {}) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const fetcher = () => {
        const params = { page, limit: 20, search: search || undefined, from: from || undefined, to: to || undefined };
        return surveyId
            ? getSurveyResponses(surveyId, params)
            : getAllSurveyResponses(params);
    };

    const { data, isLoading: loading } = useQuery({
        queryKey: ['survey-responses', surveyId ?? 'all', page, search, from, to],
        queryFn: fetcher,
        placeholderData: prev => prev,
    });

    const applyFilters = (s: string, f: string, t: string) => {
        setSearch(s); setFrom(f); setTo(t); setPage(1);
    };

    return { data, loading, page, setPage, search, from, to, applyFilters };
}
