import { apiClient } from '@/api/apiClient';
import type { Survey, SurveyVersion, SurveySettings } from '@/types/survey';

export const getSurveyVersions = async (id: string): Promise<{ items: SurveyVersion[]; total: number }> => {
    return apiClient.get<{ items: SurveyVersion[]; total: number }>(`/surveys/${id}/versions`);
};

export const getSurveyVersion = async (id: string, versionNumber: number): Promise<SurveyVersion> => {
    return apiClient.get<SurveyVersion>(`/surveys/${id}/versions/${versionNumber}`);
};

export const rollbackSurvey = async (
    id: string,
    versionNumber: number,
    publishImmediately = false
): Promise<Survey> => {
    return apiClient.post<Survey>(`/surveys/${id}/rollback/${versionNumber}`, { publishImmediately });
};

export const updateSurveySettings = async (id: string, settings: Partial<SurveySettings>): Promise<Survey> => {
    return apiClient.put<Survey>(`/surveys/${id}/settings`, settings);
};
