import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AccountForm from '../components/AccountForm';

const mockUser = {
    username: 'Dr. Jane Smith',
    email: 'jane@medipulse.co.uk',
};

vi.mock('@/store', () => ({
    useUserStore: () => ({
        user: mockUser,
    }),
}));

describe('AccountForm', () => {
    it('renders user personal info from store', () => {
        render(<AccountForm />);
        expect(screen.getByDisplayValue('Dr. Jane Smith')).toBeInTheDocument();
        expect(screen.getByDisplayValue('jane@medipulse.co.uk')).toBeInTheDocument();
    });

    it('renders password input fields', () => {
        render(<AccountForm />);
        expect(screen.getByPlaceholderText('Enter current password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Create new password')).toBeInTheDocument();
    });
});
