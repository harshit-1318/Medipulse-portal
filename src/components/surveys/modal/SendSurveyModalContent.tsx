import { X, Send, Loader2 } from 'lucide-react';
import { SurveyConflictAlert } from './SurveyConflictAlert';
import { SendSurveySuccessState } from './SendSurveySuccessState';
import { useSendSurveyModal } from './useSendSurveyModal';

export interface SendSurveyModalContentProps {
    customerId: string;
    orderId?: string;
    onClose: () => void;
}

export function SendSurveyModalContent({ customerId, orderId, onClose }: SendSurveyModalContentProps) {
    const {
        selectedSurveyId,
        setSelectedSurveyId,
        sentLink,
        conflictError,
        setConflictError,
        surveysData,
        loadingSurveys,
        sendMutation,
        handleSend,
    } = useSendSurveyModal(customerId, orderId);

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-montserrat">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Send Survey</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="p-6 space-y-4">
                {sentLink ? (
                    <SendSurveySuccessState onClose={onClose} />
                ) : (
                    <>
                        {loadingSurveys ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Select a published survey</label>
                                <select
                                    value={selectedSurveyId}
                                    onChange={e => { setSelectedSurveyId(e.target.value); setConflictError(false); }}
                                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00a294]/20 focus:border-[#00a294] bg-white cursor-pointer"
                                >
                                    <option value="">Choose a survey…</option>
                                    {surveysData?.items?.map(s => (
                                        <option key={s._id} value={s._id}>{s.title}</option>
                                    ))}
                                </select>
                                {(!surveysData?.items?.length && !loadingSurveys) && (
                                    <p className="text-xs text-slate-400 mt-2">
                                        No published surveys. <a href="/surveys/create" className="text-teal-600 font-semibold">Create one first.</a>
                                    </p>
                                )}
                            </div>
                        )}

                        {conflictError && (
                            <SurveyConflictAlert onResend={() => { setConflictError(false); sendMutation.mutate(); }} />
                        )}

                        <div className="flex gap-3 pt-2">
                            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!selectedSurveyId || sendMutation.isPending}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00a294] hover:bg-[#008f83] disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                            >
                                {sendMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                                Send Survey
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
