import { getSiteInfoApi } from '@/api/services/site/siteService';
import { applySiteFavicon } from '@/utils/branding';
import { useSiteStore } from './siteStore';

export const fetchSiteInfo = async (domain?: string) => {
    let currentDomain = domain || (typeof window !== 'undefined' ? window.location.host : '');

    // Fallback for localhost development
    if (currentDomain.includes('localhost')) {
        currentDomain = process.env.NEXT_PUBLIC_DEFAULT_SITE_HOST || 'localhost';
    }

    useSiteStore.setState({ isLoading: true, error: null });

    try {
        const siteInfo = await getSiteInfoApi({ host: currentDomain });

        if (siteInfo && siteInfo.id) {
            useSiteStore.setState({ siteInfo, isLoading: false });
            applySiteFavicon(siteInfo.small_icon_url);

            // Store site headers for API calls
            localStorage.setItem('X-SITE-ID', siteInfo.id);
            localStorage.setItem('X-SITE-KEY', siteInfo.key);
            localStorage.setItem('X-SITE-HOST', currentDomain);

            return siteInfo;
        }

        useSiteStore.setState({ isLoading: false, error: 'No site data received' });
        return null;
    } catch (error: any) {
        const errorMessage = error?.message || 'Failed to detect site';
        useSiteStore.setState({ isLoading: false, error: errorMessage });
        return null;
    }
};

export const initializeSite = async () => {
    if (typeof window === 'undefined') return;

    let currentDomain = window.location.host;
    if (currentDomain.includes('localhost')) {
        currentDomain = process.env.NEXT_PUBLIC_DEFAULT_SITE_HOST || 'localhost';
    }

    const { siteInfo } = useSiteStore.getState();

    if (siteInfo?.id && localStorage.getItem('X-SITE-HOST') === currentDomain) {
        applySiteFavicon(siteInfo.small_icon_url);
        localStorage.setItem('X-SITE-ID', siteInfo.id);
        localStorage.setItem('X-SITE-KEY', siteInfo.key || '');
        localStorage.setItem('X-SITE-HOST', currentDomain);
        return;
    }

    await fetchSiteInfo(window.location.host);
};
