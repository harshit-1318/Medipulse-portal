import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../../login/LoginForm';
import Cookies from 'js-cookie';
import { commonBeforeEach } from './LoginForm.test.helpers';
import { login } from '@/api/services/user/userService';
import { consumePostLoginRedirect } from '@/utils/auth';

vi.mock('@/store', () => ({
    useUserStore: vi.fn(),
    useSiteInfo: vi.fn(() => ({ read_only: false })),
    useSiteLoading: vi.fn(() => false),
    useGlobalLoader: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
}));

vi.mock('@/api/services/user/userService', () => ({ login: vi.fn() }));

vi.mock('@/utils/auth', () => ({
    consumePostLoginRedirect: vi.fn(() => null),
    isValidPostLoginRedirectPath: vi.fn(() => true),
}));

vi.mock('js-cookie', () => ({
    default: { set: vi.fn(), get: vi.fn(), remove: vi.fn() },
}));

describe('LoginForm Submit & Redirects', () => {
    const mockSetUser = vi.fn();
    const mockSetToken = vi.fn();

    beforeEach(() => commonBeforeEach(mockSetUser, mockSetToken));

    const fillAndSubmit = (email = 'test@example.com') => {
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: email } });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    };

    it('shows loading state and triggers API call on submit', async () => {
        vi.mocked(login).mockResolvedValueOnce({
            user: { email: 'test@example.com', role: 'admin', is_super_admin: false },
            access_token: 'dummy-token'
        });

        render(<LoginForm />);
        fillAndSubmit();

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
            expect(mockSetUser).toHaveBeenCalledWith({ email: 'test@example.com', role: 'admin', is_super_admin: false });
            expect(mockSetToken).toHaveBeenCalledWith('dummy-token');
            expect(Cookies.set).toHaveBeenCalled();
            expect(window.location.href).toBe('/dashboard');
        });
    });

    it('redirects back to saved post-logout page after successful login', async () => {
        vi.mocked(consumePostLoginRedirect).mockReturnValueOnce('/orders/view/13069923451260?from=idle');
        vi.mocked(login).mockResolvedValueOnce({
            user: { email: 'test@example.com', role: 'admin', is_super_admin: false },
            access_token: 'dummy-token'
        });

        render(<LoginForm />);
        fillAndSubmit();

        await waitFor(() => {
            expect(window.location.href).toBe('/orders/view/13069923451260?from=idle');
            expect(consumePostLoginRedirect).toHaveBeenCalledTimes(1);
        });
    });

    it('redirects to returnUrl from URL search params when allowed for user role', async () => {
        Object.defineProperty(window, 'location', {
            value: { href: '', search: '?returnUrl=/orders/urgent' },
            writable: true
        });

        vi.mocked(login).mockResolvedValueOnce({
            user: { email: 'admin@example.com', role: 'admin', is_super_admin: false },
            access_token: 'dummy-token'
        });

        render(<LoginForm />);
        fillAndSubmit('admin@example.com');

        await waitFor(() => {
            expect(window.location.href).toBe('/orders/urgent');
        });
    });
});
