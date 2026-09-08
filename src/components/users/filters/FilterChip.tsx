import { X } from 'lucide-react';

interface FilterChipProps {
    label: string;
    onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00a294]/8 border border-[#00a294]/20 rounded-lg text-xs font-semibold text-[#00a294] shadow-xs animate-in zoom-in-95 duration-200">
            <span>{label}</span>
            <button
                type="button"
                onClick={onRemove}
                className="p-0.5 hover:bg-[#00a294]/15 rounded-md transition-colors text-[#00a294]/70 hover:text-[#00a294]"
                aria-label="Remove filter"
            >
                <X size={13} strokeWidth={2.5} />
            </button>
        </div>
    );
}
