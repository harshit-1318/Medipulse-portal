export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';

export interface LeadCustomer {
    name: string;
    email: string;
    phone?: string;
}

export interface LeadSurvey {
    title: string;
}

export interface LeadAssignedTo {
    _id: string;
    username: string;
}

export interface Lead {
    _id: string;
    siteId: string;
    surveyId: string;
    customerId: string;
    customer: LeadCustomer;
    survey: LeadSurvey;
    status: LeadStatus;
    assignedTo?: LeadAssignedTo | null;
    submittedResponse?: Record<string, any>;
    submittedAt?: string;
    notesCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface LeadStats {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    closed: number;
    lost: number;
}

export interface LeadFilters {
    search?: string;
    status?: LeadStatus | '' | 'all';
    sortBy?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface LeadsResponse {
    items: Lead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface LeadNote {
    _id: string;
    leadId: string;
    text: string;
    createdBy: {
        _id: string;
        username: string;
    };
    createdAt: string;
}

export interface LeadNotesResponse {
    items: LeadNote[];
    total: number;
}

export interface LeadActivity {
    _id: string;
    leadId: string;
    action: string;
    performedBy?: {
        _id: string;
        username: string;
    };
    details?: Record<string, any>;
    createdAt: string;
}

export interface LeadActivityResponse {
    items: LeadActivity[];
    total: number;
}
