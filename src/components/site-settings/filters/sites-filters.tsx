import type { SiteFiltersState } from "@/types/site";
import { FilterHeader } from "./FilterHeader";
import { SiteFiltersModal } from "./SiteFiltersModal";
import { SiteActiveFilterChips } from "./SiteActiveFilterChips";

type Props = {
    filters: SiteFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<SiteFiltersState>>;
    setPage: (page: number) => void;
    filtersEnabled: boolean;
    setFiltersEnabled: (enabled: boolean) => void;
    clearFilters: () => void;
};

export default function SitesFilters({
    filters, setFilters, setPage, filtersEnabled, setFiltersEnabled, clearFilters
}: Props) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const removeFilter = (key: string) => {
        setFilters(prev => ({ ...prev, [key]: "" }));
        setPage(1);
    };

    const activeFiltersCount = Object.entries(filters).filter(([key, val]) => {
        if (key === 'status') return val !== "" && val !== "all";
        return val !== "";
    }).length;

    return (
        <div className="relative">
            <FilterHeader 
                filtersEnabled={filtersEnabled} 
                setFiltersEnabled={setFiltersEnabled} 
                activeFiltersCount={activeFiltersCount}
            >
                <SiteActiveFilterChips 
                    filters={filters} 
                    onRemove={removeFilter} 
                    onClear={clearFilters} 
                />
            </FilterHeader>

            <SiteFiltersModal 
                isOpen={filtersEnabled} 
                setOpen={setFiltersEnabled} 
                filters={filters} 
                onChange={handleInputChange} 
                onClear={clearFilters} 
            />
        </div>
    );
}
