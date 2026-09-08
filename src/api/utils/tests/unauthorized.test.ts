import { describe, it, expect } from 'vitest';
import { shouldHandleUnauthorizedRedirect } from '../unauthorized';

describe('shouldHandleUnauthorizedRedirect', () => {
    it('returns true for protected routes and non-auth API endpoints', () => {
        const result = shouldHandleUnauthorizedRedirect('/orders/dashboard-stats', '/dashboard');
        expect(result).toBe(true);
    });

    it('returns false on auth pages', () => {
        const result = shouldHandleUnauthorizedRedirect('/orders/dashboard-stats', '/login');
        expect(result).toBe(false);
    });

    it('returns false for login endpoint failures to preserve form error handling', () => {
        const result = shouldHandleUnauthorizedRedirect('/auth/login', '/login');
        expect(result).toBe(false);
    });
});
