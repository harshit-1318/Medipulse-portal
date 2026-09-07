import { useEffect } from "react";

export function usePrescriptionDebouncedFilters(
    localValue: string,
    filterValue: string,
    minLen: number,
    key: string,
    updateFilter: (k: string, v: string) => void
) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filterValue || "") !== localValue) {
                if (localValue.length === 0 || localValue.length >= minLen) {
                    updateFilter(key, localValue);
                }
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [localValue, filterValue, minLen, key, updateFilter]);
}
