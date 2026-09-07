import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../LoginForm';
import { commonBeforeEach } from './LoginForm.test.helpers';

vi.mock('@/store', () => ({
    useUserStore: vi.fn(),
    useSiteInfo: vi.fn(() => ({ read_only: false })),
    useSiteLoading: vi.fn(() => false),
    useGlobalLoader: vi.fn(() => ({
        start: vi.fn(),
        stop: vi.fn(),
    })),
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

describe('LoginForm Rendering & Fields', () => {
    const mockSetUser = vi.fn();
    const mockSetToken = vi.fn();

    beforeEach(() => commonBeforeEach(mockSetUser, mockSetToken));

    it('renders the login form correctly', () => {
        render(<LoginForm />);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
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
});
