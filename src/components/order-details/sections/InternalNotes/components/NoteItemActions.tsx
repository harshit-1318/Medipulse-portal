import { Pencil, X } from "lucide-react";

interface Props {
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export const NoteItemActions: React.FC<Props> = ({ isEditing, onEdit, onDelete, isDeleting }) => {
    if (isEditing) return null;

    return (
        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all duration-300">
            <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer"
                title="Edit Note"
            >
                <Pencil size={12} strokeWidth={2.5} />
            </button>
            <button
                onClick={onDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                title="Delete Note"
            >
                <X size={12} strokeWidth={2.5} />
            </button>
        </div>
    );
};
