import { User, Mail, MapPin, Type } from "lucide-react";
import type { ApiResponse } from "@/components/order-details/types";
import { cleanAddress, formatAddress } from "@/components/order-details/utils";

interface CustomerCardProps {
    customerInfo: ApiResponse["customerInfo"];
}

export function CustomerCard({ customerInfo }: CustomerCardProps) {
    const address = cleanAddress(formatAddress(customerInfo.defaultAddress) || customerInfo.address, customerInfo.name);

    return (
        <div className="relative group p-5 bg-white border border-slate-200 shadow-premium rounded-2xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:border-slate-300 overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-fuchsia-600 border border-slate-200 transition-transform group-hover:scale-105 duration-500 shrink-0">
                    <User size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Customer</h3>
            </div>

            {/* Info Sections */}
            <div className="flex-1 flex flex-col space-y-2 relative z-10 w-full">
                {/* Name Row */}
                <div className="grid grid-cols-[100px_1fr] items-baseline gap-4 py-1">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Type size={14} strokeWidth={2.5} className="shrink-0" />
                        <span className="text-sm font-medium text-gray-500">Name</span>
                    </div>
                    <span className="text-[14px] font-semibold text-gray-800 wrap-break-word">{customerInfo.name}</span>
                </div>

                {/* Email Row */}
                <div className="grid grid-cols-[100px_1fr] items-baseline gap-4 py-1">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={14} strokeWidth={2.5} className="shrink-0" />
                        <span className="text-sm font-medium text-gray-500">Email</span>
                    </div>
                    <span className="text-[14px] font-medium text-gray-800 break-all">{customerInfo.email}</span>
                </div>

                {/* Address Row */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4 py-1">
                    <div className="flex items-center gap-2 text-gray-400 mt-0.5">
                        <MapPin size={14} strokeWidth={2.5} className="shrink-0" />
                        <span className="text-sm font-medium text-gray-500">Address</span>
                    </div>
                    <p className="text-[14px] font-medium text-gray-800 leading-relaxed">
                        {address}
                    </p>
                </div>
            </div>
        </div>
    );
}
