import React from 'react';
import { Eye } from 'lucide-react';
import LeadStatusBadge from '../components/LeadStatusBadge';
import type { Lead } from '@/types/lead';
import { ActionButton } from '@/components/common';

interface LeadTableRowProps {
    lead: Lead;
    onSelectLead: (id: string) => void;
    formatDate: (iso: string) => string;
}

export const LeadTableRow: React.FC<LeadTableRowProps> = ({ lead, onSelectLead, formatDate }) => {
    return (
        <tr
            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
            onClick={() => onSelectLead(lead._id)}
        >
            <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-800">{lead.customer.name}</p>
                <p className="text-xs text-slate-400">{lead.customer.email}</p>
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
                {lead.survey.title}
            </td>
            <td className="px-6 py-4">
                <LeadStatusBadge status={lead.status} />
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
                {lead.assignedTo?.username ?? (
                    <span className="text-slate-300">Unassigned</span>
                )}
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
                {formatDate(lead.createdAt)}
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
                {lead.notesCount ?? 0}
            </td>
            <td className="px-6 py-4 text-right">
                <ActionButton
                    icon={Eye}
                    label="View"
                    variant="cyan"
                    onClick={e => { e.stopPropagation(); onSelectLead(lead._id); }}
                    className="w-[78px] h-[32px] ml-auto"
                />
            </td>
        </tr>
    );
};
