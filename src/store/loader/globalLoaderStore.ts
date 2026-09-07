import { create } from "zustand";

interface GlobalLoaderStore {
    loading: boolean;
    activeRequests: Set<string>;
    start: (id: string) => void;
    stop: (id: string) => void;
}

export const useGlobalLoader = create<GlobalLoaderStore>((set) => ({
    loading: false,
    activeRequests: new Set(),
    start: (id) =>
        set((state) => {
            const next = new Set(state.activeRequests);
            next.add(id);
            return { activeRequests: next, loading: next.size > 0 };
        }),
    stop: (id) =>
        set((state) => {
            const next = new Set(state.activeRequests);
            next.delete(id);
            return { activeRequests: next, loading: next.size > 0 };
        }),
}));
