import React from 'react';
import type { Survey } from '@/types/survey';
import SurveyStatusBadge from '../components/SurveyStatusBadge';
import { SurveyActionMenu } from './SurveyActionMenu';

interface SurveyTableRowProps {
    survey: Survey;
    formatDate: (iso: string) => string;
    handleDelete: (id: string) => void;
    handleDuplicate: (id: string, title: string) => void;
}

export const SurveyTableRow: React.FC<SurveyTableRowProps> = ({
    survey,
    formatDate,
    handleDelete,
    handleDuplicate,
}) => (
    <tr className="hover:bg-slate-50/50 transition-colors group">
        <td className="px-6 py-4">
            <div>
                <a
                    href={`/surveys/${survey._id}/edit`}
                    className="font-semibold text-slate-800 hover:text-teal-600 transition-colors text-sm"
                >
                    {survey.title}
                </a>
                {survey.description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">
                        {survey.description}
                    </p>
                )}
            </div>
        </td>
        <td className="px-6 py-4">
            <SurveyStatusBadge status={survey.status} />
        </td>
        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
            {survey.completedSessions ?? 0}
            <span className="text-slate-400 text-xs font-normal">
                {' '}/ {survey.totalSessions ?? 0} sent
            </span>
        </td>
        <td className="px-6 py-4 text-sm text-slate-500">
            v{survey.currentVersion}
        </td>
        <td className="px-6 py-4 text-sm text-slate-500">
            {formatDate(survey.createdAt)}
        </td>
        <td className="px-6 py-4">
            <SurveyActionMenu
                survey={survey}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
            />
        </td>
    </tr>
);
