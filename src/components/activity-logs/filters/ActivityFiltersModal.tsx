import { useEffect } from "react";
import { ActivityFiltersHeader } from "./ActivityFiltersHeader";
import { ActivityFiltersFooter } from "./ActivityFiltersFooter";
import { ActivityFiltersForm } from "./ActivityFiltersForm";

interface Props {
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    filters: any;
    updateFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    localSearch: string;
    setLocalSearch: (v: string) => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    siteOptions?: Array<{ label: string; value: string }>;
    applyFilters?: () => void;
}

export const ActivityFiltersModal = ({
    filtersEnabled,
    setFiltersEnabled,
    filters,
    updateFilter,
    clearFilters,
    localSearch,
    setLocalSearch,
    localOrderId,
    setLocalOrderId,
    siteOptions = [],
    applyFilters,
}: Props) => {
    const handleClose = () => {
        applyFilters?.();
        setFiltersEnabled(false);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    if (!filtersEnabled) return null;

    return (
        <div
            className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in transition-[left] duration-300 ease-in-out"
            style={{ left: "var(--sidebar-width, 17.5rem)" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(79,70,229,0.18)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100 relative">
                <ActivityFiltersHeader onClose={handleClose} />
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ActivityFiltersForm 
                        filters={filters}
                        updateFilter={updateFilter}
                        localSearch={localSearch}
                        setLocalSearch={setLocalSearch}
                        localOrderId={localOrderId}
                        setLocalOrderId={setLocalOrderId}
                        siteOptions={siteOptions}
                    />
                </div>

                <ActivityFiltersFooter 
                    onClear={clearFilters}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
};

