import React, { useMemo } from "react";
import { Building2, Globe2, KeyRound, Link2, Calendar } from "lucide-react";
import { SiteDetailItem } from "./SiteDetailItem";
import { getSiteStatusConfig } from "../utils/siteStatusConfig";

interface Props {
    site: any;
    loadingSite: boolean;
}

export const SiteInfoPanel: React.FC<Props> = ({ site, loadingSite }) => {
    const statusConfig = useMemo(() => getSiteStatusConfig(site?.status), [site?.status]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="h-24 w-24 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 flex items-center justify-center shrink-0">
                    {loadingSite ? (
                        <div className="h-full w-full rounded-lg bg-slate-100 animate-pulse" />
                    ) : site?.logo ? (
                        <img src={site.logo} alt="Site Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                        <div className="text-slate-300"><Building2 size={40} /></div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left pt-2">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <h1 className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                            {loadingSite ? (
                                <div className="h-7 w-48 bg-slate-100 animate-pulse rounded-md mb-1" />
                            ) : (
                                site?.name || "Unknown Site"
                            )}
                        </h1>

                        {loadingSite ? (
                            <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-md" />
                        ) : (
                            <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1.5 transition-all duration-300 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                {statusConfig.label}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <SiteDetailItem 
                    icon={<Globe2 size={18} />} 
                    label="PRIMARY DOMAIN" 
                    value={site?.primaryDomain} 
                    loading={loadingSite} 
                    iconBg="bg-blue-50 text-blue-600"
                />
                <SiteDetailItem 
                    icon={<KeyRound size={18} />} 
                    label="SITE KEY" 
                    value={site?.key} 
                    loading={loadingSite} 
                    copyable 
                    iconBg="bg-amber-50 text-amber-600"
                />
                <SiteDetailItem 
                    icon={<Building2 size={18} />} 
                    label="COMPANY" 
                    value={site?.companyName} 
                    loading={loadingSite} 
                    iconBg="bg-slate-100 text-[#475569]"
                />
                <SiteDetailItem 
                    icon={<Link2 size={18} />} 
                    label="SHOP URL" 
                    value={site?.shop || (site?.shopifyUrl ? site.shopifyUrl : '')} 
                    loading={loadingSite} 
                    external 
                    iconBg="bg-emerald-50 text-emerald-600"
                />
                <SiteDetailItem 
                    icon={<Calendar size={18} />} 
                    label="CREATED AT" 
                    value={site?.createdAt ? new Date(site.createdAt).toLocaleDateString() : '-'} 
                    loading={loadingSite} 
                    iconBg="bg-purple-50 text-purple-600"
                />
            </div>
        </div>
    );
};
