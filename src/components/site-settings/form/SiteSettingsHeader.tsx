import { ArrowLeft, Save, Plus, Globe, Settings } from "lucide-react";

interface HeaderProps {
    isEditMode: boolean;
    siteName?: string;
    siteId?: string;
    saving: boolean;
    onSave: () => void;
}

export const SiteSettingsHeader: React.FC<HeaderProps> = ({
    isEditMode,
    siteName,
    siteId,
    saving,
    onSave
}) => {
    const handleBack = () => {
        window.location.href = isEditMode ? `/sites/${siteId}` : '/sites';
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full pb-4">
            {/* Left Section (Back Arrow + Titles) */}
            <div className="flex items-start md:items-center gap-3">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none mb-1.5 flex items-center gap-2">
                        {isEditMode ? <Settings size={22} className="text-[#00a294]" /> : <Globe size={22} className="text-[#00a294]" />}
                        {isEditMode ? "Edit Configuration" : "Create New Site"}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 leading-none">
                        {isEditMode ? `Updating ${siteName}` : "Configure a new site instance"}
                    </p>
                </div>
            </div>

            {/* Right Section (Buttons Grouped) */}
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={handleBack}
                    className="h-11 px-6 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5"
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                    <span className="font-montserrat leading-none mt-0.5">Back</span>
                </button>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 h-11 bg-[#00A294] hover:bg-[#008F83] text-white font-bold text-[15px] rounded-full shadow-sm shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isEditMode ? <Save size={18} /> : <Plus size={18} />}
                    {saving ? "Saving..." : isEditMode ? "Update Changes" : "Create Site"}
                </button>
            </div>
        </div>
    );
};
