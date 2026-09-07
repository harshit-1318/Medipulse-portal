
interface ResyncSectionProps {
    orderId: string;
    isResyncing: boolean;
    resyncSuccess: boolean;
    resyncError: string | null;
    resyncedAt?: string;
    handleResync: (id: string) => void;
}

export function ResyncSection({
    orderId,
    isResyncing,
    resyncSuccess,
    resyncError,
    resyncedAt,
    handleResync,
}: ResyncSectionProps) {
    const parsedResyncedAt = resyncedAt ? new Date(resyncedAt) : null;
    const hasResyncedAt = Boolean(parsedResyncedAt && !Number.isNaN(parsedResyncedAt.getTime()));

    return (
        <div className="flex flex-col items-end gap-2 pt-2 pb-4">
            <button
                onClick={() => handleResync(orderId)}
                disabled={isResyncing}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isResyncing ? (
                    <>
                        <svg className="h-4 w-4 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Re-Syncing…
                    </>
                ) : (
                    "Re-Sync Order"
                )}
            </button>
            {resyncSuccess && (
                <p className="text-sm text-green-600">✓ Re-sync complete — reloading…</p>
            )}
            {resyncError && (
                <p className="text-sm text-red-600">{resyncError}</p>
            )}
            {hasResyncedAt && (
                <p className="text-xs text-gray-500">
                    Last re-synced: {parsedResyncedAt?.toLocaleString()}
                </p>
            )}
        </div>
    );
}
