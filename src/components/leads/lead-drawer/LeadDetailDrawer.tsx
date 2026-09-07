import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { useLeadDetail } from '../hooks/useLeadDetail';
import { LeadDrawerHeader } from './LeadDrawerHeader';
import { NoteThread } from './NoteThread';
import { ActivityTimeline } from './ActivityTimeline';
import { LeadResponseTab } from './LeadResponseTab';

interface LeadDetailDrawerProps {
    leadId: string | null;
    onClose: () => void;
}

export default function LeadDetailDrawer({ leadId, onClose }: LeadDetailDrawerProps) {
    const { lead, isLoading, notes, activity, handleStatusChange, handleAddNote, isUpdatingStatus, isAddingNote } = useLeadDetail(leadId);
    const [activeTab, setActiveTab] = useState<'response' | 'notes' | 'activity'>('notes');

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence>
                {leadId && (
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
                            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
                        >
                            {isLoading && (
                                <div className="flex-1 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
                                </div>
                            )}

                            {lead && !isLoading && (
                                <>
                                    <LeadDrawerHeader
                                        lead={lead}
                                        onClose={onClose}
                                        handleStatusChange={handleStatusChange}
                                        isUpdatingStatus={isUpdatingStatus}
                                    />

                                    <div className="flex border-b border-slate-100 shrink-0 px-6">
                                        {(['notes', 'activity', 'response'] as const).map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors capitalize ${
                                                    activeTab === tab
                                                        ? 'border-teal-500 text-teal-600'
                                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                                }`}
                                            >
                                                {tab}
                                                {tab === 'notes' && notes.length > 0 && (
                                                    <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 rounded-full px-1.5 py-0.5">
                                                        {notes.length}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        {activeTab === 'notes' && (
                                            <NoteThread notes={notes} onAdd={handleAddNote} isAdding={isAddingNote} />
                                        )}
                                        {activeTab === 'activity' && (
                                            <ActivityTimeline items={activity} />
                                        )}
                                        {activeTab === 'response' && (
                                            <LeadResponseTab submittedResponse={lead.submittedResponse} />
                                        )}
                                    </div>
                                </>
                            )}
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
}
