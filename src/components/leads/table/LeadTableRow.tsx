import React from 'react';
import LeadStatusBadge from '../components/LeadStatusBadge';
import type { Lead } from '@/types/lead';

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
                <button
                    onClick={e => { e.stopPropagation(); onSelectLead(lead._id); }}
                    className="h-8 px-3.5 rounded-lg text-[11.5px] font-bold font-montserrat tracking-wide bg-teal-50 text-[#00a294] border border-teal-200 hover:bg-teal-100 transition-all cursor-pointer shadow-xs"
                >
                    Open →
                </button>
            </td>
        </tr>
    );
};
