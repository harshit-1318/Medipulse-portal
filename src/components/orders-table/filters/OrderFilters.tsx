import type { PageType } from "../types";
import {
    FilterHeader,
    useOrderFilters,
    ActiveFilterChips,
    OrderFiltersModal,
    getActiveOrderFilters
} from ".";

interface Props {
    filters: any;
    setFilters: (f: any) => void;
    setPage: (n: number) => void;
    pageType: PageType;
    filtersEnabled: boolean;
    setFiltersEnabled: (v: boolean) => void;
    hideFilters?: boolean;
    hideHeader?: boolean;
}

export default function OrderFilters({ filters, setFilters, setPage, pageType, filtersEnabled, setFiltersEnabled, hideFilters = false, hideHeader = false }: Props) {
    const { 
        localCustomerName, setLocalCustomerName, 
        localOrderId, setLocalOrderId, 
        localProductName, setLocalProductName,
        updateFilter, clearFilters, applyFilters 
    } = useOrderFilters(filters, setFilters, setPage, pageType);

    if (hideFilters) return null;

    const activeFilters = getActiveOrderFilters(filters, pageType);

    const removeFilter = (key: string) => {
        if (key === 'status' && ["on_hold", "unfulfilled", "fulfilled", "cancelled"].includes(pageType)) return;
        if (key === 'products' && ["injectable", "oral"].includes(pageType)) return;
        if (key === 'documents' && ["uploaded", "Not uploaded"].includes(pageType)) return;
        
        if (key === 'isUrgent' && pageType === 'urgent') return;
        if (key === 'isParked' && pageType === 'parked') return;
        
        if (key === 'productCategory' && pageType === 'overview') return;
        if (key === 'repeatedOrders' && (pageType === 'first' || pageType === 'repeat' || pageType === 'single')) return;
        
        if (key === 'customer') setLocalCustomerName("");
        if (key === 'orderId') setLocalOrderId("");
        if (key === 'productName') setLocalProductName("");
        if (key === 'status') {
            updateFilter('fulfillmentStatus', '');
            updateFilter('status', '');
            return;
        }
        if (key === 'productCategory' || key === 'category') {
            updateFilter('productCategory', '');
            updateFilter('category', '');
            return;
        }
        updateFilter(key, (key === 'isUrgent' || key === 'isParked') ? false : "");
    };

    return (
        <div className={hideHeader ? "" : "mb-4"}>
            {!hideHeader && (
                <FilterHeader filtersEnabled={filtersEnabled} setFiltersEnabled={setFiltersEnabled} hideFilters={hideFilters}>
                    <ActiveFilterChips activeFilters={activeFilters} removeFilter={removeFilter} clearFilters={clearFilters} />
                </FilterHeader>
            )}

            <OrderFiltersModal
                filtersEnabled={filtersEnabled}
                setFiltersEnabled={setFiltersEnabled}
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                applyFilters={applyFilters}
                localOrderId={localOrderId}
                setLocalOrderId={setLocalOrderId}
                localCustomerName={localCustomerName}
                setLocalCustomerName={setLocalCustomerName}
                localProductName={localProductName}
                setLocalProductName={setLocalProductName}
                pageType={pageType}
            />
        </div>
    );
}
