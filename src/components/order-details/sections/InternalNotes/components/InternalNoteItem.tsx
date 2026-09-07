import { useState } from "react";
import type { InternalNote } from "@/api/services/orders/internalNotesService";
import { NoteItemHeader } from "./NoteItemHeader";
import { NoteItemActions } from "./NoteItemActions";

interface InternalNoteItemProps {
    note: InternalNote;
    index: number;
    total: number;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string) => void;
    isDeleting: boolean;
    isUpdating: boolean;
}

export function InternalNoteItem({ note, index, total, onDelete, onUpdate, isDeleting, isUpdating }: InternalNoteItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(note.note);

    const handleSave = () => { if (!editText.trim()) return; onUpdate(note._id, editText); setIsEditing(false); };

    const userName = note.user_id && typeof note.user_id === "object" ? (note.user_id as any).name : (note.user_id as string) || "System";
    const dateStr = note.createdAt || note.created_at;
    const formattedDate = dateStr ? new Date(dateStr).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "") : "";

    return (
        <div className="relative flex gap-3 group/item py-1">
            <div className="relative z-10 pt-0.5">
                <div className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover/item:border-orange-400 group-hover/item:bg-orange-50 transition-all">
                    <span className="text-text-primary text-[10px] font-bold">{total - index}</span>
                </div>
            </div>

            <div className="flex-1 rounded-lg bg-white border border-slate-100 shadow-sm p-1.5 px-3 relative transition-all group-hover/item:border-orange-100">
                <div className="flex justify-between items-start gap-4 mb-1">
                    <NoteItemHeader userName={userName} formattedDate={formattedDate} />
                    <NoteItemActions isEditing={isEditing} onEdit={() => setIsEditing(true)} onDelete={() => onDelete(note._id)} isDeleting={isDeleting} />
                </div>

                {isEditing ? (
                    <div className="space-y-2 mt-1">
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-200 transition-all min-h-[60px] resize-none" />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-text-secondary text-[11px] font-bold hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave} disabled={isUpdating} className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-[11px] font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-sm">
                                {isUpdating ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-600 text-[11.5px] leading-snug whitespace-pre-wrap wrap-break-word font-medium pl-1 border-l border-slate-200 mt-0">
                        {note.note}
                    </div>
                )}
            </div>
        </div>
    );
}
