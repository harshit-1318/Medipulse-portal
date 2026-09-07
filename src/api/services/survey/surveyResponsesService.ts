import { apiClient } from '@/api/apiClient';
import type {
    SurveySessionsResponse,
    SurveyResponse,
    SurveyResponsesResponse,
    SendSurveyPayload,
    SendSurveyResponse,
} from '@/types/survey';

export const sendSurveyToCustomer = async (
    id: string,
    payload: SendSurveyPayload
): Promise<SendSurveyResponse> => {
    return apiClient.post<SendSurveyResponse>(`/surveys/${id}/send`, payload);
};

export const getSurveySessions = async (
    id: string,
    params: { page?: number; limit?: number; status?: string; search?: string } = {}
): Promise<SurveySessionsResponse> => {
    return apiClient.get<SurveySessionsResponse>(`/surveys/${id}/sessions`, { params });
};

export const getSurveyResponses = async (
    id: string,
    params: { page?: number; limit?: number; search?: string; from?: string; to?: string; sortBy?: string; sort?: string } = {}
): Promise<SurveyResponsesResponse> => {
    return apiClient.get<SurveyResponsesResponse>(`/surveys/${id}/responses`, { params });
};

export const getSurveyResponse = async (id: string, sessionId: string): Promise<SurveyResponse> => {
    return apiClient.get<SurveyResponse>(`/surveys/${id}/responses/${sessionId}`);
};

export const deleteSurveyResponse = async (id: string, sessionId: string): Promise<void> => {
    return apiClient.delete<void>(`/surveys/${id}/responses/${sessionId}`);
};

export const exportSurveyResponses = async (
    id: string,
    params: { format?: 'csv' | 'json'; from?: string; to?: string }
): Promise<Blob> => {
    return apiClient.get<Blob>(`/surveys/${id}/responses/export`, {
        params,
        responseType: 'blob',
    });
};

export const getAllSurveyResponses = async (
    params: { page?: number; limit?: number; search?: string; from?: string; to?: string } = {}
): Promise<SurveyResponsesResponse> => {
    return apiClient.get<SurveyResponsesResponse>('/surveys/responses', { params });
};
