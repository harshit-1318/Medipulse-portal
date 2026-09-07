import apiClient from "@/api/apiClient";

export const executeUserCandidates = async (
    candidates: Array<{ method: "GET" | "PATCH" | "PUT"; url: string }>,
    data?: Record<string, unknown>
) => {
    let lastError: any = null;
    for (const candidate of candidates) {
        try {
            return await apiClient.request({
                url: candidate.url,
                method: candidate.method,
                data,
            });
        } catch (err: any) {
            lastError = err;
            const status = err?.response?.status;
            if (status === 404 || status === 405) continue;
            throw err;
        }
    }
    throw lastError;
};
