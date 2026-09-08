import BasicInfoFields from './BasicInfoFields';
import PasswordFields from './PasswordFields';
import RoleSelector from './RoleSelector';
import SiteSelector from './SiteSelector';
import type { UserFormFieldsProps } from './types';

export default function UserFormFields({
    form,
    onChange,
    errors,
    isEditMode,
    canViewPassword,
    sites,
    rolesToShow,
    loadingSites,
    isSiteLocked
}: UserFormFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-4">
            <BasicInfoFields
                form={form}
                onChange={onChange}
                errors={errors}
            />

            <PasswordFields
                form={form}
                onChange={onChange}
                errors={errors}
                isEditMode={isEditMode}
                canViewPassword={canViewPassword}
            />

            <RoleSelector
                form={form}
                onChange={onChange}
                errors={errors}
                rolesToShow={rolesToShow}
            />

            <SiteSelector
                form={form}
                onChange={onChange}
                errors={errors}
                sites={sites}
                loadingSites={loadingSites}
                isSiteLocked={isSiteLocked}
            />
        </div>
    );
}
