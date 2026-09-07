import {
    ACTIVITY_EVENTS,
    ACTIVITY_LOG_THROTTLE_MS,
    logDebug,
} from './idleSessionUtils';

export function attachActivityListeners(
    lastActivityLogAtRef: React.MutableRefObject<number>,
    resetIdleTimer: () => void
) {
    const activityHandlers = ACTIVITY_EVENTS.map((eventName) => {
        const handler = () => {
            const now = Date.now();
            if (now - lastActivityLogAtRef.current >= ACTIVITY_LOG_THROTTLE_MS) {
                logDebug('Activity detected', { event: eventName });
                lastActivityLogAtRef.current = now;
            }
            resetIdleTimer();
        };

        window.addEventListener(eventName, handler, { passive: true });
        return { eventName, handler };
    });

    return () => {
        activityHandlers.forEach(({ eventName, handler }) => {
            window.removeEventListener(eventName, handler);
        });
    };
}

export function handleTabVisibilityChange(params: {
    warningVisibleRef: React.MutableRefObject<boolean>;
    pendingWarningUntilVisibleRef: React.MutableRefObject<boolean>;
    warningPausedByHiddenRef: React.MutableRefObject<boolean>;
    clearWarningTimer: () => void;
    startWarningTimer: () => void;
    resetIdleTimer: () => void;
    setIsWarningVisible: (val: boolean) => void;
}) {
    const {
        warningVisibleRef,
        pendingWarningUntilVisibleRef,
        warningPausedByHiddenRef,
        clearWarningTimer,
        startWarningTimer,
        resetIdleTimer,
        setIsWarningVisible,
    } = params;

    if (document.visibilityState === 'hidden' && warningVisibleRef.current) {
        clearWarningTimer();
        warningPausedByHiddenRef.current = true;
        logDebug('Tab hidden while warning visible; paused warning timeout until visible');
        return;
    }

    if (document.visibilityState !== 'visible') return;

    if (pendingWarningUntilVisibleRef.current) {
        pendingWarningUntilVisibleRef.current = false;
        logDebug('Tab became visible with deferred warning; showing warning modal now');
        setIsWarningVisible(true);
        startWarningTimer();
        return;
    }

    if (warningVisibleRef.current && warningPausedByHiddenRef.current) {
        logDebug('Tab became visible while warning open; resuming warning timeout');
        startWarningTimer();
        return;
    }

    logDebug('Tab became visible; refreshing idle timer');
    resetIdleTimer();
}
