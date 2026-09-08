import { BarChart2 } from "lucide-react";
import { Range, RANGE_LABELS } from "./utils";

interface UserActivityHeaderProps {
    range: Range;
    handleRangeChange: (r: Range) => void;
    showMethodology: boolean;
    setShowMethodology: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UserActivityHeader({
    range,
    handleRangeChange,
    showMethodology,
    setShowMethodology,
}: UserActivityHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-[#00a294]" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Daily Activity Summary</h2>
                <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Experimental
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {(["today", "7d", "30d", "custom"] as Range[]).map((r) => (
                    <button
                        key={r}
                        onClick={() => handleRangeChange(r)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            range === r
                                ? "bg-[#00a294] text-white border-[#00a294]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-[#00a294]"
                        }`}
                    >
                        {RANGE_LABELS[r]}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setShowMethodology((v) => !v)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline"
            >
                {showMethodology ? "Hide" : "Show"} how Active Hours is calculated
            </button>
        </div>
    );
}
