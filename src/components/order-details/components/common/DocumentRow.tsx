import type React from "react";

interface DocumentRowProps {
    label: string;
    available: any;
    onView: () => void;
    fallbackText?: string;
    /** When set, renders a grayed disabled button instead of the red 'Not Uploaded' badge */
    pendingText?: string;
    icon?: React.ReactNode;
}

export function DocumentRow({ label, available, onView, fallbackText = "Not Uploaded", pendingText, icon }: DocumentRowProps) {
    return (
        <div className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0 w-full shrink-0 min-h-9.5">
            <div className="flex items-center gap-2 shrink-0">
                {icon && <span className="text-gray-400 flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
                <span className="text-text-secondary font-medium text-[13px] shrink-0">{label}</span>
            </div>

            {available ? (
                <button
                    type="button"
                    className="h-8 px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-all duration-200 ease-in-out cursor-pointer active:scale-95 bg-brand-cyan text-white shadow-sm shadow-brand-cyan/20 hover:bg-brand-teal hover:-translate-y-0.5 hover:shadow-md"
                    onClick={onView}
                >
                    View
                </button>
            ) : pendingText ? (
                <button
                    type="button"
                    disabled
                    title={pendingText}
                    className="h-8 px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                >
                    Pending
                </button>
            ) : (
                <span className="inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 bg-red-50 text-red-600 border-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="mt-px">{fallbackText}</span>
                </span>
            )}
        </div>
    );
}
