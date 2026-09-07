export function formatCreatedDate(value?: string) {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getAvatarStyles(id: string) {
    const colors = [
        'bg-linear-to-br from-teal-50 to-teal-100/90 text-[#00a294] ring-1 ring-teal-200/80',
        'bg-linear-to-br from-purple-50 to-purple-100/90 text-purple-700 ring-1 ring-purple-200/80',
        'bg-linear-to-br from-indigo-50 to-indigo-100/90 text-indigo-700 ring-1 ring-indigo-200/80',
        'bg-linear-to-br from-blue-50 to-blue-100/90 text-blue-700 ring-1 ring-blue-200/80',
        'bg-linear-to-br from-emerald-50 to-emerald-100/90 text-emerald-700 ring-1 ring-emerald-200/80',
        'bg-linear-to-br from-amber-50 to-amber-100/90 text-amber-700 ring-1 ring-amber-200/80',
        'bg-linear-to-br from-rose-50 to-rose-100/90 text-rose-700 ring-1 ring-rose-200/80',
    ];

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export function getRoleStyles(role: string, isSuper: boolean = false) {
    if (isSuper) return 'bg-purple-50 text-purple-700 border border-purple-200/80';
    switch (role?.toLowerCase()) {
        case 'admin': return 'bg-indigo-50 text-indigo-700 border border-indigo-200/80';
        case 'driver': return 'bg-amber-50 text-amber-700 border border-amber-200/80';
        case 'prescriber': return 'bg-teal-50 text-[#00a294] border border-[#00a294]/25';
        case 'pharmacist': return 'bg-cyan-50 text-cyan-700 border border-cyan-200/80';
        case 'pharmacy_staff': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
        case 'customer_support': return 'bg-sky-50 text-sky-700 border border-sky-200/80';
        default: return 'bg-slate-50 text-slate-600 border border-slate-200/80';
    }
}
