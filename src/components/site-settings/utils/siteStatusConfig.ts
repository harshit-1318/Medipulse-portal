export interface StatusConfig {
    label: string;
    bg: string;
    dot: string;
    border: string;
    text: string;
}

export function getSiteStatusConfig(status?: string): StatusConfig {
    const s = status?.toLowerCase();

    const configs: Record<string, StatusConfig> = {
        active: {
            label: "Active",
            bg: "bg-emerald-50",
            dot: "bg-emerald-500",
            border: "border-emerald-200",
            text: "text-emerald-700"
        },
        inactive: {
            label: "Inactive",
            bg: "bg-red-50",
            dot: "bg-red-500",
            border: "border-red-200",
            text: "text-red-700"
        },
        unknown: {
            label: "Unknown",
            bg: "bg-slate-50",
            dot: "bg-slate-400",
            border: "border-slate-200",
            text: "text-slate-600"
        }
    };

    return (s && configs[s]) || configs.unknown;
}
