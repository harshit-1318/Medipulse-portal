import React from "react";
import { Image as ImageIcon } from "lucide-react";

interface GeneralBrandingFieldsProps {
    form: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    domainsText: string;
    handleDomainsChange: (text: string) => void;
}

export function GeneralBrandingFields({
    form,
    handleChange,
    domainsText,
    handleDomainsChange,
}: GeneralBrandingFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                        <span>Logo URL</span>
                    </label>
                    <div className="relative group">
                        <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            name="logo" type="url" value={form.logo} onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                        <span>Small Icon URL</span>
                    </label>
                    <div className="relative group">
                        <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                        <input
                            name="small_icon_url" type="url" value={form.small_icon_url} onChange={handleChange}
                            placeholder="https://example.com/icon.png"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 mt-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                    <span>Configuration Domains</span>
                </label>
                <div className="relative flex flex-col gap-1">
                    <textarea
                        value={domainsText}
                        onChange={(e) => handleDomainsChange(e.target.value)}
                        rows={3}
                        placeholder="example.com&#10;www.example.com"
                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[96px] resize-y"
                    />
                    <p className="text-[11px] text-slate-400 font-medium ml-1">One domain per line or comma separated. First resolved domain acts as primary.</p>
                </div>
            </div>
        </>
    );
}
