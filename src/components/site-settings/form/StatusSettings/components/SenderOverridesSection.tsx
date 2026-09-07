import React from "react";
import { Mail } from "lucide-react";
import { TEMPLATE_ENTRIES } from "./templateEntries";

interface Props {
    senderOverrides: Record<string, string>;
    onChange: (templateKey: string, value: string) => void;
}

export const SenderOverridesSection: React.FC<Props> = ({ senderOverrides, onChange }) => (
    <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
            <Mail size={15} className="text-indigo-500" />
            <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">
                Per-Template From Address
            </span>
        </div>
        <p className="text-[12px] text-slate-400 leading-relaxed -mt-1">
            Override the default "from" address for specific email types.
            Leave blank to use the site default above.
        </p>

        <div className="space-y-3">
            {TEMPLATE_ENTRIES.map(({ key, label, hint }) => (
                <div key={key} className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">
                        {label}
                    </label>
                    <p className="text-[11px] text-slate-400 ml-1 -mt-0.5">{hint}</p>
                    <div className="relative group">
                        <Mail
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none"
                        />
                        <input
                            type="email"
                            value={senderOverrides[key] ?? ""}
                            onChange={(e) => onChange(key, e.target.value)}
                            placeholder={`e.g. reminders@clinic.co.uk`}
                            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-700 placeholder:text-slate-300 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
