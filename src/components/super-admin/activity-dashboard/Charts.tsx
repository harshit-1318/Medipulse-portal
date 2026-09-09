import { shortDate, pad2 } from './utils';

export function DailySparkline({
    byDay,
    days = 30,
}: {
    byDay: Array<{ date: string; count: number }>;
    days?: number;
}) {
    if (byDay.length === 0) {
        return <p className="text-sm text-slate-400 italic">No events in selected period.</p>;
    }

    const countMap = new Map<string, number>();
    for (const item of byDay) {
        if (item.date) {
            countMap.set(item.date.split('T')[0], item.count);
        }
    }

    const filledDays: Array<{ date: string; count: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().split('T')[0];
        filledDays.push({
            date: iso,
            count: countMap.get(iso) ?? 0,
        });
    }

    const max = Math.max(...filledDays.map((d) => d.count), 1);

    return (
        <div>
            <div className="flex items-end gap-0.75 h-20 w-full pt-2">
                {filledDays.map((day) => {
                    const hasCount = day.count > 0;
                    const heightPct = hasCount ? Math.max((day.count / max) * 100, 8) : 4;
                    return (
                        <div
                            key={day.date}
                            className={`flex-1 min-w-0.5 max-w-6 rounded-t-sm transition-all duration-150 cursor-pointer ${
                                hasCount
                                    ? 'bg-[#00A294] hover:bg-[#008F83] shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                            style={{ height: `${heightPct}%` }}
                            title={`${shortDate(day.date)}: ${day.count.toLocaleString()} events`}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between mt-2 px-0.5 text-[10px] font-semibold text-slate-400">
                <span>{shortDate(filledDays[0]?.date || '')}</span>
                <span>Today ({shortDate(filledDays[filledDays.length - 1]?.date || '')})</span>
            </div>
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
                            className={`flex-1 min-w-0.5 rounded-t-sm transition-all duration-150 cursor-default ${
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
