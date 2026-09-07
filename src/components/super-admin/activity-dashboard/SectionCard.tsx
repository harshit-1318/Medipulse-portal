import React from 'react';

interface SectionCardProps {
    title: string;
    icon: React.ReactNode;
    badge?: string | number;
    children: React.ReactNode;
}

export function SectionCard({ title, icon, badge, children }: SectionCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <span className="text-indigo-600">{icon}</span>
                <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
                {badge !== undefined && (
                    <span className="ml-auto text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                        {typeof badge === "number" ? badge.toLocaleString() : badge}
                    </span>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
