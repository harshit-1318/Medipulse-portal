import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface NoteThreadProps {
    notes: any[];
    onAdd: (text: string) => void;
    isAdding: boolean;
}

export function NoteThread({ notes, onAdd, isAdding }: NoteThreadProps) {
    const [text, setText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim());
        setText('');
    };
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="space-y-3">
            {notes.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No notes yet</p>
            )}
            {notes.map(note => (
                <div key={note._id} className="bg-slate-50 rounded-xl p-3.5">
                    <p className="text-sm text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-400 mt-1.5">
                        {note.createdBy?.username} · {formatDate(note.createdAt)}
                    </p>
                </div>
            ))}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                />
                <button
                    type="submit"
                    disabled={isAdding || !text.trim()}
                    className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-colors"
                >
                    {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </form>
        </div>
    );
}
