import { Building2, Globe, Link, Briefcase } from "lucide-react";
import { GeneralBrandingFields } from "./GeneralBrandingFields";

interface Props {
    form: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleDomainsChange: (text: string) => void;
    domainsText: string;
}

export const GeneralSettingsSection: React.FC<Props> = ({
    form,
    handleChange,
    handleDomainsChange,
    domainsText
}) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Building2 size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">General Details</h3>
            </div>
            <div className="p-5 flex flex-col gap-5 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                            <span>Site Name</span>
                            <span className="text-[10px] text-red-500 normal-case tracking-normal font-medium">Required</span>
                        </label>
                        <div className="relative group">
                            <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                            <input
                                name="site_name" value={form.site_name} onChange={handleChange}
                                placeholder="MediPulse UK"
                                className={`w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none ${!form.site_name?.length ? "border-red-300" : "border-slate-200"}`}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                            <span>Site Key</span>
                        </label>
                        <div className="relative group">
                            <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                name="site_key" value={form.site_key} readOnly
                                placeholder="auto-generated"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-100 border border-slate-200 text-[14px] font-bold text-slate-500 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                            <span>Primary Domain</span>
                            <span className="text-[10px] text-red-500 normal-case tracking-normal font-medium">Required</span>
                        </label>
                        <div className="relative group">
                            <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                            <input
                                name="primary_domain" value={form.primary_domain} onChange={handleChange}
                                placeholder="example.co.uk"
                                className={`w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none ${!form.primary_domain?.length ? "border-red-300" : "border-slate-200"}`}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                            <span>Company Name</span>
                        </label>
                        <div className="relative group">
                            <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                            <input
                                name="company_name" value={form.company_name} onChange={handleChange}
                                placeholder="MediPulse Health Ltd"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <GeneralBrandingFields
                    form={form}
                    handleChange={handleChange}
                    domainsText={domainsText}
                    handleDomainsChange={handleDomainsChange}
                />
            </div>
        </div>
    );
};
