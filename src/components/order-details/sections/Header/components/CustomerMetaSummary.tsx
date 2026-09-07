import { Clock } from "lucide-react";

interface Props {
    isUrgent: boolean;
    isParked?: boolean;
    orderId: string | number;
    formattedCreatedAt: string;
}

export const CustomerMetaSummary: React.FC<Props> = ({ isUrgent, isParked, orderId, formattedCreatedAt }) => {
    return (
        <div className="space-y-3 font-montserrat">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-text-secondary border border-slate-200 shadow-sm">
                    <span className="text-[12px] font-black uppercase tracking-widest">Order Overview</span>
                </div>
                {isUrgent && (
                    <div className="h-[34px] flex items-center bg-linear-to-r from-rose-600 to-rose-500 text-white pl-5 pr-7 -ml-3 rounded-r-sm shadow-lg animate-in slide-in-from-left-3 duration-700 ease-out"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%)', zIndex: 10 }}>
                        <div className="flex items-center gap-1.5 mt-px">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-wider">Marked Urgent</span>
                        </div>
                    </div>
                )}
                {isParked && (
                    <div className="h-[34px] flex items-center bg-linear-to-r from-yellow-500 to-yellow-400 text-yellow-900 pl-5 pr-7 -ml-3 rounded-r-sm shadow-lg animate-in slide-in-from-left-3 duration-700 ease-out"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%)', zIndex: 10 }}>
                        <div className="flex items-center gap-1.5 mt-px">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="text-[11px] font-black uppercase tracking-wider">Parked Order</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h1 className="text-[26px] font-black tracking-tight leading-tight">
                    Order ID: <span className="text-brand-teal">{String(orderId).startsWith('#') ? orderId : `#${orderId}`}</span>
                </h1>
                <div className="flex items-center gap-2 text-text-secondary mt-1">
                    <Clock size={13} strokeWidth={3} className="text-slate-300" />
                    <span className="text-[13px] font-bold tracking-tight">Received on {formattedCreatedAt}</span>
                </div>
            </div>
        </div>
    );
};
