export type SurveyStatus = 'draft' | 'published';

export type SurveySessionStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

export interface SurveySettings {
    expiryDays: number;
    captchaEnabled: boolean;
    allowedDomains: string[];
    submissionLimit: number | null;
}

export interface Survey {
    _id: string;
    title: string;
    description?: string;
    slug: string;
    status: SurveyStatus;
    currentVersion: number;
    schema: Record<string, any>;
    draftSchema?: Record<string, any>;
    settings: SurveySettings;
    totalSessions?: number;
    completedSessions?: number;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SurveyVersion {
    _id: string;
    versionNumber: number;
    schema: Record<string, any>;
    changelog?: string;
    createdBy: { _id: string; username: string };
    createdAt: string;
}

export interface SurveySession {
    _id: string;
    siteId: string;
    surveyId: string;
    customerId: string;
    orderId?: string;
    token: string;
    status: SurveySessionStatus;
    partialResponse: Record<string, any> | null;
    currentPage: number;
    submittedResponse: Record<string, any> | null;
    submittedAt?: string;
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
        source?: 'email' | 'direct' | 'embed';
        submittedFrom?: string;
    };
    expiresAt: string;
    sentBy?: string;
    sentAt: string;
    customer?: { _id: string; name: string; email: string };
    createdAt: string;
    updatedAt: string;
}

export interface SurveyResponse {
    _id: string;
    survey: { _id: string; title: string };
    customer: { _id: string; name: string; email: string };
    orderId?: string;
    submittedResponse: Record<string, any>;
    submittedAt: string;
    metadata: {
        ipAddress: string;
        userAgent: string;
        source: string;
    };
    leadId?: string;
}

export interface SurveyStats {
    totalSurveys: number;
    draftSurveys: number;
    publishedSurveys: number;
    totalSessions: number;
    completedSessions: number;
    pendingSessions: number;
    expiredSessions: number;
    totalLeads: number;
}

export interface SurveyFilters {
    search?: string;
    status?: SurveyStatus | '';
    sortBy?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface SurveysResponse {
    items: Survey[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SurveySessionsResponse {
    items: SurveySession[];
    total: number;
    page: number;
    limit: number;
}

export interface SurveyResponsesResponse {
    items: SurveyResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface PublicSurveySessionData {
    sessionId: string;
    status: SurveySessionStatus;
    surveyTitle: string;
    schema: Record<string, any>;
    partialResponse: Record<string, any> | null;
    currentPage: number;
    expiresAt: string;
    alreadySubmitted?: boolean;
    expired?: boolean;
}

export interface SendSurveyPayload {
    customerId: string;
    orderId?: string;
}

export interface SendSurveyResponse {
    sessionId: string;
    token: string;
    surveyLink: string;
    expiresAt: string;
    customerEmail: string;
}
