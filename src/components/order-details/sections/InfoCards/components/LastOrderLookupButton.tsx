import { useState } from "react";
import { lookupOrderByDisplayId } from "@/api/services/orders";

interface LastOrderLookupButtonProps {
    orderId: string;
}

export function LastOrderLookupButton({ orderId }: LastOrderLookupButtonProps) {
    const [linking, setLinking] = useState(false);

    return (
        <button
            type="button"
            disabled={linking}
            onClick={async () => {
                setLinking(true);
                const shopifyId = await lookupOrderByDisplayId(orderId);
                setLinking(false);
                if (shopifyId) window.location.href = `/orders/view/${shopifyId}`;
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold text-[13px] tracking-tight hover:underline transition-colors disabled:opacity-60 cursor-pointer bg-transparent border-0 p-0 ml-4"
        >
            {linking ? (
                <span className="inline-flex items-center gap-1.5">
                    <svg className="animate-spin h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-[12px]">Loading…</span>
                </span>
            ) : (
                orderId.toString().startsWith('#') ? orderId : `#${orderId}`
            )}
        </button>
    );
}
