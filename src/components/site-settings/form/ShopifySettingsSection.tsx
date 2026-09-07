import React, { useState } from "react";
import { ShoppingBag, Globe, Link } from "lucide-react";
import { ShopifyCredentialsFields } from "./ShopifyCredentialsFields";

interface Props {
    form: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
}

export const ShopifySettingsSection: React.FC<Props> = ({ form, handleChange }) => {
    const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

    const toggleToken = (name: string) => {
        setShowTokens(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <ShoppingBag size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Shopify Integration</h3>
            </div>
            <div className="p-5 flex flex-col gap-5 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                            <span>Shopify Domain</span>
                        </label>
                        <div className="relative group">
                            <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                            <input
                                name="shop" value={form.shop} onChange={handleChange}
                                placeholder="your-store.myshopify.com"
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                            <span>API Version</span>
                        </label>
                        <div className="relative group">
                            <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                            <input
                                name="api_version" value={form.api_version} onChange={handleChange}
                                placeholder="2024-01"
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <ShopifyCredentialsFields
                    form={form}
                    handleChange={handleChange}
                    showTokens={showTokens}
                    toggleToken={toggleToken}
                />
            </div>
        </div>
    );
};
