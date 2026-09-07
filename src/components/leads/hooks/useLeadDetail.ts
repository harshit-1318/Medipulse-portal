import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    getLead, updateLeadStatus, assignLead,
    addLeadNote, getLeadNotes, getLeadActivity,
} from '@/api/services/lead/leadService';
import type { LeadStatus } from '@/types/lead';

export function useLeadDetail(leadId: string | null) {
    const queryClient = useQueryClient();

    const { data: lead, isLoading } = useQuery({
        queryKey: ['lead', leadId],
        queryFn: () => getLead(leadId!),
        enabled: !!leadId,
    });

    const { data: notesData } = useQuery({
        queryKey: ['lead-notes', leadId],
        queryFn: () => getLeadNotes(leadId!),
        enabled: !!leadId,
    });

    const { data: activityData } = useQuery({
        queryKey: ['lead-activity', leadId],
        queryFn: () => getLeadActivity(leadId!),
        enabled: !!leadId,
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
        queryClient.invalidateQueries({ queryKey: ['lead-notes', leadId] });
        queryClient.invalidateQueries({ queryKey: ['lead-activity', leadId] });
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    };

    const statusMutation = useMutation({
        mutationFn: (status: LeadStatus) => updateLeadStatus(leadId!, status),
        onSuccess: () => { invalidate(); toast.success('Status updated'); },
        onError: () => toast.error('Failed to update status'),
    });

    const assignMutation = useMutation({
        mutationFn: (userId: string | null) => assignLead(leadId!, userId),
        onSuccess: () => { invalidate(); toast.success('Lead assigned'); },
        onError: () => toast.error('Failed to assign lead'),
    });

    const addNoteMutation = useMutation({
        mutationFn: (text: string) => addLeadNote(leadId!, text),
        onSuccess: () => { invalidate(); toast.success('Note added'); },
        onError: () => toast.error('Failed to add note'),
    });

    return {
        lead, isLoading,
        notes: notesData?.items ?? [],
        activity: activityData?.items ?? [],
        handleStatusChange: (s: LeadStatus) => statusMutation.mutate(s),
        handleAssign: (userId: string | null) => assignMutation.mutate(userId),
        handleAddNote: (text: string) => addNoteMutation.mutate(text),
        isUpdatingStatus: statusMutation.isPending,
        isAddingNote: addNoteMutation.isPending,
    };
}
