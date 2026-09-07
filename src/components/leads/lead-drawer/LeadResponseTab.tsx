import React from 'react';

interface LeadResponseTabProps {
    submittedResponse?: Record<string, any>;
}

export const LeadResponseTab: React.FC<LeadResponseTabProps> = ({ submittedResponse }) => {
    if (!submittedResponse) {
        return <p className="text-sm text-slate-400 text-center py-8">No response data</p>;
    }

    return (
        <div className="space-y-3">
            {Object.entries(submittedResponse).map(([key, val]) => (
                <div key={key} className="py-3 border-b border-slate-50">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{key}</p>
                    <p className="text-sm text-slate-800">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </p>
                </div>
            ))}
        </div>
    );
};
