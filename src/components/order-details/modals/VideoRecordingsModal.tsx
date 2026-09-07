import type { ApiResponse } from "../types";
import { useVideoRecordings } from "../hooks";
import { VideoRecordingsTable } from "../components";

interface VideoRecordingsModalProps {
    shopifyId?: string;
    orderId: string;
    recordings: NonNullable<ApiResponse["customerDocuments"]["video_recordings"]>;
    onClose: () => void;
}

export function VideoRecordingsModal({ shopifyId, orderId, recordings: initialRecordings, onClose }: VideoRecordingsModalProps) {
    const { recordings, loading } = useVideoRecordings(shopifyId, initialRecordings);

    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-99999 px-4 animate-in fade-in duration-300" 
            onClick={onClose}
        >
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #94a3b8;
                        border-radius: 10px;
                        border: 2px solid #f1f5f9;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #64748b;
                    }
                `}
            </style>
            <div 
                className="bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                            🎙️
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Customer Recordings</h2>
                            <p className="text-xs font-semibold text-slate-400">
                                {loading ? 'Checking records...' : `${recordings.length} ${recordings.length === 1 ? 'recording' : 'recordings'} found`}
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full p-2.5 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <title>Close modal</title>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <VideoRecordingsTable recordings={recordings} loading={loading} shopifyId={shopifyId} orderId={orderId} />
                </div>
            </div>
        </div>
    );
}
