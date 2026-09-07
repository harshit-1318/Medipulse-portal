import React from "react";
import { m } from "framer-motion";
import { Package, PauseCircle, FileCheck, AlertTriangle } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";

const getIconConfig = (label: string) => {
    switch (label) {
        case "Total Orders":
            return {
                icon: <Package size={16} className="text-blue-600" />,
                bg: "bg-blue-50",
                border: "border-blue-100"
            };
        case "On Hold Orders":
            return {
                icon: <PauseCircle size={16} className="text-amber-600" />,
                bg: "bg-amber-50",
                border: "border-amber-100"
            };
        case "Uploaded Documents":
            return {
                icon: <FileCheck size={16} className="text-emerald-600" />,
                bg: "bg-emerald-50",
                border: "border-emerald-100"
            };
        case "Urgent Orders":
            return {
                icon: <AlertTriangle size={16} className="text-rose-600" />,
                bg: "bg-rose-50",
                border: "border-rose-100"
            };
        default:
            return {
                icon: <Package size={16} className="text-slate-600" />,
                bg: "bg-slate-50",
                border: "border-slate-100"
            };
    }
}

interface StatCardProps {
    label: string;
    value: number;
    path: string;
    index: number;
    onTotalOrdersClick?: (e: React.MouseEvent) => void;
}

export function StatCard({ label, value, path, index, onTotalOrdersClick }: StatCardProps) {
    const config = getIconConfig(label);

    return (
        <m.a
            href={path}
            onClick={(e) => {
                if (label === "Total Orders" && onTotalOrdersClick) {
                    onTotalOrdersClick(e);
                }
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.08,
            }}
            whileHover={{
                y: -4,
                boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)"
            }}
            className="group relative cursor-pointer rounded-2xl p-5 h-full min-h-27.5
                flex flex-col justify-between overflow-hidden
                bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]
                transition-colors duration-300 hover:border-slate-300"
        >
            <div className="flex items-center gap-2 z-10">
                <div className={`p-1.5 rounded-lg ${config.bg} ${config.border} border transition-transform duration-300 group-hover:scale-110`}>
                    {config.icon}
                </div>
                <p className="font-semibold text-slate-500 text-[13px] uppercase tracking-wider">{label}</p>
            </div>

            <h2 className="text-[28px] font-bold text-slate-800 tracking-tight z-10 self-end mt-1">
                <AnimatedNumber value={value} />
            </h2>

            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </m.a>
    );
}

