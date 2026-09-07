import { beforeEach, describe, expect, it } from 'vitest';
import {
    consumePostLoginRedirect,
    isValidPostLoginRedirectPath,
} from './authRedirect';

describe('authRedirect utility', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('accepts safe internal app paths', () => {
        expect(isValidPostLoginRedirectPath('/orders/view/123')).toBe(true);
        expect(isValidPostLoginRedirectPath('/dashboard?sortBy=date')).toBe(true);
    });

    it('rejects auth routes and unsafe paths', () => {
        expect(isValidPostLoginRedirectPath('/login')).toBe(false);
        expect(isValidPostLoginRedirectPath('/register')).toBe(false);
        expect(isValidPostLoginRedirectPath('//evil.example')).toBe(false);
        expect(isValidPostLoginRedirectPath('https://evil.example')).toBe(false);
    });

    it('consumes and clears a valid saved redirect', () => {
        sessionStorage.setItem('AUTO_LOGOUT_POST_LOGIN_REDIRECT', '/orders/view/123');

        const first = consumePostLoginRedirect();
        const second = consumePostLoginRedirect();

        expect(first).toBe('/orders/view/123');
        expect(second).toBeNull();
    });
});
