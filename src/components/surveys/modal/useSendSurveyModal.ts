import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getSurveys, sendSurveyToCustomer } from '@/api/services/survey/surveyService';

export function useSendSurveyModal(customerId: string, orderId?: string) {
    const [selectedSurveyId, setSelectedSurveyId] = useState('');
    const [sentLink, setSentLink] = useState<string | null>(null);
    const [conflictError, setConflictError] = useState(false);

    const { data: surveysData, isLoading: loadingSurveys } = useQuery({
        queryKey: ['surveys-published'],
        queryFn: () => getSurveys({ status: 'published', limit: 100 }),
    });

    const sendMutation = useMutation({
        mutationFn: () => sendSurveyToCustomer(selectedSurveyId, { customerId, orderId }),
        onSuccess: (data) => {
            setSentLink(data.surveyLink);
            toast.success(`Survey link sent to ${data.customerEmail}`);
        },
        onError: (err: any) => {
            if (err?.response?.status === 409) setConflictError(true);
            else toast.error('Failed to send survey');
        },
    });

    const handleSend = () => {
        if (!selectedSurveyId) return;
        setConflictError(false);
        sendMutation.mutate();
    };

    return {
        selectedSurveyId,
        setSelectedSurveyId,
        sentLink,
        conflictError,
        setConflictError,
        surveysData,
        loadingSurveys,
        sendMutation,
        handleSend,
    };
}
