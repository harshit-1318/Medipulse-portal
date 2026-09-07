import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Cookies from 'js-cookie';
import IdleSessionManager from '../../IdleSessionManager';

const mockLogout = vi.fn();

vi.mock('@/store', () => ({
    useUserActions: () => ({
        logout: mockLogout,
    }),
}));

vi.mock('js-cookie', () => ({
    default: {
        get: vi.fn(),
    },
}));

describe('IdleSessionManager Core', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        localStorage.clear();
        (Cookies.get as any).mockReturnValue('token-value');
    });

    it('shows inactivity warning after 15 minutes with no activity', () => {
        render(<IdleSessionManager />);

        act(() => {
            vi.advanceTimersByTime(15 * 60 * 1000);
        });

        expect(screen.getByText(/are you still active\?/i)).toBeInTheDocument();
    });

    it('logs out user after warning timeout when no activity occurs', () => {
        render(<IdleSessionManager />);

        act(() => {
            vi.advanceTimersByTime(15 * 60 * 1000);
        });

        expect(screen.getByText(/are you still active\?/i)).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(60 * 1000);
        });

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('resets timers and hides warning when activity is detected during warning period', () => {
        render(<IdleSessionManager />);

        act(() => {
            vi.advanceTimersByTime(15 * 60 * 1000);
        });

        expect(screen.getByText(/are you still active\?/i)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseMove(window);
            vi.advanceTimersByTime(60 * 1000);
        });

        expect(mockLogout).not.toHaveBeenCalled();
        expect(screen.queryByText(/are you still active\?/i)).not.toBeInTheDocument();
    });
});
