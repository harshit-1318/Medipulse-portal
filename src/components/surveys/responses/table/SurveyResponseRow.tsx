import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { SurveyResponse } from '@/types/survey';

interface SurveyResponseRowProps {
    resp: SurveyResponse;
    surveyId?: string;
    onSelectResponse: (resp: SurveyResponse) => void;
    onDeleteResponse: (sessionId: string) => void;
    formatDate: (iso?: string) => string;
}

export const SurveyResponseRow: React.FC<SurveyResponseRowProps> = ({
    resp,
    surveyId,
    onSelectResponse,
    onDeleteResponse,
    formatDate,
}) => {
    const customerName = resp?.customer?.name || resp?.customerName || 'Anonymous Customer';
    const customerEmail = resp?.customer?.email || resp?.customerEmail || '—';
    const surveyTitle = resp?.survey?.title || resp?.surveyTitle || '—';
    const submittedDate = resp?.submittedAt || resp?.createdAt;
    const source = resp?.metadata?.source ?? 'email';
    const targetSessionId = resp?.sessionId || resp?._id;

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-800">{customerName}</p>
                <p className="text-xs text-slate-400">{customerEmail}</p>
            </td>
            {!surveyId && (
                <td className="px-6 py-4 text-sm text-slate-600">
                    {surveyTitle}
                </td>
            )}
            <td className="px-6 py-4 text-sm text-slate-500">
                {formatDate(submittedDate)}
            </td>
            <td className="px-6 py-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                    {source}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onSelectResponse(resp)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                        title="View response"
                    >
                        <Eye size={15} />
                    </button>
                    {surveyId && (
                        <button
                            onClick={() => {
                                if (window.confirm('Delete this response?') && targetSessionId) {
                                    onDeleteResponse(targetSessionId);
                                }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete response"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};
