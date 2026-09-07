import { useEffect } from 'react';
import {
    IDLE_TIMEOUT_OVERRIDE_KEY,
    WARNING_TIMEOUT_OVERRIDE_KEY,
    hasActiveSession,
    logDebug,
} from './idleSessionUtils';
import { attachActivityListeners, handleTabVisibilityChange } from './useIdleSessionHandlers';

interface UseIdleSessionListenersParams {
    idleTimeoutMs: number;
    warningTimeoutMs: number;
    isWarningVisible: boolean;
    setIsWarningVisible: (val: boolean) => void;
    resetIdleTimer: () => void;
    startWarningTimer: () => void;
    clearIdleTimer: () => void;
    clearWarningTimer: () => void;
    warningVisibleRef: React.MutableRefObject<boolean>;
    pendingWarningUntilVisibleRef: React.MutableRefObject<boolean>;
    warningPausedByHiddenRef: React.MutableRefObject<boolean>;
    lastActivityLogAtRef: React.MutableRefObject<number>;
}

export function useIdleSessionListeners(params: UseIdleSessionListenersParams) {
    const {
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
    } = params;

    useEffect(() => {
        warningVisibleRef.current = isWarningVisible;
    }, [isWarningVisible, warningVisibleRef]);

    useEffect(() => {
        if (!hasActiveSession()) {
            logDebug('Idle manager skipped because no active session exists');
            return;
        }

        logDebug('Idle manager mounted', {
            idleTimeoutMs,
            warningTimeoutMs,
            idleTimeoutOverride: typeof window !== 'undefined' ? window.localStorage.getItem(IDLE_TIMEOUT_OVERRIDE_KEY) : null,
            warningTimeoutOverride: typeof window !== 'undefined' ? window.localStorage.getItem(WARNING_TIMEOUT_OVERRIDE_KEY) : null,
        });

        const detachActivityListeners = attachActivityListeners(lastActivityLogAtRef, resetIdleTimer);

        const onVisibilityChange = () =>
            handleTabVisibilityChange({
                warningVisibleRef,
                pendingWarningUntilVisibleRef,
                warningPausedByHiddenRef,
                clearWarningTimer,
                startWarningTimer,
                resetIdleTimer,
                setIsWarningVisible,
            });

        document.addEventListener('visibilitychange', onVisibilityChange);
        resetIdleTimer();

        return () => {
            detachActivityListeners();
            document.removeEventListener('visibilitychange', onVisibilityChange);
            clearIdleTimer();
            clearWarningTimer();
            logDebug('Idle manager unmounted and timers cleared');
        };
    }, [
        clearIdleTimer,
        clearWarningTimer,
        idleTimeoutMs,
        lastActivityLogAtRef,
        pendingWarningUntilVisibleRef,
        resetIdleTimer,
        setIsWarningVisible,
        startWarningTimer,
        warningPausedByHiddenRef,
        warningTimeoutMs,
        warningVisibleRef,
    ]);
}
