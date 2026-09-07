export function SearchFooter() {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-t border-slate-100 text-[11px] font-medium text-slate-500 font-montserrat">
            {/* Pattern hints */}
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm">#order</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm">123456 ID</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm">email@</span>
            </div>

            {/* ESC hint */}
            <div className="flex items-center gap-1.5">
                <span className="flex items-center justify-center px-1.5 h-5 bg-white rounded border border-slate-200 shadow-sm text-[10px] text-slate-400 font-bold font-sans">ESC</span>
                <span>to close</span>
            </div>
        </div>
    );
}
