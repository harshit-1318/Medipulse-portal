import { apiClient } from '@/api/apiClient';
import type {
    Survey,
    SurveyFilters,
    SurveysResponse,
    SurveyStats,
    SurveySettings,
} from '@/types/survey';

import {
    sendSurveyToCustomer,
    getSurveySessions,
    getSurveyResponses,
    getSurveyResponse,
    deleteSurveyResponse,
    exportSurveyResponses,
    getAllSurveyResponses,
} from './surveyResponsesService';

import {
    getSurveyVersions,
    getSurveyVersion,
    rollbackSurvey,
    updateSurveySettings,
} from './surveyVersionService';

export {
    sendSurveyToCustomer,
    getSurveySessions,
    getSurveyResponses,
    getSurveyResponse,
    deleteSurveyResponse,
    exportSurveyResponses,
    getAllSurveyResponses,
    getSurveyVersions,
    getSurveyVersion,
    rollbackSurvey,
    updateSurveySettings,
};

export const getSurveys = async (params: SurveyFilters = {}): Promise<SurveysResponse> => {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sort = 'desc' } = params;
    const queryParams: Record<string, any> = { page, limit, sortBy, sort };
    if (search) queryParams.search = search;
    if (status) queryParams.status = status;
    return apiClient.get<SurveysResponse>('/surveys', { params: queryParams });
};

export const getSurveyStats = async (): Promise<SurveyStats> => {
    return apiClient.get<SurveyStats>('/surveys/stats');
};

export const getSurvey = async (id: string): Promise<Survey> => {
    return apiClient.get<Survey>(`/surveys/${id}`);
};

export const createSurvey = async (payload: {
    title: string;
    slug: string;
    status: 'draft' | 'published';
    schema?: Record<string, any>;
}): Promise<Survey> => {
    return apiClient.post<Survey>('/surveys', payload);
};

export const updateSurvey = async (
    id: string,
    payload: {
        title?: string;
        description?: string;
        draftSchema?: Record<string, any>;
        settings?: Partial<SurveySettings>;
        changelog?: string;
    }
): Promise<Survey> => {
    return apiClient.put<Survey>(`/surveys/${id}`, payload);
};

export const deleteSurvey = async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/surveys/${id}`);
};

export const publishSurvey = async (id: string, changelog?: string): Promise<Survey> => {
    return apiClient.post<Survey>(`/surveys/${id}/publish`, { changelog });
};

export const unpublishSurvey = async (id: string): Promise<Survey> => {
    return apiClient.post<Survey>(`/surveys/${id}/unpublish`, {});
};

export const duplicateSurvey = async (id: string, title: string): Promise<Survey> => {
    return apiClient.post<Survey>(`/surveys/${id}/duplicate`, { title });
};
