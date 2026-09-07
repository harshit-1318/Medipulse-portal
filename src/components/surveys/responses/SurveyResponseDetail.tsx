import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { SurveyResponse } from '@/types/survey';
import { ResponseField } from './ResponseField';
import { ResponseMetaSections } from './ResponseMetaSections';

interface SurveyResponseDetailProps {
    response: SurveyResponse | null;
    onClose: () => void;
}

export default function SurveyResponseDetail({ response, onClose }: SurveyResponseDetailProps) {
    if (!response) return null;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const responseData = response.submittedResponse ?? {};

    return (
        <AnimatePresence>
            {response && (
                <>
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <m.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                            <div>
                                <p className="font-semibold text-slate-800">Response Detail</p>
                                <p className="text-xs text-slate-400 mt-0.5">{formatDate(response.submittedAt)}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <ResponseMetaSections response={response} formatDate={formatDate} />

                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Answers</h3>
                                <div className="bg-white rounded-xl border border-slate-100 p-4 divide-y divide-slate-50">
                                    {Object.entries(responseData).length === 0 ? (
                                        <p className="text-sm text-slate-400">No answer data</p>
                                    ) : (
                                        Object.entries(responseData).map(([key, val]) => (
                                            <ResponseField key={key} label={key} value={val} />
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
}

