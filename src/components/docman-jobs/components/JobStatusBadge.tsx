
interface JobStatusBadgeProps {
    status: string;
}

function getStatusStyles(status: string) {
    const s = status.toLowerCase();
    
    // Modern "soft pill" aesthetic with subtle background and text colors
    switch (s) {
        case 'done':
        case 'completed':
            return "bg-emerald-50 text-emerald-600 border-emerald-100/50";
        case 'failed':
            return "bg-rose-50 text-rose-600 border-rose-100/50";
        case 'pending':
            return "bg-amber-50 text-amber-600 border-amber-100/50";
        case 'processing':
        case 'claiming':
        case 'claimed':
            return "bg-indigo-50 text-indigo-600 border-indigo-100/50";
        case 'cancelled':
            return "bg-slate-50 text-slate-500 border-slate-100/50";
        default:
            return "bg-gray-50 text-gray-500 border-gray-100/50";
    }
}

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
    const styles = getStatusStyles(status);

    return (
        <span
            className={`inline-flex items-center px-3.5 py-1 rounded-full text-[12px] font-bold tracking-wide border shadow-xs ${styles} animate-in fade-in zoom-in duration-500`}
        >
            {status}
        </span>
    );
}
