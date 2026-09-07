import { toast } from 'react-hot-toast';
import { docmanJobsService } from '../services/docmanJobsService';

export function useDocmanJobActions(fetchJobs: () => Promise<void>) {
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await docmanJobsService.deleteJob(id);
            toast.success("Job deleted successfully!");
            fetchJobs();
        } catch (err: any) {
            console.error("Delete error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to delete job.");
        }
    };

    const handleRetry = async (id: string) => {
        try {
            await docmanJobsService.retryJob(id);
            toast.success("Retry initiated successfully!");
            fetchJobs();
        } catch (err: any) {
            console.error("Retry error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to retry job.");
        }
    };

    return { handleDelete, handleRetry };
}
