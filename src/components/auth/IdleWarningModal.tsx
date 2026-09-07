interface IdleWarningModalProps {
    isVisible: boolean;
    idleTimeoutMs: number;
    warningTimeoutMs: number;
    onLogout: () => void;
    onStayLoggedIn: () => void;
}

export default function IdleWarningModal({
    isVisible,
    idleTimeoutMs,
    warningTimeoutMs,
    onLogout,
    onStayLoggedIn,
}: IdleWarningModalProps) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-1200 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
                <h2 className="text-xl font-bold text-slate-900">Are you still active?</h2>
                <p className="mt-2 text-sm text-slate-600">
                    We detected no activity for {Math.round(idleTimeoutMs / 1000)} seconds. You will be logged out automatically in {Math.round(warningTimeoutMs / 1000)} seconds unless activity resumes.
                </p>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="px-4 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition-colors"
                    >
                        Logout now
                    </button>
                    <button
                        type="button"
                        onClick={onStayLoggedIn}
                        className="px-4 py-2 rounded-lg bg-brand-ocean text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        Stay logged in
                    </button>
                </div>
            </div>
        </div>
    );
}
