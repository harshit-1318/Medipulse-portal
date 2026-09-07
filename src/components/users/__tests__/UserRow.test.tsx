import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import UserRow from '../components/UserRow';

vi.mock('framer-motion', () => ({
    m: {
        tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    },
}));

describe('UserRow', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const baseUser = {
        _id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        sites: [],
        createdAt: '2026-04-28T00:00:00.000Z',
        is_active: true,
    } as any;

    it('renders actions and toggles disable after two-step confirmation', async () => {
        const onToggleUserActive = vi.fn().mockResolvedValue(undefined);
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        vi.spyOn(window, 'prompt').mockReturnValue('john@example.com');

        render(
            <table>
                <tbody>
                    <UserRow user={baseUser} index={0} onToggleUserActive={onToggleUserActive} />
                </tbody>
            </table>,
        );

        expect(screen.getByRole('link', { name: /view/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /edit/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /disable/i }));
        expect(onToggleUserActive).toHaveBeenCalledWith('u1', false);
    });

    it('does not toggle disable when email verification does not match', async () => {
        const onToggleUserActive = vi.fn().mockResolvedValue(undefined);
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        vi.spyOn(window, 'prompt').mockReturnValue('wrong@example.com');

        render(
            <table>
                <tbody>
                    <UserRow user={baseUser} index={0} onToggleUserActive={onToggleUserActive} />
                </tbody>
            </table>,
        );

        fireEvent.click(screen.getByRole('button', { name: /disable/i }));
        expect(onToggleUserActive).not.toHaveBeenCalled();
    });

    it('shows enable for inactive users', () => {
        const onToggleUserActive = vi.fn().mockResolvedValue(undefined);

        render(
            <table>
                <tbody>
                    <UserRow user={{ ...baseUser, is_active: false }} index={0} onToggleUserActive={onToggleUserActive} />
                </tbody>
            </table>,
        );

        expect(screen.getByRole('button', { name: /enable/i })).toBeInTheDocument();
    });
});
