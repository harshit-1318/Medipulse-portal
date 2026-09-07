import { ArrowLeft } from 'lucide-react';
import type { Survey } from '@/types/survey';

interface SurveyViewHeaderProps {
    survey: Survey;
}

export function SurveyViewHeader({ survey }: SurveyViewHeaderProps) {
    return (
        <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm relative">
            <div className="flex items-center space-x-4">
                <a
                    href="/surveys"
                    className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors flex items-center"
                    title="Back to Surveys"
                >
                    <ArrowLeft className="w-5 h-5" />
                </a>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                        {survey.title || 'Untitled Survey'}
                    </h1>
                    {survey.description && (
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{survey.description}</p>
                    )}
                </div>
            </div>
            
            <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Read Only
                </span>
                <a
                    href={`/surveys/${survey._id}/edit`}
                    className="px-4 py-2 text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-slate-100"
                >
                    Edit Survey
                </a>
            </div>
        </div>
    );
}
