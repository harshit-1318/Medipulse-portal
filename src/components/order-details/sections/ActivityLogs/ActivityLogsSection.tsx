import { motion } from "framer-motion";
import { useState } from "react";
import type { ActivityLog } from "@/components/order-details/types";
import { ActivityLogItem } from "./components/ActivityLogItem";

interface ActivityLogsSectionProps {
    activityLogs: ActivityLog[] | undefined;
}

export function ActivityLogsSection({ activityLogs }: ActivityLogsSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const visibleLogs = activityLogs?.filter((log) => log.actionType !== "email_skipped");

    return (
        <div id="section-activity" className="order-detail-card group my-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="section-header justify-between py-2 relative z-10 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="section-icon-wrapper bg-teal-50 text-teal-600">
                        <span className="text-[20px]">📜</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="section-title">Activity Logs</h3>
                            {visibleLogs && visibleLogs.length > 0 && (
                                <span className="bg-teal-100 text-teal-600 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center justify-center min-w-5">
                                    {visibleLogs.length}
                                </span>
                            )}
                        </div>
                        <p className="section-subtitle">System Audit Log</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                    {isOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 12H6" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    )}
                </button>
            </div>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden relative z-10"
            >
                <div className="pt-2 max-h-125 overflow-y-auto custom-scrollbar px-1 pb-1">
                    {visibleLogs?.length ? (
                        <div className="relative space-y-1 pb-2">
                            <div className="absolute left-2.75 top-4 bottom-2 w-px bg-slate-100" />

                            {visibleLogs?.map((log, index) => (
                                <ActivityLogItem
                                    key={log.id}
                                    log={log}
                                    index={index}
                                    total={visibleLogs.length}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-4 border border-slate-100/50">
                                <span className="text-3xl">📭</span>
                            </div>
                            <p className="text-[15px] font-semibold text-text-secondary">No activity traces found.</p>
                            <p className="text-[11px] font-medium text-text-secondary mt-1">Audit log is currently empty</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
