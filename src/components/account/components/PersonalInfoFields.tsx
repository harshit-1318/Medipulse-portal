import React from 'react';

interface PersonalInfoFieldsProps {
    fullName: string;
    email: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInfoFields({ fullName, email, onChange }: PersonalInfoFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Personal Info</span>
                <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Full Name</label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={fullName}
                        onChange={onChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={email}
                        readOnly
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed select-none"
                    />
                </div>
            </div>
        </div>
    );
}
