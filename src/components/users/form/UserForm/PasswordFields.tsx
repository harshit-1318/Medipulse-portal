import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import FormField from './FormField';
import type { BaseFieldProps } from './types';

interface PasswordFieldsProps extends BaseFieldProps {
    isEditMode: boolean;
    canViewPassword: boolean;
}

export default function PasswordFields({ form, onChange, errors, isEditMode, canViewPassword }: PasswordFieldsProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            label={`Password ${isEditMode ? '(Optional)' : ''}`}
            error={errors.password}
            icon={<Lock size={18} />}
        >
            <div className="relative">
                <input
                    name="password"
                    type={showPassword && canViewPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange}
                    placeholder={isEditMode ? "Leave blank to keep current" : "Enter a secure password"}
                    className={`w-full pl-12 ${canViewPassword ? 'pr-12' : 'pr-4'} py-3.5 rounded-xl text-[16px] font-medium transition-all duration-300 bg-slate-50/50 border outline-none focus:bg-white focus:border-[#00a294] focus:ring-4 focus:ring-[#00a294]/15 ${errors.password ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}`}
                />
                {canViewPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </FormField>
    );
}
