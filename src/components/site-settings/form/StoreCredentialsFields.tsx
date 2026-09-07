import React from "react";
import { Eye, EyeOff, KeyRound, Lock, ShieldAlert } from "lucide-react";

interface StoreCredentialsFieldsProps {
    form: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    showTokens: Record<string, boolean>;
    toggleToken: (name: string) => void;
}

export function StoreCredentialsFields({
    form,
    handleChange,
    showTokens,
    toggleToken,
}: StoreCredentialsFieldsProps) {
    const renderSensitiveInput = (label: string, name: string, icon: React.ReactNode) => (
        <div className="space-y-1.5">
            <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                <span>{label}</span>
                <span className="text-[11px] text-slate-400 normal-case tracking-normal font-medium flex items-center gap-1">
                    <ShieldAlert size={10} /> Sensitive
                </span>
            </label>
            <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                    {icon}
                </span>
                <input
                    type={showTokens[name] ? "text" : "password"}
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    placeholder="••••••••••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                />
                <button
                    type="button"
                    onClick={() => toggleToken(name)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    {showTokens[name] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSensitiveInput("Access Token", "access_token", <KeyRound size={18} />)}
                {renderSensitiveInput("Webhook Secret", "webhook_secret", <Lock size={18} />)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSensitiveInput("API Key", "api_key", <KeyRound size={18} />)}
                {renderSensitiveInput("API Secret", "api_secret", <Lock size={18} />)}
            </div>
        </>
    );
}
