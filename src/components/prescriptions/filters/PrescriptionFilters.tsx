import { PrescriptionFiltersModal } from "./PrescriptionFiltersModal";

interface Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localPrescriber: string;
    setLocalPrescriber: (v: string) => void;
    localCustomerId: string;
    setLocalCustomerId: (v: string) => void;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
}

export default function PrescriptionFilters({ 
    filters, updateFilter, clearFilters, localOrderId, setLocalOrderId,
    localPrescriber, setLocalPrescriber, localCustomerId, setLocalCustomerId,
    filtersEnabled, setFiltersEnabled 
}: Props) {
    return (
        <PrescriptionFiltersModal
            filtersEnabled={filtersEnabled} setFiltersEnabled={setFiltersEnabled}
            filters={filters} updateFilter={updateFilter} clearFilters={clearFilters}
            localOrderId={localOrderId} setLocalOrderId={setLocalOrderId}
            localPrescriber={localPrescriber} setLocalPrescriber={setLocalPrescriber}
            localCustomerId={localCustomerId} setLocalCustomerId={setLocalCustomerId}
        />
    );
}
