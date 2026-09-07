import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSurvey, updateSurvey, publishSurvey, unpublishSurvey, rollbackSurvey } from '@/api/services/survey/surveyService';

export function useSurveyMutations(surveyId: string | null, title: string, setIsDirty: (v: boolean) => void, setShowVersionHistory: (v: boolean) => void) {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async ({ schema, status }: { schema: Record<string, any>; status: 'draft' | 'published' }) => {
            if (!title.trim()) throw new Error('Title is required');
            const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            if (!slug) throw new Error('Valid title is required to generate slug');
            return createSurvey({ title, slug, status, schema });
        },
        onSuccess: (newSurvey) => {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            toast.success(`Survey ${newSurvey.status === 'published' ? 'published' : 'draft saved'}!`);
            setIsDirty(false);
            window.location.href = `/surveys/${newSurvey._id}/edit`;
        },
        onError: (e: any) => toast.error(e.message || 'Failed to create survey'),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ schema, changelog }: { schema: Record<string, any>; changelog?: string }) => {
            if (!surveyId) throw new Error('No survey ID');
            if (!title.trim()) throw new Error('Title is required');
            return updateSurvey(surveyId, { title, draftSchema: schema, changelog });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            setIsDirty(false);
            toast.success('Draft saved');
        },
        onError: (e: any) => toast.error(e.message || 'Failed to save draft'),
    });

    const publishMutation = useMutation({
        mutationFn: async (schema: Record<string, any>) => {
            if (!surveyId) throw new Error('No survey ID');
            await updateSurvey(surveyId, { title, draftSchema: schema });
            return publishSurvey(surveyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            setIsDirty(false);
            toast.success('Survey published successfully!');
        },
        onError: (e: any) => toast.error(e.message || 'Failed to publish survey'),
    });

    const unpublishMutation = useMutation({
        mutationFn: async () => {
            if (!surveyId) throw new Error('No survey ID');
            return unpublishSurvey(surveyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            toast.success('Survey unpublished');
        },
        onError: (e: any) => toast.error(e.message || 'Failed to unpublish'),
    });

    const rollbackMutation = useMutation({
        mutationFn: ({ versionNumber, publishImmediately }: { versionNumber: number; publishImmediately?: boolean }) =>
            rollbackSurvey(surveyId!, versionNumber, publishImmediately),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
            queryClient.invalidateQueries({ queryKey: ['survey-versions', surveyId] });
            setShowVersionHistory(false);
            toast.success('Rolled back to selected version');
        },
        onError: () => toast.error('Failed to rollback'),
    });

    return { createMutation, updateMutation, publishMutation, unpublishMutation, rollbackMutation };
}
