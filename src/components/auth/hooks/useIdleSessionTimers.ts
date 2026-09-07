import { useRef, useCallback } from 'react';
import { clearTimerRef, logDebug } from './idleSessionUtils';

export function useIdleSessionTimers(
    warningTimeoutMs: number,
    onTimeoutLogout: () => void
) {
    const idleTimerRef = useRef<number | null>(null);
    const warningTimerRef = useRef<number | null>(null);
    const warningVisibleRef = useRef(false);
    const pendingWarningUntilVisibleRef = useRef(false);
    const warningPausedByHiddenRef = useRef(false);
    const lastActivityLogAtRef = useRef(0);

    const clearIdleTimer = useCallback(() => clearTimerRef(idleTimerRef), []);
    const clearWarningTimer = useCallback(() => clearTimerRef(warningTimerRef), []);

    const startWarningTimer = useCallback(() => {
        clearWarningTimer();
        warningPausedByHiddenRef.current = false;
        logDebug('Warning modal shown; starting warning timeout', { warningTimeoutMs });
        warningTimerRef.current = window.setTimeout(() => {
            logDebug('Warning timeout reached with no activity; forcing logout');
            onTimeoutLogout();
        }, warningTimeoutMs);
    }, [clearWarningTimer, onTimeoutLogout, warningTimeoutMs]);

    return {
        idleTimerRef,
        warningTimerRef,
        warningVisibleRef,
        pendingWarningUntilVisibleRef,
        warningPausedByHiddenRef,
        lastActivityLogAtRef,
        clearIdleTimer,
        clearWarningTimer,
        startWarningTimer,
    };
}
