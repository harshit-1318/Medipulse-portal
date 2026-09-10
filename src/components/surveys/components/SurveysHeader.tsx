import { Plus } from 'lucide-react';

export default function SurveysHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
                <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
                    Surveys
                </h1>
            </div>
            <a
                href="/surveys/create"
                className="inline-flex items-center gap-2 bg-[#00A294] hover:bg-[#008F83] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm active:scale-95"
            >
                <Plus size={16} strokeWidth={2.5} />
                Create Survey
            </a>
        </div>
    );
}
