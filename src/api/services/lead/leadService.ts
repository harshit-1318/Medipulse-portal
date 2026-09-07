import { apiClient } from '@/api/apiClient';
import type {
    Lead,
    LeadFilters,
    LeadsResponse,
    LeadStats,
    LeadNote,
    LeadNotesResponse,
    LeadActivityResponse,
    LeadStatus,
} from '@/types/lead';

export const getLeads = async (params: LeadFilters = {}): Promise<LeadsResponse> => {
    const { page = 1, limit = 20, ...rest } = params;
    const queryParams: Record<string, any> = { page, limit };
    Object.entries(rest).forEach(([k, v]) => { if (v !== undefined && v !== '') queryParams[k] = v; });
    return apiClient.get<LeadsResponse>('/leads', { params: queryParams });
};

export const getLeadStats = async (): Promise<LeadStats> => {
    return apiClient.get<LeadStats>('/leads/stats');
};

export const getLead = async (id: string): Promise<Lead> => {
    return apiClient.get<Lead>(`/leads/${id}`);
};

export const updateLead = async (
    id: string,
    payload: { status?: LeadStatus; assignedTo?: string | null }
): Promise<Lead> => {
    return apiClient.put<Lead>(`/leads/${id}`, payload);
};

export const updateLeadStatus = async (
    id: string,
    status: LeadStatus
): Promise<{ status: LeadStatus; updatedAt: string }> => {
    return apiClient.patch<{ status: LeadStatus; updatedAt: string }>(`/leads/${id}/status`, { status });
};

export const assignLead = async (
    id: string,
    userId: string | null
): Promise<{ assignedTo: Lead['assignedTo'] }> => {
    return apiClient.patch<{ assignedTo: Lead['assignedTo'] }>(`/leads/${id}/assign`, { userId });
};

export const getLeadNotes = async (id: string): Promise<LeadNotesResponse> => {
    return apiClient.get<LeadNotesResponse>(`/leads/${id}/notes`);
};

export const addLeadNote = async (id: string, text: string): Promise<LeadNote> => {
    return apiClient.post<LeadNote>(`/leads/${id}/notes`, { text });
};

export const getLeadActivity = async (id: string): Promise<LeadActivityResponse> => {
    return apiClient.get<LeadActivityResponse>(`/leads/${id}/activity`);
};
