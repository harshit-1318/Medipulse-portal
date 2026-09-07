import { m, AnimatePresence } from "framer-motion";
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
    siteOptions = []
}: Props) => {
    const handleClose = () => setFiltersEnabled(false);

    return (
        <AnimatePresence>
            {filtersEnabled && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-3xl overflow-hidden border border-slate-200/60"
                    >
                        <ActivityFiltersHeader onClose={handleClose} />
                        
                        <ActivityFiltersForm 
                            filters={filters}
                            updateFilter={updateFilter}
                            localSearch={localSearch}
                            setLocalSearch={setLocalSearch}
                            localOrderId={localOrderId}
                            setLocalOrderId={setLocalOrderId}
                            siteOptions={siteOptions}
                        />

                        <ActivityFiltersFooter 
                            onClear={clearFilters}
                            onCancel={handleClose}
                            onApply={handleClose}
                        />
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
};
