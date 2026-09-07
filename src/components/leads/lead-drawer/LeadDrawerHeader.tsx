import { X, ExternalLink } from 'lucide-react';
import { StatusSelector } from './StatusSelector';

interface LeadDrawerHeaderProps {
    lead: any;
    onClose: () => void;
    handleStatusChange: (s: any) => void;
    isUpdatingStatus: boolean;
}

export function LeadDrawerHeader({ lead, onClose, handleStatusChange, isUpdatingStatus }: LeadDrawerHeaderProps) {
    return (
        <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div>
                    <p className="font-semibold text-slate-800">Lead Detail</p>
                    {lead && (
                        <p className="text-xs text-slate-400 mt-0.5">
                            from {lead.survey.title}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {lead?._id && (
                        <a
                            href={`/leads/${lead._id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition-colors"
                        >
                            <ExternalLink size={16} />
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-semibold text-slate-800">{lead.customer.name}</p>
                        <p className="text-sm text-slate-500">{lead.customer.email}</p>
                        {lead.customer.phone && (
                            <p className="text-sm text-slate-400">{lead.customer.phone}</p>
                        )}
                    </div>
                    <StatusSelector
                        current={lead.status}
                        onChange={handleStatusChange}
                        disabled={isUpdatingStatus}
                    />
                </div>
                {lead.assignedTo && (
                    <p className="text-xs text-slate-500">
                        Assigned to: <span className="font-medium">{lead.assignedTo.username}</span>
                    </p>
                )}
            </div>
        </>
    );
}
