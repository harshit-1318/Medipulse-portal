import { CommunicationActionsGrid } from "./components/CommunicationActionsGrid";
import type { ApiResponse } from "@/components/order-details/types";

interface Props {
    order: ApiResponse;
    isReadOnly: boolean;
    isSmsSent: boolean;
    isPostalSent: boolean;
    isSending: boolean;
    onAction: (action: string) => void;
}

export function CommunicationSection({ order, isReadOnly, isSmsSent, isPostalSent, isSending, onAction }: Props) {
    const isCancelled = order.orderInfo.status?.toLowerCase() === "cancelled";

    return (
        <div className="order-detail-card group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-50/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 transition-colors group-hover:bg-rose-100/20" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
                <div className="section-header mb-0">
                    <div className="section-icon-wrapper bg-rose-soft"><span className="text-[18px]">✉</span></div>
                    <div className="section-title-container">
                        <h3 className="section-title">Communication</h3>
                        <p className="section-subtitle">Manage reminders, consultations & customer updates</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {isSmsSent && <span className="status-badge badge-success"><span className="status-badge-dot" />SMS Sent</span>}
                    {isPostalSent && <span className="status-badge badge-warning"><span className="status-badge-dot" />Postal Sent</span>}
                </div>
            </div>

            <CommunicationActionsGrid order={order} isReadOnly={isReadOnly} isCancelled={isCancelled} isSending={isSending} onAction={onAction} />
        </div>
    );
}
