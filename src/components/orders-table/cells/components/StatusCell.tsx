

/**
 * Returns configuration for order status badges.
 */
function getStatusBadgeStyle(status?: string) {
    const s = status?.toLowerCase() || "";

    if (s === "fulfilled" || s === "completed" || s.includes("dispatch")) {
        return "bg-linear-to-b from-emerald-50 to-emerald-100/30 border border-emerald-200/80 text-emerald-700 shadow-sm shadow-emerald-500/10";
    }
    if (s === "unfulfilled" || s.includes("pending")) {
        return "bg-linear-to-b from-amber-50 to-amber-100/30 border border-amber-200/80 text-amber-700 shadow-sm shadow-amber-500/10";
    }
    if (s.includes("hold")) {
        return "bg-linear-to-b from-amber-50 to-amber-100/30 border border-amber-200/80 text-amber-700 shadow-sm shadow-amber-500/10";
    }
    if (s.includes("cancel")) {
        return "bg-linear-to-b from-slate-50 to-slate-100/50 border border-slate-300 text-[#003B73] shadow-sm shadow-slate-500/10";
    }

    return "bg-linear-to-b from-gray-50 to-gray-100 border border-gray-200 text-gray-700 shadow-sm";
}

//set the display for status
export function StatusCell({ status }: { status?: string }) {
    const styles = getStatusBadgeStyle(status);

    return (
        <span
            className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-bold font-montserrat tracking-widest 
            transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${styles}`}
        >
            {status ? status.replace(/_/g, " ").toUpperCase() : "--"}

        </span>
    );
}
