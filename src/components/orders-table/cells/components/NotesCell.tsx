import { ChevronDown, ChevronUp } from "lucide-react";

interface NotesCellProps {
    isExpanded: boolean;
    onToggle: (e: React.MouseEvent) => void;
}

export function NotesCell({ isExpanded, onToggle }: NotesCellProps) {
    return (
        <button
            onClick={onToggle}
            className={`p-2 rounded-xl transition-all duration-300 ${
                isExpanded
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                    : "text-slate-400 group-hover:bg-white group-hover:text-amber-600 border border-transparent group-hover:border-slate-200"
            }`}
        >
            {isExpanded
                ? <ChevronUp size={16} strokeWidth={2.5} />
                : <ChevronDown size={16} strokeWidth={2.5} />}
        </button>
    );
}
