
interface BarListProps {
    items: Array<{ label: string; count: number }>;
    max: number;
    colorClass?: string;
    emptyMessage?: string;
}

export function BarList({
    items,
    max,
    colorClass = "bg-indigo-500",
    emptyMessage = "No data yet.",
}: BarListProps) {
    if (items.length === 0) {
        return <p className="text-sm text-slate-400 italic">{emptyMessage}</p>;
    }

    return (
        <ul className="space-y-2.5">
            {items.map((item) => {
                const pct = max > 0 ? Math.round((item.count / max) * 100) : 0;
                return (
                    <li key={item.label} className="flex items-center gap-3">
                        <span
                            className="text-xs text-slate-600 truncate shrink-0"
                            style={{ width: "160px" }}
                            title={item.label}
                        >
                            {item.label}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-10 text-right shrink-0">
                            {item.count.toLocaleString()}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}
