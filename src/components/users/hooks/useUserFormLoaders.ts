import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { findById } from '@/api/services/user/userService';
import apiClient from '@/api/apiClient';
import type { UserFormData, Site } from '../types';

export function useUserFormLoaders(
    userId: string | undefined,
    isEditMode: boolean,
    isSuperAdmin: boolean,
    currentSiteId: string,
    setForm: React.Dispatch<React.SetStateAction<UserFormData>>
) {
    const [sites, setSites] = useState<Site[]>([]);
    const [loadingSites, setLoadingSites] = useState(true);
    const [loadingUser, setLoadingUser] = useState(isEditMode);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const res = await apiClient.request<any>({ url: "/sites", method: "GET" });
                const sitesData = res?.sites || (Array.isArray(res) ? res : []);
                const availableSites: Site[] = sitesData.map((s: any) => ({
                    _id: s._id,
                    site_key: s.site_key,
                    site_name: s.site_name,
                }));
                setSites(availableSites);

                if (!isEditMode) {
                    let defaultSiteId = "";
                    if (currentSiteId) {
                        const matchedSite = availableSites.find(s => s._id === currentSiteId);
                        if (matchedSite) defaultSiteId = matchedSite._id;
                    }
                    if (!defaultSiteId && availableSites.length === 1) {
                        defaultSiteId = availableSites[0]._id;
                    }
                    if (defaultSiteId) {
                        setForm(prev => ({ ...prev, site_id: defaultSiteId }));
                    }
                } else {
                    setForm((prev) => {
                        const byId = availableSites.find((s) => s._id === prev.site_id);
                        if (byId) return prev;
                        const byKey = availableSites.find((s) => s.site_key === prev.site_id);
                        if (!byKey) return prev;
                        return { ...prev, site_id: byKey._id };
                    });
                }
            } catch (err: any) {
                toast.error(`Error loading sites: ${err?.message || "Unknown error"}`);
            } finally {
                setLoadingSites(false);
            }
        };
        fetchSites();
    }, [isSuperAdmin, currentSiteId, isEditMode, setForm]);

    useEffect(() => {
        if (!isEditMode || !userId) return;
        const fetchUser = async () => {
            try {
                const res: any = await findById(userId);
                const user = res?.user ?? res?.data ?? res;
                let sId = "";
                if (typeof user.site_id === 'object' && user.site_id !== null) {
                    sId = user.site_id._id || user.site_id.site_key || "";
                } else {
                    sId = user.site_id || "";
                }
                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    role: user.role || "user",
                    site_id: String(sId),
                    password: ""
                });
            } catch (err) {
                toast.error("Error loading user details");
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [isEditMode, userId, setForm]);

    return { sites, loadingSites, loadingUser };
}
