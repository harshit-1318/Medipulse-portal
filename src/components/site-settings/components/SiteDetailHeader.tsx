import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";

interface Props {
    siteId: string;
}

export const SiteDetailHeader: React.FC<Props> = ({ siteId }) => {
    const handleBack = () => {
        window.location.href = "/sites";
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                    <Building2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-[20px] font-bold text-slate-900 leading-tight">Site Details</h1>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleBack}
                    className="h-11 px-6 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5"
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                    <span className="font-montserrat leading-none mt-0.5">Back</span>
                </button>
                <button
                    onClick={() => window.location.href = `/sites/${siteId}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-lg shadow-sm transition-all active:scale-95 group shrink-0"
                >
                    Edit Configuration
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
