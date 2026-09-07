import apiClient from '../../apiClient';

export interface InternalNote {
    _id: string;
    order_id: string;
    note: string;
    user_id: string | { name: string; _id: string };
    createdAt?: string;
    created_at?: string;
}

export const internalNotesService = {
    getNotes: async (orderId: string): Promise<InternalNote[]> => {
        try {
            const cleanId = orderId.trim().replace(/^#/, "").replace(/\/$/, "");
            const response = await apiClient.get<InternalNote[] | { data: InternalNote[] }>(`/order-notes/${cleanId}`);
            const notes = Array.isArray(response) ? response : response?.data || [];

            return notes.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
                const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
                return dateB - dateA;
            });
        } catch (error) {
            console.error("❌ [getNotes] Error:", error);
            return [];
        }
    },

    addNote: async (data: { orderId: string; text: string; user: string }): Promise<InternalNote> => {
        const cleanId = data.orderId.trim().replace(/^#/, "").replace(/\/$/, "");
        return await apiClient.post<InternalNote>(`/order-notes`, {
            order_id: cleanId,
            note: data.text,
            user_id: data.user,
        });
    },

    updateNote: async (noteId: string, text: string): Promise<InternalNote> => {
        const cleanNoteId = noteId.trim().replace(/\/$/, "");
        return await apiClient.request<InternalNote>({
            url: `/order-notes/${cleanNoteId}`,
            method: "PATCH",
            data: { note: text },
        });
    },

    deleteNote: async (noteId: string): Promise<void> => {
        const cleanNoteId = noteId.trim().replace(/\/$/, "");
        return await apiClient.delete<void>(`/order-notes/${cleanNoteId}`);
    },

    parkOrder: async (orderId: string): Promise<void> => {
        const cleanId = orderId.trim().replace(/^#/, "").replace(/\/$/, "");
        return await apiClient.post<void>(`/orders/parked-order/${cleanId}`, {});
    },
};
