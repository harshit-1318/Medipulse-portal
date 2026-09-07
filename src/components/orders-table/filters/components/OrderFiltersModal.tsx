import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { PageType } from "../../types";
import { OrderFiltersHeader } from "./OrderFiltersHeader";
import { OrderFiltersForm } from "./OrderFiltersForm";
import { OrderFiltersFooter } from "./OrderFiltersFooter";

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    filters: any;
    updateFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localCustomerName: string;
    setLocalCustomerName: (v: string) => void;
    localProductName: string;
    setLocalProductName: (v: string) => void;
    pageType: PageType;
}

export function OrderFiltersModal({
    filtersEnabled,
    setFiltersEnabled,
    filters,
    updateFilter,
    clearFilters,
    localOrderId,
    setLocalOrderId,
    localCustomerName,
    setLocalCustomerName,
    localProductName,
    setLocalProductName,
    pageType,
}: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFiltersEnabled(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setFiltersEnabled]);

    if (!filtersEnabled || !mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-9999 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) setFiltersEnabled(false);
            }}
        >
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 border border-slate-200 relative">
                <OrderFiltersHeader onClose={() => setFiltersEnabled(false)} />

                <OrderFiltersForm
                    filters={filters}
                    updateFilter={updateFilter}
                    localOrderId={localOrderId}
                    setLocalOrderId={setLocalOrderId}
                    localCustomerName={localCustomerName}
                    setLocalCustomerName={setLocalCustomerName}
                    localProductName={localProductName}
                    setLocalProductName={setLocalProductName}
                    pageType={pageType}
                />

                <OrderFiltersFooter
                    onClear={clearFilters}
                    onClose={() => setFiltersEnabled(false)}
                />
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
