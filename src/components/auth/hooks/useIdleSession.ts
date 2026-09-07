import { useCallback, useMemo, useState } from 'react';
import { useUserActions } from '@/store';
import { savePostLoginRedirectFromCurrentLocation } from '@/utils/auth';
import {
    IDLE_TIMEOUT_MS,
    IDLE_TIMEOUT_OVERRIDE_KEY,
    WARNING_TIMEOUT_MS,
    WARNING_TIMEOUT_OVERRIDE_KEY,
    getTimeoutOverride,
    hasActiveSession,
    logDebug,
} from './idleSessionUtils';
import { useIdleSessionListeners } from './useIdleSessionListeners';
import { useIdleSessionTimers } from './useIdleSessionTimers';

export function useIdleSession() {
    const { logout } = useUserActions();
    const [isWarningVisible, setIsWarningVisible] = useState(false);

    const idleTimeoutMs = useMemo(() => getTimeoutOverride(IDLE_TIMEOUT_OVERRIDE_KEY, IDLE_TIMEOUT_MS), []);
    const warningTimeoutMs = useMemo(() => getTimeoutOverride(WARNING_TIMEOUT_OVERRIDE_KEY, WARNING_TIMEOUT_MS), []);

    const handleLogout = useCallback(() => {
        logDebug('Logging out due to inactivity');
        savePostLoginRedirectFromCurrentLocation();
        logout();
    }, [logout]);

    const {
        idleTimerRef,
        warningVisibleRef,
        pendingWarningUntilVisibleRef,
        warningPausedByHiddenRef,
        lastActivityLogAtRef,
        clearIdleTimer,
        clearWarningTimer,
        startWarningTimer,
    } = useIdleSessionTimers(warningTimeoutMs, handleLogout);

    const resetIdleTimer = useCallback(() => {
        if (!hasActiveSession()) {
            setIsWarningVisible(false);
            clearIdleTimer();
            clearWarningTimer();
            logDebug('No active session found; idle timers cleared');
            return;
        }

        if (warningVisibleRef.current) {
            logDebug('Activity resumed while warning modal visible; session kept alive');
        }

        pendingWarningUntilVisibleRef.current = false;
        warningPausedByHiddenRef.current = false;
        setIsWarningVisible(false);
        clearWarningTimer();
        clearIdleTimer();

        idleTimerRef.current = window.setTimeout(() => {
            if (!hasActiveSession()) return;
            if (document.visibilityState !== 'visible') {
                pendingWarningUntilVisibleRef.current = true;
                logDebug('Idle timeout reached while tab hidden; deferring warning until visible');
                return;
            }
            logDebug('Idle timeout reached; showing warning modal');
            setIsWarningVisible(true);
            startWarningTimer();
        }, idleTimeoutMs);
    }, [clearIdleTimer, clearWarningTimer, idleTimerRef, idleTimeoutMs, pendingWarningUntilVisibleRef, startWarningTimer, warningPausedByHiddenRef, warningVisibleRef]);

    useIdleSessionListeners({
        idleTimeoutMs,
        warningTimeoutMs,
        isWarningVisible,
        setIsWarningVisible,
        resetIdleTimer,
        startWarningTimer,
        clearIdleTimer,
        clearWarningTimer,
        warningVisibleRef,
        pendingWarningUntilVisibleRef,
        warningPausedByHiddenRef,
        lastActivityLogAtRef,
    });

    return {
        isWarningVisible,
        idleTimeoutMs,
        warningTimeoutMs,
        handleLogout,
        resetIdleTimer,
        logDebug,
    };
}
