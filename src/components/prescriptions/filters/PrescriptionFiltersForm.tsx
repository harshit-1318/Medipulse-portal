import { PrescriptionDiscoveryFields } from "./PrescriptionDiscoveryFields";
import { PrescriptionTimelineFields } from "./PrescriptionTimelineFields";

interface Props {
    filters: any;
    updateFilter: (key: string, value: any) => void;
    localOrderId: string;
    setLocalOrderId: (v: string) => void;
    localPrescriber: string;
    setLocalPrescriber: (v: string) => void;
    localCustomerId: string;
    setLocalCustomerId: (v: string) => void;
}

export function PrescriptionFiltersForm({
    filters, updateFilter, localOrderId, setLocalOrderId, localPrescriber, setLocalPrescriber, localCustomerId, setLocalCustomerId,
}: Props) {
    return (
        <div className="p-4 pb-6 overflow-y-auto space-y-4 custom-scrollbar bg-linear-to-b from-white to-slate-50/20">
            <PrescriptionDiscoveryFields 
                localOrderId={localOrderId} 
                setLocalOrderId={setLocalOrderId} 
                localPrescriber={localPrescriber} 
                setLocalPrescriber={setLocalPrescriber}
                localCustomerId={localCustomerId}
                setLocalCustomerId={setLocalCustomerId}
            />
            <PrescriptionTimelineFields 
                filters={filters} 
                updateFilter={updateFilter} 
            />
        </div>
    );
}
