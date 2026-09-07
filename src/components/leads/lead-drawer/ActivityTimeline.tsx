
export function ActivityTimeline({ items }: { items: any[] }) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const ACTION_LABELS: Record<string, string> = {
        created: 'Lead created',
        status_changed: 'Status changed',
        assigned: 'Assigned',
        note_added: 'Note added',
    };

    return (
        <div className="space-y-3">
            {items.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
            )}
            {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <div>
                        <p className="text-sm text-slate-700 font-medium">
                            {ACTION_LABELS[item.action] ?? item.action}
                            {item.from && item.to && (
                                <span className="font-normal text-slate-500">
                                    {' '}{item.from} → {item.to}
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-slate-400">
                            {item.performedBy?.username} · {formatDate(item.timestamp)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
