import { PlusCircle } from 'lucide-react';

export default function SurveysHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Surveys</h1>
                <p className="text-sm text-slate-500 mt-0.5">Create and manage your surveys</p>
            </div>
            <a
                href="/surveys/create"
                className="inline-flex items-center gap-2 bg-[#00a294] hover:bg-[#008f83] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
            >
                <PlusCircle size={16} />
                Create Survey
            </a>
        </div>
    );
}
