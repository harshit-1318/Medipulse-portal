import { useEffect, useState } from "react";
import { StickyNote } from "lucide-react";
import { internalNotesService, type InternalNote } from "@/api/services/orders/internalNotesService";

interface NotesExpandPanelProps {
    orderId: string;
}

export function NotesExpandPanel({ orderId }: NotesExpandPanelProps) {
    const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
    const [notes, setNotes] = useState<InternalNote[]>([]);

    useEffect(() => {
        internalNotesService.getNotes(orderId)
            .then((data) => {
                setNotes(data.filter(n => n.note && n.note.trim() !== ""));
                setState("loaded");
            })
            .catch(() => setState("error"));
    }, [orderId]);

    return (
        <div className="py-5 pl-14 pr-8 flex items-start gap-5 border-l-4 border-l-amber-400 my-3 rounded-r-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-y border-r border-slate-100">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 shrink-0 shadow-sm border border-amber-100/50">
                <StickyNote size={20} />
            </div>
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Notes</span>
                    <div className="h-px w-8 bg-slate-200" />
                    {state === "loaded" && notes.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-100">
                            {notes.length} {notes.length === 1 ? "note" : "notes"}
                        </span>
                    )}
                </div>

                {state === "loading" && (
                    <div className="flex items-center gap-2 text-slate-400 text-[12px]">
                        <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
                        Loading notes...
                    </div>
                )}

                {state === "error" && (
                    <span className="text-[12px] text-red-400 italic">Failed to load notes.</span>
                )}

                {state === "loaded" && notes.length === 0 && (
                    <span className="text-[12px] text-slate-400 italic">No internal notes for this order.</span>
                )}

                {state === "loaded" && notes.length > 0 && (() => {
                    const note = notes[0];
                    const userName = typeof note.user_id === "object" && note.user_id !== null
                        ? note.user_id.name
                        : String(note.user_id || "");
                    const date = note.createdAt || note.created_at
                        ? new Date(note.createdAt || note.created_at || "").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
                        : "";
                    return (
                        <div className="text-[13px] leading-relaxed text-slate-600 font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                            <div className="flex items-center gap-2 mb-1.5">
                                {userName && <span className="text-[11px] font-bold text-amber-700">{userName}</span>}
                                {date && <span className="text-[10px] text-slate-400">{date}</span>}
                            </div>
                            <p className="whitespace-pre-wrap break-words">
                                {note.note}
                            </p>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
