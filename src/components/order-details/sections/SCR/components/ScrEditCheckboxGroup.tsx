import React from 'react';
import { CheckCircle2, ShieldCheck, Fingerprint } from 'lucide-react';

interface ScrEditCheckboxGroupProps {
    scrFlags: {
        consultation_reviewed: boolean;
        image_id_verified: boolean;
        scr_accessed: boolean;
    };
    handleToggle: (key: any) => void;
    isReadOnly: boolean;
    isCancelled?: boolean;
}

export const ScrEditCheckboxGroup: React.FC<ScrEditCheckboxGroupProps> = ({
    scrFlags,
    handleToggle,
    isReadOnly,
    isCancelled = false,
}) => (
    <div className="space-y-2">
        {[
            { key: "consultation_reviewed", label: "Consultation Reviewed", icon: <CheckCircle2 size={16} /> },
            { key: "image_id_verified", label: "Image & ID Verified", icon: <ShieldCheck size={16} /> },
            { key: "scr_accessed", label: "SCR Accessed", icon: <Fingerprint size={16} /> },
        ].map(({ key, label, icon }) => (
            <label
                key={key}
                className="flex items-center justify-between cursor-pointer group/cb p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover/cb:text-emerald-500 transition-colors">{icon}</span>
                    <span className={`text-[14px] font-medium transition-colors ${scrFlags[key as keyof typeof scrFlags] ? "text-slate-900" : "text-slate-600"}`}>
                        {label}
                    </span>
                </div>
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={scrFlags[key as keyof typeof scrFlags]}
                        onChange={() => handleToggle(key as keyof typeof scrFlags)}
                        disabled={isReadOnly || isCancelled}
                        style={{ accentColor: '#10b981' }}
                        className="peer h-5 w-5 rounded-md border-2 border-slate-200 text-emerald-600 focus:ring-emerald-500/20 transition-all cursor-pointer checked:bg-emerald-500 disabled:opacity-50"
                    />
                </div>
            </label>
        ))}
    </div>
);
