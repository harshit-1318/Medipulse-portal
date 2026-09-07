import { Check } from "lucide-react";
import { useState } from "react";

interface InternalNoteInputProps {
    onAdd: (text: string) => void;
    isPending: boolean;
    onPark: () => void;
    isParking: boolean;
    isParked?: boolean;
    isCancelled?: boolean;
}

export function InternalNoteInput({ onAdd, isPending, onPark, isParking, isParked = false, isCancelled = false }: InternalNoteInputProps) {
    const [noteText, setNoteText] = useState("");

    const handleAdd = () => {
        if (!noteText.trim()) return;
        onAdd(noteText);
        setNoteText("");
    };

    return (
        <div className="mb-0 space-y-0.5">
            <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add team note..."
                disabled={isPending}
                className="w-full p-2.5 px-3 rounded-xl border border-slate-200 bg-white 
                    focus:ring-2 focus:ring-orange-500/5 focus:border-orange-200 
                    placeholder:text-slate-300 text-text-primary text-[13px] font-medium
                    shadow-sm resize-none min-h-[38px] outline-none transition-all disabled:opacity-60"
            />
            <div className="flex justify-end gap-2">
                {isParked ? (
                    <button
                        disabled
                        className="px-4 py-1.5 rounded-lg bg-green-100 
                            text-green-700 font-semibold text-[11px] shadow-md shadow-green-100
                            cursor-not-allowed transition-all
                            flex items-center gap-2 border border-green-200"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Parked Order
                    </button>
                ) : (
                    <button
                        onClick={onPark}
                        disabled={isParking || isCancelled}
                        title={isCancelled ? "Cannot park a cancelled order" : undefined}
                        className="px-4 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 
                            text-yellow-900 font-semibold text-[11px] shadow-md shadow-yellow-100
                            disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95
                            flex items-center gap-2 cursor-pointer group/park border border-yellow-400"
                    >
                        <svg className="w-3.5 h-3.5 transition-transform group-hover/park:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {isParking ? "Parking..." : "Park this Order"}
                    </button>
                )}
                <button
                    onClick={handleAdd}
                    disabled={!noteText.trim() || isPending}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 
                        text-white font-semibold text-[11px] shadow-md shadow-slate-200
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95
                        flex items-center gap-2 cursor-pointer group/btn border border-slate-900"
                >
                    <Check size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:scale-110" />
                    {isPending ? "Adding..." : "Add Note"}
                </button>
            </div>
        </div>
    );
}
