import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateUserById, createUser, deleteUser } from '@/api/services/user/userService';
import type { UserFormData } from '../types';
import { validateUserForm } from '../utils/userFormValidation';

export function useUserFormActions(
    userId: string | undefined,
    isEditMode: boolean,
    isAdmin: boolean,
    form: UserFormData
) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateUserForm(form, isEditMode);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const payload: any = { ...form };
            if (isEditMode && !payload.password) delete payload.password;
            if (!payload.site_id && typeof window !== 'undefined') {
                payload.site_id = localStorage.getItem('X-SITE-ID') || '65e0123456789abcdef00001';
            }

            if (isAdmin && (payload.role === 'super_admin' || payload.role === 'admin')) {
                toast.error("You cannot assign admin roles.");
                setIsSubmitting(false);
                return;
            }

            if (isEditMode) await updateUserById(userId!, payload);
            else await createUser(payload);

            toast.success(isEditMode ? "User updated" : "User created");
            window.location.href = "/users";
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Action failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!userId || !window.confirm("Are you sure?")) return;
        try {
            await deleteUser(userId);
            toast.success("User deleted");
            window.location.href = "/users";
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Delete failed");
        }
    };

    return { onSubmit, handleDelete, isSubmitting, errors, setErrors };
}
