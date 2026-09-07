
export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-999999 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer spin */}
                <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin shadow-xl"></div>
                {/* Inner counter-spin or pulse */}
                <div className="absolute w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
                    <span className="text-2xl">⏳</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-semibold text-text-primary">Processing Request</h2>
                <p className="text-slate-400 font-semibold text-[13px] uppercase tracking-[0.2em] animate-pulse">Please do not refresh</p>
            </div>
        </div>
    );
}

export default FullScreenLoader;
