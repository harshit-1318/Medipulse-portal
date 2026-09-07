import { shortDate, pad2 } from './utils';

export function DailySparkline({ byDay }: { byDay: Array<{ date: string; count: number }> }) {
    if (byDay.length === 0) {
        return <p className="text-sm text-slate-400 italic">No events in selected period.</p>;
    }
    const max = Math.max(...byDay.map((d) => d.count), 1);
    return (
        <div className="flex items-end gap-1 h-24 w-full pt-2">
            {byDay.map((day) => {
                const heightPct = Math.max((day.count / max) * 100, 4);
                return (
                    <div
                        key={day.date}
                        className="flex-1 min-w-[2px] bg-[#00A294] hover:bg-[#008F83] transition-all duration-150 cursor-default rounded-t-sm shadow-xs"
                        style={{ height: `${heightPct}%` }}
                        title={`${shortDate(day.date)}: ${day.count.toLocaleString()} events`}
                    />
                );
            })}
        </div>
    );
}

export function HourlyChart({ byHour }: { byHour: Array<{ hour: number; count: number }> }) {
    const hourMap = new Map(byHour.map((h) => [h.hour, h.count]));
    const filled = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourMap.get(i) ?? 0,
    }));
    const max = Math.max(...filled.map((h) => h.count), 1);
    return (
        <div>
            <div className="flex items-end gap-1 h-16 w-full pt-2">
                {filled.map((h) => {
                    const heightPct = Math.max((h.count / max) * 100, h.count > 0 ? 4 : 2);
                    return (
                        <div
                            key={h.hour}
                            className={`flex-1 min-w-[2px] rounded-t-sm transition-all duration-150 cursor-default ${
                                h.count > 0 ? 'bg-teal-500 hover:bg-teal-400' : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                            style={{ height: `${heightPct}%` }}
                            title={`${pad2(h.hour)}:00 UTC \u2014 ${h.count.toLocaleString()} events`}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between mt-1.5 px-0.5">
                {[0, 6, 12, 18, 23].map((h) => (
                    <span key={h} className="text-[10px] font-semibold text-slate-400">{pad2(h)}:00</span>
                ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">Times are UTC. Hover a bar to see exact count.</p>
        </div>
    );
}
