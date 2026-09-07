import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import PrescriptionsTable from './table/PrescriptionsTable';
import { usePrescriptionsPage } from './hooks/usePrescriptionsPage';
import PrescriptionsHeader from './components/PrescriptionsHeader';
import PrescriptionFilters from './filters/PrescriptionFilters';
import { QueryProvider } from '@/components/common/QueryProvider';

function PrescriptionsContent() {
    const { 
        data, loading, page, setPage, sorting, setSorting, 
        filtersEnabled, setFiltersEnabled, filters,
        localOrderId, setLocalOrderId, localPrescriber, setLocalPrescriber, localCustomerId, setLocalCustomerId,
        updateFilter, clearFilters, activeFilterChips, removeFilter
    } = usePrescriptionsPage();

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <PrescriptionsHeader />

                <AnimatePresence mode="wait">
                    <m.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className={loading ? "opacity-60 transition-opacity duration-300 pointer-events-none" : "transition-opacity duration-300"}>
                            <PrescriptionsTable 
                                prescriptions={data?.prescriptions || []} total={data?.total || 0}
                                page={page} limit={20} onPageChange={setPage}
                                sorting={sorting} onSortingChange={setSorting}
                                filtersEnabled={filtersEnabled} setFiltersEnabled={setFiltersEnabled}
                                activeFilterChips={activeFilterChips}
                                onRemoveFilter={removeFilter}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </m.div>
                </AnimatePresence>

                <PrescriptionFilters 
                    filters={filters} updateFilter={updateFilter} clearFilters={clearFilters}
                    localOrderId={localOrderId} setLocalOrderId={setLocalOrderId}
                    localPrescriber={localPrescriber} setLocalPrescriber={setLocalPrescriber}
                    localCustomerId={localCustomerId} setLocalCustomerId={setLocalCustomerId}
                    filtersEnabled={filtersEnabled} setFiltersEnabled={setFiltersEnabled} 
                />
            </div>
        </LazyMotion>
    );
}

export default function PrescriptionsPage() {
    return (
        <QueryProvider>
            <PrescriptionsContent />
        </QueryProvider>
    );
}
