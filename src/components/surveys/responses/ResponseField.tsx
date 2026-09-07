
interface ResponseFieldProps {
    label: string;
    value: any;
}

export function ResponseField({ label, value }: ResponseFieldProps) {
    if (value === undefined || value === null || value === '') return null;
    const display = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    return (
        <div className="py-3 border-b border-slate-50 last:border-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{display}</p>
        </div>
    );
}
