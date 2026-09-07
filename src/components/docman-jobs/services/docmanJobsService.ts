import apiClient from "@/api/apiClient";
import type { DocmanJobsResponse, DocmanJobsParams, DocmanJobType } from "../types";
import { normalizeDocmanJob } from "../utils/normalizeDocmanJob";

export const docmanJobsService = {
    /**
     * Fetch paginated docman jobs with optional filters.
     */
    async getJobs(params: DocmanJobsParams): Promise<DocmanJobsResponse> {
        try {
            const response = await apiClient.get<any>({
                url: "/docman-jobs/listing",
                params,
                withCredentials: true,
            });

            // Handle various response structures
            const rawJobs = response?.jobs ?? response?.data ?? (Array.isArray(response) ? response : []);
            const total = response?.total ?? (Array.isArray(response) ? response.length : 0);
            const page = response?.page ?? params.page ?? 1;
            const limit = response?.limit ?? params.limit ?? 20;
            const totalPages = response?.totalPages ?? Math.ceil(total / limit);

            const jobs = rawJobs.map(normalizeDocmanJob);

            return {
                jobs,
                total,
                page,
                limit,
                totalPages,
            };
        } catch (err) {
            console.error("❌ [docmanJobsService.getJobs] Error:", err);
            return {
                jobs: [],
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0,
            };
        }
    },

    /**
     * Get a single docman job by ID.
     */
    async getJobById(id: string): Promise<DocmanJobType> {
        const response = await apiClient.get<any>({
            url: `/docman-jobs/${id}`,
            withCredentials: true,
        });
        return normalizeDocmanJob(response);
    },

    /**
     * Action to delete/cancel a docman job.
     */
    async deleteJob(id: string): Promise<any> {
        return await apiClient.delete<any>({
            url: `/docman-jobs/${id}`,
            withCredentials: true,
        });
    },

    /**
     * Action to claim a docman job (for manual processing).
     */
    async claimJob(): Promise<any> {
        return await apiClient.post<any>({
            url: "/docman-jobs/claim",
            withCredentials: true,
        });
    },

    /**
     * Action to retry a failed job.
     */
    async retryJob(id: string): Promise<any> {
        return await apiClient.post<any>({
            url: `/docman-jobs/retry/${id}`,
            withCredentials: true,
        });
    }
};

