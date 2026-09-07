import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { SurveyResponse } from '@/types/survey';
import { ResponseField } from './ResponseField';

interface ResponseMetaSectionsProps {
    response: SurveyResponse;
    formatDate: (iso: string) => string;
}

export const ResponseMetaSections: React.FC<ResponseMetaSectionsProps> = ({ response, formatDate }) => (
    <>
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Customer</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-1">
                <p className="text-sm font-semibold text-slate-800">{response.customer.name}</p>
                <p className="text-sm text-slate-500">{response.customer.email}</p>
            </div>
        </section>

        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Survey</h3>
            <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-800">{response.survey.title}</p>
            </div>
        </section>

        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Submission Info</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <ResponseField label="Source" value={response.metadata?.source} />
                <ResponseField label="IP Address" value={response.metadata?.ipAddress} />
                <ResponseField label="Submitted At" value={formatDate(response.submittedAt)} />
                {response.leadId && (
                    <div className="pt-2 border-t border-slate-100">
                        <a
                            href={`/leads/${response.leadId}`}
                            className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                        >
                            <ExternalLink size={13} />
                            View Lead Record
                        </a>
                    </div>
                )}
            </div>
        </section>
    </>
);
