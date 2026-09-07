import { useCustomerFilters } from "../hooks/useCustomerFilters";
import { CustomerFiltersModal } from "./CustomerFiltersModal";

interface Props {
    filters: any;
    setFilters: (f: any) => void;
    setPage: (n: number) => void;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
}

export default function CustomerFilters({ 
    filters, setFilters, setPage, filtersEnabled, setFiltersEnabled 
}: Props) {
    const { 
        localSearch, setLocalSearch, localTotalPens, setLocalTotalPens, 
        localStartDate, setLocalStartDate, handleApply,
        clearFilters 
    } = useCustomerFilters(filters, setFilters, setPage, setFiltersEnabled);

    return (
        <CustomerFiltersModal
            filtersEnabled={filtersEnabled}
            setFiltersEnabled={setFiltersEnabled}
            clearFilters={clearFilters}
            localSearch={localSearch}
            setLocalSearch={setLocalSearch}
            localTotalPens={localTotalPens}
            setLocalTotalPens={setLocalTotalPens}
            localStartDate={localStartDate}
            setLocalStartDate={setLocalStartDate}
            handleApply={handleApply}
        />
    );
}
