import axios from 'axios';
import type { PublicSurveySessionData } from '@/types/survey';
import { isDevEnvironment } from '@/utils/env';

const defaultBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_API_BASE_URL || 'http://localhost:5000';
const baseURL = typeof window !== 'undefined' && isDevEnvironment() ? '/api' : defaultBaseURL;

const publicAxios = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// Unwrap the standard { status, data, message } response envelope
publicAxios.interceptors.response.use(
    (response) => {
        return response.data?.data ?? response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const withToken = (token: string): Record<string, string> => ({
    'X-Survey-Token': token,
});

/**
 * Load the survey schema and any saved partial progress for this session.
 * Called when the customer opens their unique /s/:token URL.
 */
export const getSurveySession = async (token: string): Promise<PublicSurveySessionData> => {
    const response = await publicAxios.get<any, PublicSurveySessionData>(
        `/surveys/s/${token}`,
        { headers: withToken(token) }
    );
    return response;
};

/**
 * Save partial progress (auto-save or explicit "Save & Continue Later").
 */
export const saveProgress = async (
    token: string,
    payload: { partialResponse: Record<string, any>; currentPage: number }
): Promise<{ saved: boolean; savedAt: string }> => {
    return publicAxios.patch(
        `/surveys/s/${token}/progress`,
        payload,
        { headers: withToken(token) }
    );
};

/**
 * Submit the completed survey. Marks session as completed and triggers Lead creation.
 */
export const submitSurvey = async (
    token: string,
    payload: {
        submittedResponse: Record<string, any>;
        metadata?: { userAgent?: string; submittedFrom?: string };
    }
): Promise<{ submitted: boolean; submittedAt: string; message: string }> => {
    return publicAxios.post(
        `/surveys/s/${token}/submit`,
        payload,
        { headers: withToken(token) }
    );
};
