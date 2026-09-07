import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';
import type { Site } from '../types';

export function useUsersSites(isSuperAdmin: boolean, currentSiteId: string) {
    const [sites, setSites] = useState<Site[]>([]);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const rawSitesRes = await apiClient.get<any>({ url: "/sites" });
                const sitesData = Array.isArray(rawSitesRes) ? rawSitesRes : rawSitesRes?.sites || [];

                let sitesRes = sitesData.map((site: any) => ({
                    _id: site._id,
                    site_name: site.site_name,
                }));

                if (!isSuperAdmin && currentSiteId) {
                    sitesRes = sitesRes.filter((s: { _id: string }) => String(s._id) === String(currentSiteId));
                }
                setSites(sitesRes);
            } catch (err) {
                console.error("Failed to fetch sites", err);
            }
        };
        fetchSites();
    }, [isSuperAdmin, currentSiteId]);

    return { sites };
}
