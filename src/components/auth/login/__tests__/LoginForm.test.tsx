import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../LoginForm';
import { useUserStore } from '@/store';
import { login } from '@/api/services/user/userService';
import Cookies from 'js-cookie';

vi.mock('@/store', () => ({
    useUserStore: vi.fn(),
    useGlobalLoader: vi.fn(() => ({
        start: vi.fn(),
        stop: vi.fn(),
    })),
    useSiteInfo: vi.fn(() => ({})),
    useSiteLoading: vi.fn(() => false),
}));

vi.mock('@/api/services/user/userService', () => ({
    login: vi.fn(),
}));

vi.mock('js-cookie', () => ({
    default: {
        set: vi.fn(),
        get: vi.fn(),
        remove: vi.fn(),
    },
}));

describe('LoginForm Component', () => {
    const mockSetUser = vi.fn();
    const mockSetToken = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useUserStore).mockReturnValue({
            setUser: mockSetUser,
            setToken: mockSetToken,
        });

        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true
        });

        Storage.prototype.setItem = vi.fn();
    });

    it('renders the login form correctly', () => {
        render(<LoginForm />);

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Login to Continue')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('updates email and password fields on change', () => {
        render(<LoginForm />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('shows loading state and triggers API call on submit', async () => {
        vi.mocked(login).mockResolvedValueOnce({
            user: { email: 'test@example.com', role: 'admin', is_super_admin: false },
            access_token: 'dummy-token'
        });

        render(<LoginForm />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByRole('button', { name: /Login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });

        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalledWith({ email: 'test@example.com', role: 'admin', is_super_admin: false });
            expect(mockSetToken).toHaveBeenCalledWith('dummy-token');
            expect(Cookies.set).toHaveBeenCalledWith('role', 'admin', { expires: 7 });
            expect(Cookies.set).toHaveBeenCalledWith('username', 'test', { expires: 7 });
            expect(window.location.href).toBe('/dashboard');
        });
    });

    it('handles login errors properly', async () => {
        const errorMessage = 'Invalid credentials provided';
        vi.mocked(login).mockRejectedValueOnce(new Error(errorMessage));

        render(<LoginForm />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByRole('button', { name: /Login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('toggles password visibility correctly', () => {
        render(<LoginForm />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggleButton = passwordInput.parentElement?.querySelector('button') as HTMLButtonElement;
        fireEvent.click(toggleButton);

        expect(passwordInput).toHaveAttribute('type', 'text');

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('handles backend response missing user but successfully completing', async () => {
        vi.mocked(useUserStore).mockReturnValue({ setUser: vi.fn(), setToken: vi.fn() });
        vi.mocked(login).mockResolvedValueOnce({
            access_token: 'dummy-token'
        });

        render(<LoginForm />);
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByRole('button', { name: /Login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials or response from server')).toBeInTheDocument();
        });
    });

    it('handles error containing response data message', async () => {
        const customErrorMessage = 'Custom backend error message';
        const mockError: any = new Error('Network Error');
        mockError.response = {
            data: {
                message: customErrorMessage
            }
        };

        vi.mocked(login).mockRejectedValueOnce(mockError);

        render(<LoginForm />);
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const submitButton = screen.getByRole('button', { name: /Login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(customErrorMessage)).toBeInTheDocument();
        });
    });
});
