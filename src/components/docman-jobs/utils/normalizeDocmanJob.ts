import type { DocmanJobType } from "../types";

/**
 * Normalizes a docman job object to ensure consistent property naming.
 */
export function normalizeDocmanJob(job: any): DocmanJobType {
    if (!job) return {} as DocmanJobType;

    let payload = job.payload || {};
    if (typeof payload === 'string') {
        try {
            payload = JSON.parse(payload);
        } catch (e) {
            payload = {};
        }
    }

    return {
        _id: job._id || job.id,
        id: job.id || job._id,
        laravel_document_id: job.laravel_document_id || job.laravelDocumentId,
        command_type: job.command_type || job.commandType,
        completed_at: job.completed_at || job.completedAt,
        createdAt: job.createdAt || job.created_at,
        updatedAt: job.updatedAt || job.updated_at,
        status: job.status,
        payload: payload,
        workerId: job.workerId || job.worker_id,
        lastError: job.lastError || job.last_error,
        response: job.response,
        idempotencyKey: job.idempotencyKey || job.idempotency_key,
        externalId: job.externalId || job.external_id,
    };
}
