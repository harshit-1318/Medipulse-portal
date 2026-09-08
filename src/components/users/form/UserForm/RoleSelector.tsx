import { ShieldCheck } from 'lucide-react';
import FormField from './FormField';
import CustomSelect from './CustomSelect';
import type { BaseFieldProps } from './types';

interface RoleSelectorProps extends BaseFieldProps {
    rolesToShow: string[];
}

export default function RoleSelector({ form, onChange, errors, rolesToShow }: RoleSelectorProps) {
    const toTitleCase = (str: string) => 
        str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    const roleOptions = rolesToShow.map(role => ({
        label: toTitleCase(role),
        value: role
    }));

    return (
        <FormField label="User Role" error={errors.role} icon={<ShieldCheck size={18} />}>
            <CustomSelect
                name="role"
                value={form.role}
                onChange={onChange}
                options={roleOptions}
                placeholder="Select role"
                error={!!errors.role}
                icon={<ShieldCheck size={18} />}
            />
        </FormField>
    );
}
