import React from 'react';

interface PasswordFieldProps {
    label: string;
    name: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({ label, name, value, placeholder, onChange }: PasswordFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">
                {label}
            </label>
            <input 
                type="password" 
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all placeholder:text-slate-300"
            />
        </div>
    );
}
