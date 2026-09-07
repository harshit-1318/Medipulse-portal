import React from 'react';

interface PrescriptionRowItemProps {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}

export function PrescriptionRowItem({ icon, label, children }: PrescriptionRowItemProps) {
    return (
        <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-[38px]">
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-gray-400 shrink-0">{icon}</span>
                <span className="text-text-secondary font-medium text-[13px] shrink-0">{label}</span>
            </div>
            {children}
        </div>
    );
}
