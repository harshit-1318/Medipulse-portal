import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { useInternalNotes } from "@/components/order-details/hooks/useInternalNotes";
import { InternalNoteInput } from "./components/InternalNoteInput";
import { InternalNoteItem } from "./components/InternalNoteItem";
import { InternalNotesListState } from "./components/InternalNotesListState";

interface InternalNotesSectionProps {
    orderId: string;
    isParked?: boolean;
    isCancelled?: boolean;
}

export function InternalNotesSection({ orderId, isParked = false, isCancelled = false }: InternalNotesSectionProps) {
    const [isParkConfirmed, setIsParkConfirmed] = useState(false);
    const { notes, isLoading, isError, addNote, isAdding, deleteNote, isDeleting, updateNote, isUpdating, parkOrder, isParking } = useInternalNotes(orderId);

    const handleDelete = (noteId: string) => {
        if (confirm("Are you sure you want to delete this note?")) deleteNote(noteId);
    };

    const handlePark = () => {
        parkOrder(undefined, { onSuccess: () => setIsParkConfirmed(true) });
    };

    const validNotes = notes.filter(n => n.note && n.note.trim() !== "");

    return (
        <div className="order-detail-card group my-2">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-50/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="section-header justify-between py-2 relative z-10 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="section-icon-wrapper bg-orange-50 text-orange-600">
                        <ClipboardList size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="section-title">Internal Notes</h3>
                            {validNotes.length > 0 && (
                                <span className="bg-orange-100 text-orange-600 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                                    {validNotes.length}
                                </span>
                            )}
                        </div>
                        <p className="section-subtitle">Team Communication</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="pt-3 px-1.5 pb-0">
                    <InternalNoteInput onAdd={addNote} isPending={isAdding} onPark={handlePark} isParking={isParking} isParked={isParked || isParkConfirmed} isCancelled={isCancelled} />

                    <div className="relative pt-0">
                        <div className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            <div className="space-y-1 relative">
                                <div className="absolute left-[11px] top-4 bottom-0 w-px bg-slate-100" />

                                <InternalNotesListState
                                    isLoading={isLoading}
                                    isError={isError}
                                    hasNotes={validNotes.length > 0}
                                />

                                <div className="space-y-1">
                                    {validNotes.map((note, index, filteredArray) => (
                                        <InternalNoteItem
                                            key={note._id}
                                            note={note}
                                            index={index}
                                            total={filteredArray.length}
                                            onDelete={handleDelete}
                                            onUpdate={(id, text) => updateNote({ noteId: id, text })}
                                            isDeleting={isDeleting}
                                            isUpdating={isUpdating}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InternalNotesSection;

