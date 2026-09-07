import React from 'react';
import { Save, Globe, Globe2, Loader2 } from 'lucide-react';
import type { SurveyStatus } from '@/types/survey';

interface SurveyToolbarActionsProps {
    status?: SurveyStatus;
    onSaveDraft: () => void;
    onPublish: () => void;
    onUnpublish: () => void;
    isSaving: boolean;
    isPublishing: boolean;
    isDirty: boolean;
}

export const SurveyToolbarActions: React.FC<SurveyToolbarActionsProps> = ({
    status,
    onSaveDraft,
    onPublish,
    onUnpublish,
    isSaving,
    isPublishing,
    isDirty,
}) => (
    <>
        <button
            onClick={onSaveDraft}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
            {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" />}
        </button>

        {status === 'published' ? (
            <button
                onClick={onUnpublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 disabled:opacity-50 transition-colors"
            >
                <Globe2 size={14} />
                Unpublish
            </button>
        ) : (
            <button
                onClick={onPublish}
                disabled={isSaving || isPublishing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-sm font-semibold text-white disabled:opacity-50 transition-colors shadow-sm"
            >
                {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                Publish
            </button>
        )}
    </>
);
