import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PasswordFields from '../form/UserForm/PasswordFields';

const baseProps = {
    form: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Secret123',
        role: 'user',
        site_id: 'site-1',
    },
    onChange: vi.fn(),
    errors: {},
    isEditMode: true,
};

describe('PasswordFields', () => {
    it('shows toggle and switches input type when view permission is enabled', () => {
        render(<PasswordFields {...baseProps} canViewPassword={true} />);

        const input = screen.getByPlaceholderText('Leave blank to keep current') as HTMLInputElement;
        expect(input.type).toBe('password');

        const toggle = screen.getByRole('button', { name: /show password/i });
        fireEvent.click(toggle);

        expect(input.type).toBe('text');
        expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
    });

    it('does not show toggle when view permission is disabled', () => {
        render(<PasswordFields {...baseProps} canViewPassword={false} />);

        const input = screen.getByPlaceholderText('Leave blank to keep current') as HTMLInputElement;
        expect(input.type).toBe('password');
        expect(screen.queryByRole('button', { name: /show password/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /hide password/i })).not.toBeInTheDocument();
    });
});
