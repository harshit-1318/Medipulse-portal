import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useDocmanJobs } from '../hooks/useDocmanJobs';
import DocmanJobsHeader from '../components/DocmanJobsHeader';
import DocmanJobsTable from '../components/DocmanJobsTable';
import Filters from '../components/Filters';
import { QueryProvider } from '@/components/common/QueryProvider';

function DocmanJobsContent() {
    const {
        jobs, loading, total, page, setPage, limit,
        search, setSearch, statusFilter, setStatusFilter,
        activeFilterCount, clearFilters, handleDelete
    } = useDocmanJobs();

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-8 font-montserrat text-[16px] leading-normal pt-4 pb-12">
                <DocmanJobsHeader />

                <Filters
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    activeFilterCount={activeFilterCount}
                    onClearAll={clearFilters}
                />

                <AnimatePresence mode="wait">
                    <m.div 
                        key="docman-jobs-table" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className={loading ? "opacity-60 transition-opacity duration-300 pointer-events-none" : "transition-opacity duration-300"}>
                            <DocmanJobsTable
                                jobs={jobs}
                                total={total}
                                page={page}
                                limit={limit}
                                onPageChange={setPage}
                                loading={loading}
                                onDelete={handleDelete}
                            />
                        </div>
                    </m.div>
                </AnimatePresence>
            </div>
        </LazyMotion>
    );
}

export default function DocmanJobsPage() {
    return (
        <QueryProvider>
            <DocmanJobsContent />
        </QueryProvider>
    );
}
