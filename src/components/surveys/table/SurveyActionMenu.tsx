import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import type { Survey } from '@/types/survey';

interface SurveyActionMenuProps {
    survey: Survey;
    onDelete: (id: string) => void;
    onDuplicate: (id: string, title: string) => void;
}

export function SurveyActionMenu({ survey, onDelete, onDuplicate }: SurveyActionMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <m.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden"
                        >
                            <a
                                href={`/surveys/${survey._id}/edit`}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                <Edit size={14} className="text-slate-400" />
                                Edit Survey
                            </a>
                            <a
                                href={`/surveys/${survey._id}/responses`}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                <Eye size={14} className="text-slate-400" />
                                View Responses
                            </a>
                            <button
                                onClick={() => { onDuplicate(survey._id, survey.title); setOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <Copy size={14} className="text-slate-400" />
                                Duplicate
                            </button>
                            <div className="border-t border-slate-100" />
                            <button
                                onClick={() => { onDelete(survey._id); setOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
