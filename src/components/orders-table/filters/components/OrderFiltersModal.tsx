import { useEffect } from "react";
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
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFiltersEnabled(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setFiltersEnabled]);

    if (!filtersEnabled) return null;

    return (
        <div
            className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in transition-[left] duration-300 ease-in-out"
            style={{ left: "var(--sidebar-width, 17.5rem)" }}
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
}
