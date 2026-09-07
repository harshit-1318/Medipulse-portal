import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { internalNotesService } from "../../../api/services/orders/internalNotesService";
import { useUserInfo } from '@/store';

export function useInternalNotes(orderId: string) {
    const userInfo = useUserInfo();
    const queryClient = useQueryClient();

    const { data: notes = [], isLoading, isError } = useQuery({
        queryKey: ["internal-notes", orderId],
        queryFn: async () => {
            if (!orderId) return [];
            return await internalNotesService.getNotes(orderId);
        },
        enabled: !!orderId,
        retry: 1,
    });

    const addNoteMutation = useMutation({
        mutationFn: async (text: string) => {
            const user = userInfo?.username || userInfo?.email || "Unknown User";
            return await internalNotesService.addNote({ orderId, text, user });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["internal-notes", orderId] });
        },
    });

    const deleteNoteMutation = useMutation({
        mutationFn: async (noteId: string) => {
            return await internalNotesService.deleteNote(noteId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["internal-notes", orderId] });
        },
    });

    const parkOrderMutation = useMutation({
        mutationFn: async () => {
            return await internalNotesService.parkOrder(orderId);
        },
        onSuccess: () => {
            toast.success("Successfully parked the order");
        },
        onError: () => {
            toast.error("Failed to park the order. Please try again.");
        },
    });

    const updateNoteMutation = useMutation({
        mutationFn: async ({ noteId, text }: { noteId: string; text: string }) => {
            return await internalNotesService.updateNote(noteId, text);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["internal-notes", orderId] });
        },
    });

    return {
        notes,
        isLoading,
        isError,
        addNote: addNoteMutation.mutate,
        isAdding: addNoteMutation.isPending,
        deleteNote: deleteNoteMutation.mutate,
        isDeleting: deleteNoteMutation.isPending,
        updateNote: updateNoteMutation.mutate,
        isUpdating: updateNoteMutation.isPending,
        parkOrder: parkOrderMutation.mutate,
        isParking: parkOrderMutation.isPending,
    };
}
