import { Trash2, ChevronRight } from 'lucide-react';

interface DocmanJobActionsProps {
    fileUrl?: string;
    jobId: string;
    onDelete: (id: string) => void;
}

export function DocmanJobActions({ fileUrl, jobId, onDelete }: DocmanJobActionsProps) {
    return (
        <div className="flex items-center justify-end gap-2 transition-all duration-300">
            <button
                onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                disabled={!fileUrl}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
            >
                View
                <ChevronRight size={12} strokeWidth={4} />
            </button>
            <button
                onClick={() => onDelete(jobId)}
                className="flex items-center justify-center p-2 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Delete Job"
            >
                <Trash2 size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
}
