import { describe, it, expect } from 'vitest';
import { aggregateAcrossDays, sumGroup, GROUPS } from '../utils';

describe('user-activity-summary utils', () => {
    describe('aggregateAcrossDays', () => {
        it('returns empty object when passed undefined or null', () => {
            expect(aggregateAcrossDays(undefined)).toEqual({});
            expect(aggregateAcrossDays(null)).toEqual({});
        });

        it('returns empty object when passed an empty array', () => {
            expect(aggregateAcrossDays([])).toEqual({});
        });

        it('gracefully handles days with undefined, null, or corrupted actions', () => {
            const malformedSummary: any = [
                null,
                undefined,
                { date: '2026-09-06', total: 0 },
                { date: '2026-09-05', total: 0, actions: null },
                { date: '2026-09-04', total: 0, actions: undefined },
                { date: '2026-09-03', total: 5, actions: { order_viewed: 3, order_status_changed: 2 } },
            ];

            const result = aggregateAcrossDays(malformedSummary);
            expect(result).toEqual({
                order_viewed: 3,
                order_status_changed: 2,
            });
        });

        it('aggregates counts correctly across multiple valid days', () => {
            const summary: any = [
                { date: '2026-09-05', actions: { order_viewed: 2, pdf_generated: 1 } },
                { date: '2026-09-06', actions: { order_viewed: 5, review_completed: 3 } },
            ];

            const result = aggregateAcrossDays(summary);
            expect(result).toEqual({
                order_viewed: 7,
                pdf_generated: 1,
                review_completed: 3,
            });
        });
    });

    describe('sumGroup', () => {
        it('returns 0 when dayActions is null or undefined', () => {
            expect(sumGroup(null, GROUPS.viewed)).toBe(0);
            expect(sumGroup(undefined, GROUPS.viewed)).toBe(0);
        });

        it('sums matching group keys correctly', () => {
            const actions = {
                order_viewed: 12,
                other_action: 4,
            };
            expect(sumGroup(actions, GROUPS.viewed)).toBe(12);
        });
    });
});
