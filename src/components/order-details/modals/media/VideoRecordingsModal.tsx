import type { ApiResponse } from "@/components/order-details/types";
import { useVideoRecordings } from "@/components/order-details/hooks";
import { VideoRecordingsTable } from "@/components/order-details/components";

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
                        background: rgba(241, 245, 249, 0.5);
                        border-radius: 9999px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 9999px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                    }
                `}
            </style>
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-all" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-lg">📹</span>
                            <h2 className="text-xl font-bold text-slate-900">Recorded Consultations</h2>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Review recorded verification videos for this order</p>
                    </div>
                    <button 
                        className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer" 
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
                    <VideoRecordingsTable 
                        recordings={recordings} 
                        loading={loading} 
                        shopifyId={shopifyId} 
                        orderId={orderId} 
                    />
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                        className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-all shadow-xs cursor-pointer" 
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
