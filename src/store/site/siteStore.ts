import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SiteInfo } from '@/api/services/site/types';
import { fetchSiteInfo, initializeSite } from './siteActions';

export { fetchSiteInfo, initializeSite };

interface SiteState {
    siteInfo: Partial<SiteInfo>;
    currentOrderLabel?: string;
    isLoading: boolean;
    error: string | null;
}

export const useSiteStore = create<SiteState>()(
    persist(
        (_set) => ({
            siteInfo: {},
            currentOrderLabel: undefined,
            isLoading: false,
            error: null,
        } as SiteState),
        {
            name: 'site-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Selectors
export const useSiteInfo = () => useSiteStore((s) => s.siteInfo);
export const useSiteLoading = () => useSiteStore((s) => s.isLoading);
export const useSiteError = () => useSiteStore((s) => s.error);
export const useCurrentOrderLabel = () => useSiteStore((s) => s.currentOrderLabel);
export const useSiteActions = () => ({
    fetchSiteInfo,
    initializeSite,
    updateCurrentOrderLabel: (label?: string) => useSiteStore.setState({ currentOrderLabel: label }),
});

export default useSiteStore;
