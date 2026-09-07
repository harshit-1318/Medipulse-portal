import { useState } from 'react';
import { useUserInfo, useSiteInfo } from '@/store';
import type { UserFormData } from '../types';
import { useUserFormLoaders } from './useUserFormLoaders';
import { useUserFormActions } from './useUserFormActions';

export function useUserForm(userId?: string) {
    const isEditMode = !!userId;
    const currentUser = useUserInfo();
    const siteInfo = useSiteInfo();
    const siteIdFromStorage = typeof window !== 'undefined' ? localStorage.getItem("X-SITE-ID") : "";
    const currentSiteId = (siteInfo as any)?.id || siteIdFromStorage || "";

    const isSuperAdmin = currentUser?.effectiveRole === 'super_admin';
    const isAdmin = currentUser?.effectiveRole === 'admin';

    const [form, setForm] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: 'user',
        site_id: ''
    });

    const { sites, loadingSites, loadingUser } = useUserFormLoaders(
        userId,
        isEditMode,
        isSuperAdmin,
        currentSiteId,
        setForm
    );

    const { onSubmit, handleDelete, isSubmitting, errors, setErrors } = useUserFormActions(
        userId,
        isEditMode,
        isAdmin,
        form
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const rolesToShow = Array.from(
        new Set([
            'admin',
            'prescriber',
            'pharmacist',
            'pharmacy_staff',
            'customer_support',
            'driver',
            'user',
            'customer',
            ...(isSuperAdmin ? ['super_admin'] : []),
            ...(form.role ? [form.role] : []),
        ]),
    );
    const isSiteLocked = !isSuperAdmin || sites.length <= 1;

    return {
        form, handleChange, onSubmit, handleDelete,
        sites, loadingSites, loadingUser, rolesToShow,
        errors, isSubmitting, isEditMode, isSuperAdmin, isSiteLocked
    };
}
