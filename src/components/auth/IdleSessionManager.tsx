import { useIdleSession } from './hooks/useIdleSession';
import IdleWarningModal from './IdleWarningModal';

export default function IdleSessionManager() {
    const {
        isWarningVisible,
        idleTimeoutMs,
        warningTimeoutMs,
        handleLogout,
        resetIdleTimer,
        logDebug,
    } = useIdleSession();

    return (
        <IdleWarningModal
            isVisible={isWarningVisible}
            idleTimeoutMs={idleTimeoutMs}
            warningTimeoutMs={warningTimeoutMs}
            onLogout={handleLogout}
            onStayLoggedIn={() => {
                logDebug('User clicked Stay logged in');
                resetIdleTimer();
            }}
        />
    );
}
