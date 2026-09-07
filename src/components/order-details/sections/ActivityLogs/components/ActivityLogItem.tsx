import type { ActivityLog } from "@/components/order-details/types";
import { getActionConfig } from "@/components/activity-logs";

function resolveDisplayName(log: ActivityLog): string {
    if (log.userName && log.userName.trim() && log.userName !== "System") return log.userName.trim();
    const email = log.userEmail || log.subjectGuid || "";
    if (email.includes("@")) return email.split("@")[0];
    if (email && email !== "-") return email;
    return "System";
}

export function ActivityLogItem({ log, index, total }: { log: ActivityLog; index: number; total: number }) {
    const config = getActionConfig(log.actionType);
    const ActionIcon = config.icon;
    const displayName = resolveDisplayName(log);
    const occurrences = typeof log.count === "number" ? log.count : 1;

    return (
        <div className="relative flex gap-3 group/item py-1">
            <div className="relative z-10 pt-0.5">
                <div className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover/item:border-teal-400 group-hover/item:bg-teal-50 transition-all duration-300">
                    <span className="text-text-primary text-[10px] font-semibold">
                        {total - index}
                    </span>
                </div>
            </div>

            <div className="flex-1 rounded-lg bg-white border border-slate-100 shadow-sm p-1.5 px-3 relative transition-all duration-300 group-hover/item:border-teal-100 group-hover/item:bg-slate-50/30">
                <div className="flex justify-between items-start gap-4 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
                        <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold"
                            style={{ backgroundColor: config.bg, borderColor: config.border, color: config.color }}
                        >
                            <ActionIcon size={10} strokeWidth={2.5} />
                            <span>{config.label}</span>
                        </div>
                        {occurrences > 1 && (
                            <span className="inline-flex items-center justify-center rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-700">
                                {occurrences}x
                            </span>
                        )}
                        <span className="text-[11px] font-medium text-text-secondary">
                            {log.createdAt
                                ? new Date(log.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "UTC",
                                    hour12: false,
                                }).replace(",", "") + " UTC"
                                : "—"}
                        </span>
                    </div>
                </div>

                <div className="text-text-secondary text-[11px] font-medium pl-3 border-l border-slate-200 mt-0.5">
                    <span className="opacity-70">By:</span>{" "}
                    <span className="font-semibold">{displayName}</span>
                </div>
                {log.details && (
                    <div className="text-text-secondary text-[11px] font-medium pl-3 border-l border-slate-200 mt-0.5 opacity-70 truncate">
                        {log.details}
                    </div>
                )}
                {occurrences > 1 && (
                    <div className="text-[11px] font-medium pl-3 border-l border-slate-200 mt-0.5 text-teal-700">
                        {occurrences} occurrences this day
                    </div>
                )}
            </div>
        </div>
    );
}
