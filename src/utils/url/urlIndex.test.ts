import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getDashboardStorageKey, clearDashboardState, getInitialStateFromUrl } from './index';

describe('url index helpers', () => {
    beforeEach(() => {
        window.history.pushState({}, '', '/orders');
        localStorage.clear();
    });

    afterEach(() => {
        window.history.pushState({}, '', '/');
        localStorage.clear();
    });

    it('generates proper dashboard storage key', () => {
        expect(getDashboardStorageKey('urgent')).toBe('dashboardFilters_urgent');
        expect(getDashboardStorageKey('parked')).toBe('dashboardFilters_parked');
    });

    it('clears dashboard state from localStorage', () => {
        const key = getDashboardStorageKey('urgent');
        localStorage.setItem(key, JSON.stringify({ page: 2 }));
        expect(localStorage.getItem(key)).not.toBeNull();

        clearDashboardState('urgent');
        expect(localStorage.getItem(key)).toBeNull();
    });

    it('parses initial state from URL and localStorage', () => {
        const defaults = { search: '', page: 1, isUrgent: false };
        const storageKey = getDashboardStorageKey('test');
        localStorage.setItem(storageKey, JSON.stringify({ search: 'saved', page: 4, isUrgent: true }));

        const result = getInitialStateFromUrl(defaults, storageKey);
        expect(result.search).toBe('saved');
        expect(result.page).toBe(4);
        expect(result.isUrgent).toBe(true);
    });
});
