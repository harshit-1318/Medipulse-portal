import apiClient from '@/api/apiClient';

export interface EmailQueueSummary {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
    duePending: number;
    retryPending: number;
}

export interface EmailQueueJob {
    id: string;
    jobKey: string;
    siteId: string;
    orderId: number;
    reminderType: 'first' | 'oops';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    attempts: number;
    availableAt: string;
    startedAt: string | null;
    processedAt: string | null;
    lastError: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EmailQueueOverview {
    summary: EmailQueueSummary;
    jobs: EmailQueueJob[];
    generatedAt: string;
}

const EMPTY_OVERVIEW: EmailQueueOverview = {
    summary: {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        total: 0,
        duePending: 0,
        retryPending: 0,
    },
    jobs: [],
    generatedAt: new Date(0).toISOString(),
};

export async function getEmailQueueOverview(limit = 25): Promise<EmailQueueOverview> {
    try {
        const response = await apiClient.get<any>({
            url: '/email/queue/overview',
            params: { limit },
            withCredentials: true,
        });

        if (!response || typeof response !== 'object') {
            return EMPTY_OVERVIEW;
        }

        const summary = response.summary ?? EMPTY_OVERVIEW.summary;
        const jobs = Array.isArray(response.jobs) ? response.jobs : [];

        return {
            summary: {
                pending: Number(summary.pending ?? 0),
                processing: Number(summary.processing ?? 0),
                completed: Number(summary.completed ?? 0),
                failed: Number(summary.failed ?? 0),
                total: Number(summary.total ?? 0),
                duePending: Number(summary.duePending ?? 0),
                retryPending: Number(summary.retryPending ?? 0),
            },
            jobs: jobs.map((job: any) => ({
                id: String(job.id ?? ''),
                jobKey: String(job.jobKey ?? ''),
                siteId: String(job.siteId ?? ''),
                orderId: Number(job.orderId ?? 0),
                reminderType: job.reminderType === 'oops' ? 'oops' : 'first',
                status: ['pending', 'processing', 'completed', 'failed'].includes(job.status)
                    ? job.status
                    : 'pending',
                attempts: Number(job.attempts ?? 0),
                availableAt: String(job.availableAt ?? ''),
                startedAt: job.startedAt ? String(job.startedAt) : null,
                processedAt: job.processedAt ? String(job.processedAt) : null,
                lastError: job.lastError ? String(job.lastError) : null,
                createdAt: String(job.createdAt ?? ''),
                updatedAt: String(job.updatedAt ?? ''),
            })),
            generatedAt: String(response.generatedAt ?? new Date().toISOString()),
        };
    } catch (error) {
        console.error('[emailQueueService] Failed to fetch queue overview', error);
        return EMPTY_OVERVIEW;
    }
}
