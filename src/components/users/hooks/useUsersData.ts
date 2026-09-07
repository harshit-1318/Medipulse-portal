import { useState, useEffect, useCallback } from 'react';
import { getUsers, updateUserById } from '@/api/services/user/userService';
import type { User } from '../types';
import toast from 'react-hot-toast';
import { useUsersSites } from './useUsersSites';

export function useUsersData({
    page,
    limit,
    debouncedSearch,
    selectedSite,
    sortBy,
    sort,
    isSuperAdmin,
    currentSiteId,
}: {
    page: number;
    limit: number;
    debouncedSearch: string;
    selectedSite: string;
    sortBy: string;
    sort: string;
    isSuperAdmin: boolean;
    currentSiteId: string;
}) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { sites } = useUsersSites(isSuperAdmin, currentSiteId);

    // Fetch Users
    useEffect(() => {
        let ignore = false;
        setLoading(true);

        const effectiveSiteFilter = isSuperAdmin
            ? selectedSite !== "all" ? selectedSite : "all"
            : currentSiteId || (selectedSite !== "all" ? selectedSite : "");

        getUsers(page, limit, debouncedSearch, effectiveSiteFilter, sortBy, sort as "asc" | "desc")
            .then((res: any) => {
                if (ignore) return;
                const usersArray = Array.isArray(res) ? res : res.data || res.users || [];
                const totalCount = res.total || res.totalCount || usersArray.length;
                
                const siteLookup = sites.reduce((acc, site) => {
                    acc[site._id] = site.site_name;
                    return acc;
                }, {} as Record<string, string>);

                const enhancedUsers = usersArray.map((user: any) => ({
                    ...user,
                    siteName: user.site_id ? siteLookup[user.site_id] : "—",
                }));

                setUsers(enhancedUsers);
                setTotal(totalCount);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch users", err);
                setLoading(false);
            });

        return () => { ignore = true; };
    }, [page, debouncedSearch, selectedSite, sortBy, sort, isSuperAdmin, currentSiteId, sites, limit]);

    const toggleUserActive = useCallback(async (userId: string, nextActive: boolean) => {
        const targetUser = users.find((u) => u._id === userId);
        if (targetUser?.is_super_admin) {
            toast.error('Super Admin account cannot be disabled from list actions.');
            return;
        }

        try {
            await updateUserById(userId, { is_active: nextActive });
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, is_active: nextActive } : u))
            );
            toast.success(nextActive ? 'User enabled successfully.' : 'User disabled successfully.');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update user status.');
        }
    }, [users]);

    return {
        users,
        loading,
        sites,
        total,
        toggleUserActive,
    };
}

