import type { UserFormData } from '../types';

export function validateUserForm(form: UserFormData, isEditMode: boolean): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!isEditMode && !form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.site_id) newErrors.site_id = "Site is required";

    return newErrors;
}
