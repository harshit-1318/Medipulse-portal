import { AtSign, User as UserIcon } from 'lucide-react';
import FormField from './FormField';
import type { BaseFieldProps } from './types';

export default function BasicInfoFields({ form, onChange, errors }: BaseFieldProps) {
    return (
        <>
            <FormField label="Full Name" error={errors.name} icon={<UserIcon size={18} />}>
                <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Enter user's full name"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl text-[16px] font-medium transition-all duration-300 bg-slate-50/50 border outline-none focus:bg-white focus:border-[#00a294] focus:ring-4 focus:ring-[#00a294]/15 ${errors.name ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}`}
                />
            </FormField>

            <FormField label="Email Address" error={errors.email} icon={<AtSign size={18} />}>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Enter email address"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl text-[16px] font-medium transition-all duration-300 bg-slate-50/50 border outline-none focus:bg-white focus:border-[#00a294] focus:ring-4 focus:ring-[#00a294]/15 ${errors.email ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}`}
                />
            </FormField>
        </>
    );
}
