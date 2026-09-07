import { describe, it, expect } from 'vitest';
import { formatDate, formatDateModern } from '../../utils/date';

describe('Date Utilities', () => {
    const testDate = '2024-03-15T12:00:00Z';

    describe('formatDate', () => {
        it('should format date string to DD-MM-YYYY', () => {
            expect(formatDate(testDate).trim()).toBe('15-03-2024');
        });

        it('should return N/A for invalid date', () => {
            expect(formatDate('invalid')).toBe('N/A');
        });

        it('should return N/A for empty input', () => {
            expect(formatDate()).toBe('N/A');
        });
    });

    describe('formatDateModern', () => {
        it('should format date string to DD MMM YYYY', () => {
            expect(formatDateModern(testDate)).toBe('15 Mar 2024');
        });

        it('should return N/A for invalid date', () => {
            expect(formatDateModern('invalid')).toBe('N/A');
        });
    });
});
