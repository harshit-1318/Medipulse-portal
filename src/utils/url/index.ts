export * from "./urlBase";
export * from "./orderFilterUtils";

/**
 * Helper to get storage key for dashboard filters
 */
export const getDashboardStorageKey = (category: string) => `dashboardFilters_${category}`;

/**
 * Helper to clear filters from both URL and localStorage
 */
export const clearDashboardState = (category: string) => {
    if (typeof window === 'undefined') return;
    const storageKey = getDashboardStorageKey(category);
    localStorage.removeItem(storageKey);
};

/**
 * General purpose state parser from URL and LocalStorage
 */
export function getInitialStateFromUrl<T extends Record<string, any>>(defaults: T, storageKey?: string): T {
    if (typeof window === 'undefined') return defaults;
    const params = new URLSearchParams(window.location.search);
    
    // Check if we have any URL params for the keys in defaults
    let hasUrlParams = false;
    Object.keys(defaults).forEach((key) => {
        if (params.has(key)) hasUrlParams = true;
    });

    // If no URL params and we have a storage key, try loading from localStorage
    if (!hasUrlParams && storageKey) {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsedStored = JSON.parse(stored);
                return { ...defaults, ...parsedStored };
            } catch (e) {
                console.error("Failed to parse stored state", e);
            }
        }
    }

    const newState: any = { ...defaults };
    Object.keys(defaults).forEach((key) => {
        let value = params.get(key);
        
        // Handle common mappings
        if (value === null && key === 'customer') value = params.get("customerId");
        if (value === null && key === 'orderId') value = params.get("id");
        if (value === null && key === 'sortDir') value = params.get("sort"); // Common alias

        if (value !== null) {
            if (typeof defaults[key] === 'boolean') {
                newState[key] = value === 'true';
            } else if (typeof defaults[key] === 'number') {
                const num = Number(value);
                newState[key] = isNaN(num) ? defaults[key] : num;
            } else {
                newState[key] = value;
            }
        }
    });

    return newState as T;
}
