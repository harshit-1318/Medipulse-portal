import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { CustomersTable } from './table';
import { useCustomersPage } from './hooks';
import { CustomersHeader } from './components';
import { CustomerFilters } from './filters';
import { QueryProvider } from '@/components/common';

interface Props {
    initialData?: any;
    initialFilters?: any;
}

function CustomersContent({ initialData, initialFilters }: Props) {
    const { 
        data, loading, page, setPage, sorting, handleSort,
        filtersEnabled, setFiltersEnabled, filters, setFilters,
        activeFilterChips, removeFilter, clearFilters
    } = useCustomersPage(initialData, initialFilters);

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <CustomersHeader />

                <AnimatePresence mode="wait">
                    <m.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className={loading ? "opacity-60 transition-opacity duration-300 pointer-events-none" : "transition-opacity duration-300"}>
                            <CustomersTable 
                                customers={data?.customers || []} 
                                total={data?.total || 0}
                                page={page} 
                                limit={20} 
                                onPageChange={setPage}
                                sorting={sorting} 
                                onSort={handleSort}
                                filtersEnabled={filtersEnabled} 
                                setFiltersEnabled={setFiltersEnabled}
                                activeFiltersCount={activeFilterChips.length}
                                activeFilterChips={activeFilterChips}
                                onRemoveFilter={removeFilter}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </m.div>
                </AnimatePresence>

                <CustomerFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    setPage={setPage} 
                    filtersEnabled={filtersEnabled} 
                    setFiltersEnabled={setFiltersEnabled} 
                />
            </div>
        </LazyMotion>
    );
}

export default function CustomersPage(props: Props) {
    return (
        <QueryProvider>
            <CustomersContent {...props} />
        </QueryProvider>
    );
}
