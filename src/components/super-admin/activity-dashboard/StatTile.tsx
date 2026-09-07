import React from 'react';

interface StatTileProps {
    label: string;
    value: number | string;
    sub?: string;
    accent?: string;
    icon: React.ReactNode;
    tooltip?: string;
}

export function StatTile({ label, value, sub, accent, icon, tooltip }: StatTileProps) {
    return (
        <div
            className={`rounded-xl border p-4 flex flex-col gap-1 ${accent ?? "border-slate-200 bg-white"}`}
            title={tooltip}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                <span className="text-slate-400">{icon}</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">
                {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {sub && <span className="text-xs text-slate-400">{sub}</span>}
        </div>
    );
}
