import { Trash2, Eye } from 'lucide-react';
import { ActionButton } from '@/components/common';

interface DocmanJobActionsProps {
    fileUrl?: string;
    jobId: string;
    onDelete: (id: string) => void;
}

export function DocmanJobActions({ fileUrl, jobId, onDelete }: DocmanJobActionsProps) {
    return (
        <div className="flex items-center justify-end gap-2 transition-all duration-300">
            <ActionButton
                icon={Eye}
                label="View"
                variant="cyan"
                disabled={!fileUrl}
                onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                className="w-[78px] h-[32px]"
            />
            <button
                type="button"
                onClick={() => onDelete(jobId)}
                className="h-[32px] w-[34px] rounded-[8px] bg-white border border-rose-200 text-rose-600 hover:bg-rose-50/50 hover:border-rose-300 flex items-center justify-center hover:-translate-y-[1.5px] active:translate-y-0 transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(225,29,72,0.12)]"
                title="Delete Job"
            >
                <Trash2 size={14} strokeWidth={2.2} />
            </button>
        </div>
    );
}
