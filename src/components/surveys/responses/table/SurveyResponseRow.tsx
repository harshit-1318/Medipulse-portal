import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { SurveyResponse } from '@/types/survey';

interface SurveyResponseRowProps {
    resp: SurveyResponse;
    surveyId?: string;
    onSelectResponse: (resp: SurveyResponse) => void;
    onDeleteResponse: (sessionId: string) => void;
    formatDate: (iso: string) => string;
}

export const SurveyResponseRow: React.FC<SurveyResponseRowProps> = ({
    resp,
    surveyId,
    onSelectResponse,
    onDeleteResponse,
    formatDate,
}) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-4">
            <p className="text-sm font-semibold text-slate-800">{resp.customer.name}</p>
            <p className="text-xs text-slate-400">{resp.customer.email}</p>
        </td>
        {!surveyId && (
            <td className="px-6 py-4 text-sm text-slate-600">
                {resp.survey.title}
            </td>
        )}
        <td className="px-6 py-4 text-sm text-slate-500">
            {formatDate(resp.submittedAt)}
        </td>
        <td className="px-6 py-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                {resp.metadata?.source ?? 'email'}
            </span>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onSelectResponse(resp)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors"
                    title="View response"
                >
                    <Eye size={15} />
                </button>
                {surveyId && (
                    <button
                        onClick={() => {
                            if (window.confirm('Delete this response?')) {
                                onDeleteResponse(resp._id);
                            }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete response"
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>
        </td>
    </tr>
);
