import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{title}</p>
                <div className="text-slate-400">{icon}</div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
        </div>
    );
}
