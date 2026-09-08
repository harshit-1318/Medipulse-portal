import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useUsersList } from '../hooks/useUsersList';
import UsersHeader from '../components/UsersHeader';
import UsersTable from '../table/UsersTable';
import UserFilters from '../filters/UserFilters';

function UsersListContent() {
    const {
        users, loading, sites, total, page, setPage,
        search, setSearch, selectedSite, setSelectedSite,
        isSuperAdmin, activeFilterCount, clearFilters, limit, toggleUserActive
    } = useUsersList();

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-4 font-montserrat text-[16px] leading-normal pt-2 pb-6">
                <UsersHeader />

                <UserFilters
                    search={search}
                    onSearchChange={setSearch}
                    selectedSite={selectedSite}
                    onSiteChange={setSelectedSite}
                    sites={sites}
                    isSuperAdmin={isSuperAdmin}
                    activeFilterCount={activeFilterCount}
                    onClearAll={clearFilters}
                />

                <AnimatePresence mode="wait">
                    <m.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className={loading ? "opacity-60 transition-opacity duration-300 pointer-events-none" : "transition-opacity duration-300"}>
                            <UsersTable
                                users={users}
                                total={total}
                                page={page}
                                limit={limit}
                                onPageChange={setPage}
                                loading={loading}
                                onToggleUserActive={toggleUserActive}
                            />
                        </div>
                    </m.div>
                </AnimatePresence>
            </div>
        </LazyMotion>
    );
}

export default function UsersListPage() {
    return <UsersListContent />;
}
