import { ArrowLeft, History } from 'lucide-react';
import type { SurveyStatus } from '@/types/survey';
import { SurveyToolbarActions } from './SurveyToolbarActions';

interface SurveyBuilderToolbarProps {
    title: string;
    onTitleChange: (t: string) => void;
    status?: SurveyStatus;
    onSaveDraft: () => void;
    onPublish: () => void;
    onUnpublish: () => void;
    onShowVersionHistory: () => void;
    isSaving: boolean;
    isPublishing: boolean;
    isDirty: boolean;
    surveyId: string | null;
}

export default function SurveyBuilderToolbar({
    title, onTitleChange, status,
    onSaveDraft, onPublish, onUnpublish, onShowVersionHistory,
    isSaving, isPublishing, isDirty, surveyId,
}: SurveyBuilderToolbarProps) {
    return (
        <div className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 shrink-0 z-20 shadow-sm">
            <a
                href="/surveys"
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                title="Back to surveys"
            >
                <ArrowLeft size={18} />
            </a>

            <div className="w-px h-6 bg-slate-200" />

            <input
                type="text"
                value={title}
                onChange={e => onTitleChange(e.target.value)}
                placeholder="Survey title..."
                className="flex-1 min-w-0 text-sm font-semibold text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-400 focus:ring-0"
            />

            {status && (
                <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                    {status === 'published' ? 'Published' : 'Draft'}
                </span>
            )}

            {surveyId && (
                <button
                    onClick={onShowVersionHistory}
                    className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Version history"
                >
                    <History size={15} />
                    History
                </button>
            )}

            <div className="w-px h-6 bg-slate-200" />

            <SurveyToolbarActions
                status={status}
                onSaveDraft={onSaveDraft}
                onPublish={onPublish}
                onUnpublish={onUnpublish}
                isSaving={isSaving}
                isPublishing={isPublishing}
                isDirty={isDirty}
            />
        </div>
    );
}

