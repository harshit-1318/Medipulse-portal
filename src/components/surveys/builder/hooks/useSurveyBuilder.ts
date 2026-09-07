import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getSurvey, getSurveyVersions } from '@/api/services/survey/surveyService';
import { useSurveyMutations } from './surveyMutations';

interface UseSurveyBuilderOptions {
    surveyId: string | null;
}

export function useSurveyBuilder({ surveyId }: UseSurveyBuilderOptions) {
    const [title, setTitle] = useState('Untitled Survey');
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const { data: survey, isLoading } = useQuery({
        queryKey: ['survey', surveyId],
        queryFn: () => getSurvey(surveyId!),
        enabled: !!surveyId,
    });

    const { data: versionsData } = useQuery({
        queryKey: ['survey-versions', surveyId],
        queryFn: () => getSurveyVersions(surveyId!),
        enabled: !!surveyId && showVersionHistory,
    });

    useEffect(() => {
        if (survey?.title) setTitle(survey.title);
    }, [survey?.title]);

    const { createMutation, updateMutation, publishMutation, unpublishMutation, rollbackMutation } =
        useSurveyMutations(surveyId, title, setIsDirty, setShowVersionHistory);

    const handleSave = useCallback(async (status: 'draft' | 'published', schema: Record<string, any>) => {
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!surveyId) {
            createMutation.mutate({ schema, status });
        } else {
            if (status === 'published') {
                publishMutation.mutate(schema);
            } else {
                updateMutation.mutate({ schema });
            }
        }
    }, [surveyId, title, createMutation, updateMutation, publishMutation]);

    return {
        survey,
        isLoading,
        title, setTitle,
        isDirty, setIsDirty,
        versions: versionsData?.items ?? [],
        showVersionHistory, setShowVersionHistory,
        handleSave,
        isSaving: updateMutation.isPending || (createMutation.isPending && createMutation.variables?.status === 'draft'),
        isPublishing: publishMutation.isPending || (createMutation.isPending && createMutation.variables?.status === 'published'),
        handleUnpublish: () => unpublishMutation.mutate(),
        handleRollback: (versionNumber: number) => rollbackMutation.mutate({ versionNumber }),
    };
}
