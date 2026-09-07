export const getUrlParam = (key: string, defaultValue: string = ""): string => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
};

export const getUrlParamBool = (key: string, defaultValue: boolean = false): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    if (val === null) return defaultValue;
    return val === 'true';
};

export const getUrlParamInt = (key: string, defaultValue: number = 1, storageKey?: string): number => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    
    if (val !== null) {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    if (storageKey) {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsedStored = JSON.parse(stored);
                if (parsedStored && typeof parsedStored[key] === 'number') return parsedStored[key];
            } catch (e) {}
        }
    }

    return defaultValue;
};

/**
 * Normalizes sort direction strings to strictly 'asc' or 'desc'
 */
export const normalizeSortOrder = (sort?: string): "asc" | "desc" => {
    if (!sort) return "desc";
    const s = sort.toLowerCase().trim();
    if (s === "asc" || s === "ascending") return "asc";
    if (s === "desc" || s === "descending" || s === "dsc") return "desc";
    return "desc"; // Default fallback
};

/**
 * Normalizes sortBy values for consistency between UI, URL, and API
 */
export const normalizeSortBy = (value: string): string => {
  if (value === "products") return "product";
  return value;
};
