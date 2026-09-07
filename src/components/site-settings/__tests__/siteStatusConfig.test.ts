import { describe, it, expect } from 'vitest';
import { getSiteStatusConfig } from '../utils/siteStatusConfig';

describe('getSiteStatusConfig', () => {
    it('returns active configuration for active status', () => {
        const config = getSiteStatusConfig('active');
        expect(config.label).toBe('Active');
        expect(config.dot).toBe('bg-emerald-500');
    });

    it('returns active configuration case-insensitively', () => {
        const config = getSiteStatusConfig('ACTIVE');
        expect(config.label).toBe('Active');
        expect(config.dot).toBe('bg-emerald-500');
    });

    it('returns inactive configuration for inactive status', () => {
        const config = getSiteStatusConfig('inactive');
        expect(config.label).toBe('Inactive');
        expect(config.dot).toBe('bg-red-500');
    });

    it('returns unknown configuration for empty or unrecognised status', () => {
        expect(getSiteStatusConfig(undefined).label).toBe('Unknown');
        expect(getSiteStatusConfig('').label).toBe('Unknown');
        expect(getSiteStatusConfig('random_status').label).toBe('Unknown');
    });
});
