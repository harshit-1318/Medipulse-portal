import React from 'react';
import type { UserFormData, Site } from '../../types';

export interface BaseFieldProps {
    form: UserFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors: Record<string, string>;
}

export interface UserFormFieldsProps extends BaseFieldProps {
    isEditMode: boolean;
    canViewPassword: boolean;
    sites: Site[];
    rolesToShow: string[];
    loadingSites: boolean;
    isSiteLocked: boolean;
}
