import React from 'react';
import { UserCircle, Mail, ShieldCheck, Building2, Calendar, Settings } from 'lucide-react';

export const UsersTableHeader: React.FC = () => (
    <thead className="bg-[#f8fafc] border-b border-slate-200 font-montserrat sticky top-0 z-10 text-[14px] font-extrabold tracking-widest text-[#003B73]/80 uppercase">
        <tr>
            <th className="px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                    <UserCircle size={14} className="text-slate-400" />
                    <span>User Details</span>
                </div>
            </th>
            <th className="px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span>Email</span>
                </div>
            </th>
            <th className="px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-slate-400" />
                    <span>Role</span>
                </div>
            </th>
            <th className="px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span>Site Access</span>
                </div>
            </th>
            <th className="px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Created</span>
                </div>
            </th>
            <th className="px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                    <Settings size={14} className="text-slate-400" />
                    <span>Actions</span>
                </div>
            </th>
        </tr>
    </thead>
);
