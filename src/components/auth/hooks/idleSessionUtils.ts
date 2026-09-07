import Cookies from 'js-cookie';
import { isLocalStorageDebugFlagEnabled } from '@/utils/env';

export const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
export const WARNING_TIMEOUT_MS = 60 * 1000;
export const IDLE_DEBUG_FLAG = 'DEBUG_IDLE_TIMER';
export const IDLE_TIMEOUT_OVERRIDE_KEY = 'DEBUG_IDLE_TIMEOUT_MS';
export const WARNING_TIMEOUT_OVERRIDE_KEY = 'DEBUG_IDLE_WARNING_TIMEOUT_MS';
export const ACTIVITY_LOG_THROTTLE_MS = 1000;

export const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'pointerdown',
];

export function getTimeoutOverride(key: string, fallbackMs: number): number {
    if (typeof window === 'undefined') {
        return fallbackMs;
    }

    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
        return fallbackMs;
    }

    const parsedValue = Number(rawValue);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
        return fallbackMs;
    }

    return parsedValue;
}

export function hasActiveSession(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return Boolean(Cookies.get('token') || localStorage.getItem('accessToken'));
}

export function logDebug(message: string, payload?: Record<string, unknown>): void {
    if (!isLocalStorageDebugFlagEnabled(IDLE_DEBUG_FLAG)) {
        return;
    }

    if (payload) {
        console.log('[IDLE_DEBUG]', message, payload);
        return;
    }

    console.log('[IDLE_DEBUG]', message);
}

export function clearTimerRef(timerRef: { current: number | null }): void {
    if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
    }
}


