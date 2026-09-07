import { ActivityFiltersModal } from "./filters";

interface Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    localSearch: string;
    setLocalSearch: (v: string) => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    siteOptions?: Array<{ label: string; value: string }>;
}

export default function ActivityFilters({
    filters,
    updateFilter,
    clearFilters,
    filtersEnabled,
    setFiltersEnabled,
    localSearch,
    setLocalSearch,
    localOrderId,
    setLocalOrderId,
    siteOptions = []
}: Props) {
    return (
        <ActivityFiltersModal
            filtersEnabled={filtersEnabled}
            setFiltersEnabled={setFiltersEnabled}
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            localSearch={localSearch}
            setLocalSearch={setLocalSearch}
            localOrderId={localOrderId}
            setLocalOrderId={setLocalOrderId}
            siteOptions={siteOptions}
        />
    );
}
