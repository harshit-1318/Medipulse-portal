
interface CustomRangePickerProps {
    customStart: string;
    setCustomStart: (s: string) => void;
    customEnd: string;
    setCustomEnd: (e: string) => void;
    onApply: () => void;
}

export function CustomRangePicker({
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    onApply,
}: CustomRangePickerProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50">
            <label className="text-xs text-slate-500 font-medium">From</label>
            <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
            />
            <label className="text-xs text-slate-500 font-medium">To</label>
            <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
            />
            <button
                onClick={onApply}
                disabled={!customStart || !customEnd}
                className="px-3 py-1 rounded-lg bg-[#00a294] hover:bg-[#008f83] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
            >
                Apply
            </button>
        </div>
    );
}
