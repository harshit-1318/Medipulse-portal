import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBg?: string;
    iconColor?: string;
    subtext?: string;
}

export function StatCard({
    title,
    value,
    icon,
    iconBg = "bg-teal-50",
    iconColor = "text-[#00A294]",
    subtext,
}: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">{title}</p>
                <div className={`p-2 rounded-lg ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105 shadow-xs`}>
                    {icon}
                </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value.toLocaleString()}</p>
                {subtext && <span className="text-[11px] text-slate-400 font-medium">{subtext}</span>}
            </div>
        </div>
    );
}
