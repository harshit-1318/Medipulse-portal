import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteSurvey, duplicateSurvey } from '@/api/services/survey/surveyService';

export function useSurveysTableMutations() {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteSurvey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            toast.success('Survey deleted');
        },
        onError: () => toast.error('Could not delete survey'),
    });

    const duplicateMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            duplicateSurvey(id, `Copy of ${title}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            toast.success('Survey duplicated');
        },
        onError: () => toast.error('Could not duplicate survey'),
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this survey? This cannot be undone.')) {
            deleteMutation.mutate(id);
        }
    };

    const handleDuplicate = (id: string, title: string) => {
        duplicateMutation.mutate({ id, title });
    };

    return {
        handleDelete,
        handleDuplicate,
    };
}
