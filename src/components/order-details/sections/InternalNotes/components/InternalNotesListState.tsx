import React from 'react';

interface InternalNotesListStateProps {
    isLoading: boolean;
    isError: boolean;
    hasNotes: boolean;
}

export const InternalNotesListState: React.FC<InternalNotesListStateProps> = ({
    isLoading,
    isError,
    hasNotes,
}) => {
    if (isLoading) {
        return (
            <div className="pl-14 py-2 flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                <span className="text-text-secondary font-medium text-[12px] ml-2">Loading team notes...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="pl-14 py-2">
                <div className="status-badge badge-error">
                    <span className="status-badge-dot" />
                    Failed to retrieve notes
                </div>
            </div>
        );
    }

    if (!hasNotes) {
        return (
            <div className="pl-14 py-1">
                <p className="text-text-secondary italic font-medium text-[13px]">No notes recorded.</p>
                <p className="text-text-secondary text-[11px] font-medium mt-1">Status: Clean History</p>
            </div>
        );
    }

    return null;
};
