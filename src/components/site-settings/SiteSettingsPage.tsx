import { useSiteSettings } from "./hooks/useSiteSettings";
import { QueryProvider } from "@/components/common/QueryProvider";
import { SiteSettingsHeader } from "./form/SiteSettingsHeader";
import { GeneralSettingsSection } from "./form/GeneralSettingsSection";
import { StoreSettingsSection } from "./form/StoreSettingsSection";
import { StatusSettingsSection } from "./form/StatusSettings/StatusSettingsSection";
import { SiteSettingsFooter } from "./form/SiteSettingsFooter";

interface Props {
    siteId?: string;
}

function SiteSettingsContent({ siteId }: Props) {
    const {
        form, loading, saving, handleChange, handleSwitchChange,
        handleDomainsChange, domainsText, submitForm, handleSenderOverrideChange
    } = useSiteSettings(siteId);

    const isEditMode = !!siteId;

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                <div className="h-10 bg-slate-200 rounded-xl w-48" />
                <div className="h-150 bg-slate-100 rounded-2xl w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-4 font-montserrat animate-in fade-in duration-500 pb-20 w-full px-4 md:px-6">
            <SiteSettingsHeader
                isEditMode={isEditMode} siteName={form.site_name}
                siteId={siteId} saving={saving} onSave={submitForm}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: General Details */}
                <div className="w-full">
                    <GeneralSettingsSection
                        form={form} handleChange={handleChange}
                        handleDomainsChange={handleDomainsChange} domainsText={domainsText}
                    />
                </div>

                {/* Right Column: Store Integrations */}
                <div className="w-full">
                    <StoreSettingsSection form={form} handleChange={handleChange} />
                </div>

                {/* Bottom Full Width: Master Integrations & Status */}
                <div className="lg:col-span-2 w-full">
                    <StatusSettingsSection
                        form={form}
                        handleChange={handleChange}
                        handleSwitchChange={handleSwitchChange}
                        handleSenderOverrideChange={handleSenderOverrideChange}
                    />
                </div>
            </div>

            <SiteSettingsFooter saving={saving} isEditMode={isEditMode} onSubmit={submitForm} />
        </div>
    );
}

export default function SiteSettingsPage(props: Props) {
    return (
        <QueryProvider>
            <SiteSettingsContent {...props} />
        </QueryProvider>
    );
}
