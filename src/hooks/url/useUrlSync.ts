import { useEffect, useRef } from "react";
import { getMappedValue, parseParamValue } from "./urlSyncUtils";
import { normalizeSortBy } from "@/utils/url/urlBase";
import { STORAGE_VERSION } from "@/utils/url/orderFilterUtils";

export function useUrlSync<T extends Record<string, any>>(
    state: T,
    onUrlStateChange: (newState: T) => void,
    page?: number,
    setPage?: (page: number) => void,
    storageKey?: string,
    defaults?: T,
    enabled: boolean = true,
) {
    const isFirstRender = useRef(true);

    const syncFromUrl = () => {
        if (typeof window === 'undefined' || !enabled) return;
        const params = new URLSearchParams(window.location.search);
        const newState: any = {};
        let changed = false;

        Object.keys(state).forEach((key) => {
            const value = getMappedValue(params, key);
            if (value !== null) {
                const parsedValue = parseParamValue(value, key, state[key]);
                if (parsedValue !== state[key]) {
                    newState[key] = parsedValue;
                    changed = true;
                }
            }
        });

        const pageParam = params.get('page');
        if (pageParam && setPage) {
            const parsedPage = Number(pageParam);
            if (parsedPage !== page) setPage(parsedPage);
        }

        if (changed) onUrlStateChange({ ...state, ...newState });
    };

    useEffect(() => {
        if (!enabled) return;
        window.addEventListener('popstate', syncFromUrl);
        return () => window.removeEventListener('popstate', syncFromUrl);
    }, [state, page, enabled]);

    useEffect(() => {
        if (typeof window === 'undefined' || !enabled) return;
        if (isFirstRender.current) { isFirstRender.current = false; return; }

        const params = new URLSearchParams();
        const storageData: any = {};
        
        Object.entries(state).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && value !== false && value !== "all") {
                if (defaults && defaults[key] === value) return;
                
                let finalValue = String(value);
                let finalKey = key;

                if (key === "sortBy") {
                    finalValue = normalizeSortBy(finalValue);
                    params.delete("sortBy");
                }

                params.set(finalKey, finalValue);
                storageData[key] = value;
            }
        });

        if (page && page > 1) {
            params.set('page', String(page));
            // Do NOT persist page to localStorage — it's transient state and
            // causes stale page bugs when deep-linking with filters (e.g. ?customer=123)
        }

        if (storageKey) {
            if (Object.keys(storageData).length > 0) localStorage.setItem(storageKey, JSON.stringify({ ...storageData, _v: STORAGE_VERSION }));
            else localStorage.removeItem(storageKey);
        }

        const newSearch = params.toString();
        const currentSearch = window.location.search.replace(/^\?/, "");
        if (currentSearch !== newSearch) {
            const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
            window.history.replaceState({ ...window.history.state }, '', newUrl);
        }
    }, [state, page, storageKey, defaults, enabled]);
}
