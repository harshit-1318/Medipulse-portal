import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Cookies from 'js-cookie';
import IdleSessionManager from '../IdleSessionManager';

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

describe('IdleSessionManager', () => {
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

    it('uses debug timeout override values from localStorage for faster testing', () => {
        localStorage.setItem('DEBUG_IDLE_TIMEOUT_MS', '2000');
        localStorage.setItem('DEBUG_IDLE_WARNING_TIMEOUT_MS', '3000');

        render(<IdleSessionManager />);

        act(() => {
            vi.advanceTimersByTime(1999);
        });

        expect(screen.queryByText(/are you still active\?/i)).not.toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(screen.getByText(/are you still active\?/i)).toBeInTheDocument();
        expect(screen.getByText(/2000 seconds|2 seconds/i)).toBeInTheDocument();
    });

    it('defers warning while tab is hidden and only starts warning timeout once visible', () => {
        localStorage.setItem('DEBUG_IDLE_TIMEOUT_MS', '2000');
        localStorage.setItem('DEBUG_IDLE_WARNING_TIMEOUT_MS', '2000');

        let visibilityState: DocumentVisibilityState = 'hidden';
        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: () => visibilityState,
        });

        render(<IdleSessionManager />);

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.queryByText(/are you still active\?/i)).not.toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(mockLogout).not.toHaveBeenCalled();

        act(() => {
            visibilityState = 'visible';
            document.dispatchEvent(new Event('visibilitychange'));
        });

        expect(screen.getByText(/are you still active\?/i)).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});
