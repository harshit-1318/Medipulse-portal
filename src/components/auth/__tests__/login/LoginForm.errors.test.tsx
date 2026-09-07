import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../../login/LoginForm';
import { commonBeforeEach } from './LoginForm.test.helpers';
import { login } from '@/api/services/user/userService';

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

describe('LoginForm Error Handling', () => {
    const mockSetUser = vi.fn();
    const mockSetToken = vi.fn();

    beforeEach(() => commonBeforeEach(mockSetUser, mockSetToken));

    it('handles login errors properly', async () => {
        const errorMessage = 'Invalid credentials provided';
        vi.mocked(login).mockRejectedValueOnce(new Error(errorMessage));

        render(<LoginForm />);
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('handles error containing response data message', async () => {
        const customErrorMessage = 'Custom backend error message';
        const mockError: any = new Error('Network Error');
        mockError.response = { data: { message: customErrorMessage } };
        vi.mocked(login).mockRejectedValueOnce(mockError);

        render(<LoginForm />);
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(customErrorMessage)).toBeInTheDocument();
        });
    });
});
