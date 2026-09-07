import { formatDateModern } from "../utils";

interface VideoRecordingsTableProps {
    recordings: any[];
    loading: boolean;
    shopifyId?: string;
    orderId: string;
}

export function VideoRecordingsTable({ recordings, loading, shopifyId, orderId }: VideoRecordingsTableProps) {
    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-semibold italic animate-pulse">Fetching recordings from secure server...</p>
            </div>
        );
    }

    if (recordings.length === 0) {
        return (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-2">
                    📂
                </div>
                <div className="space-y-1">
                    <h3 className="text-slate-900 font-semibold">No recordings available</h3>
                    <p className="text-slate-400 text-sm font-medium max-w-[240px]">
                        We couldn't find any customer recordings for this transaction.
                    </p>
                </div>
            </div>
        );
    }

    const handlePlayRecording = (recordingUrl: string) => {
        const idToUse = shopifyId || orderId;
        const playerUrl = `/orders/${encodeURIComponent(idToUse)}/video-player?url=${encodeURIComponent(recordingUrl)}`;
        window.open(playerUrl, "_blank");
    };

    return (
        <div className="space-y-4">
            {recordings.map((recording, index) => {
                return (
                    <div
                        key={recording.url || index}
                        className="group bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200 transition-all"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-slate-50 text-slate-400 group-hover:bg-slate-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {formatDateModern(recording.recordedAt)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                                            {recording.duration ?? 0} sec
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handlePlayRecording(recording.url)}
                                className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-sm transition-all active:scale-95 cursor-pointer bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Play Recording</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
