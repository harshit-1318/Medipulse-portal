export interface GPData {
    organisation_code: string;
    gp_name: string;
    address: string;
}

export interface Patient {
    Identifier: string;
    FamilyName: string;
    GivenNames: string;
    BirthDate: string;
    Gender: number;
    Email: string;
}

export interface Document {
    Description: string;
    EventDate: string;
    FileExtension: string;
    FileUrl: string;
    FileHash: string;
    ExternalSystemId: string;
}

export interface DocmanJobPayload {
    Patient: Patient;
    Document: Document;
    RecipientOdsCode: string | null;
    GPData: GPData | null;
}

export interface DocmanJobType {
    _id: string;
    id?: string;
    laravel_document_id: number | string;
    command_type: string;
    completed_at: string | null;
    createdAt: string;
    updatedAt: string;
    payload: DocmanJobPayload;
    status: string;
    workerId?: string | null;
    lastError?: string | null;
    response?: any;
    idempotencyKey?: string | null;
    externalId?: string | null;
}

export interface DocmanJobsResponse {
    jobs: DocmanJobType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface DocmanJobsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sort?: string;
    search?: string;
    status?: string;
}
