import React, { useState, useEffect } from 'react';
import PersonalInfoFields from './PersonalInfoFields';
import PasswordField from './PasswordField';
import FormActions from './FormActions';
import { useUserStore } from '@/store';

export default function AccountForm() {
    const { user } = useUserStore();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        oldPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.username || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <PersonalInfoFields 
                fullName={formData.fullName} 
                email={formData.email} 
                onChange={handleChange} 
            />

            <div className="pt-6 space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Security</span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PasswordField 
                        label="Old Password" 
                        name="oldPassword" 
                        value={formData.oldPassword} 
                        placeholder="Enter current password" 
                        onChange={handleChange} 
                    />
                    <PasswordField 
                        label="New Password" 
                        name="newPassword" 
                        value={formData.newPassword} 
                        placeholder="Create new password" 
                        onChange={handleChange} 
                    />
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                        Enter passwords only if you wish to change them.
                    </p>
                </div>
            </div>

            <FormActions />
        </form>
    );
}
