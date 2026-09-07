import { useState, useRef, useEffect } from 'react';

export function useSidebarFlyoutHover(isCollapsed: boolean, hasChildren: boolean) {
    const triggerRef = useRef<HTMLAnchorElement | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
    const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, left: 0 });

    const clearCloseTimer = () => {
        if (closeTimerRef.current !== null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const updateFlyoutPosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setFlyoutPosition({
            top: Math.max(8, rect.top),
            left: rect.right + 6,
        });
    };

    const openFlyout = () => {
        if (!isCollapsed || !hasChildren) return;
        clearCloseTimer();
        updateFlyoutPosition();
        setIsFlyoutOpen(true);
    };

    const scheduleCloseFlyout = () => {
        if (!isCollapsed || !hasChildren) return;
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => setIsFlyoutOpen(false), 120);
    };

    useEffect(() => {
        return () => clearCloseTimer();
    }, []);

    useEffect(() => {
        if (!isCollapsed) {
            setIsFlyoutOpen(false);
            clearCloseTimer();
        }
    }, [isCollapsed]);

    useEffect(() => {
        if (!isFlyoutOpen || !isCollapsed) return;
        const handleViewportChange = () => updateFlyoutPosition();
        window.addEventListener('scroll', handleViewportChange, true);
        window.addEventListener('resize', handleViewportChange);
        return () => {
            window.removeEventListener('scroll', handleViewportChange, true);
            window.removeEventListener('resize', handleViewportChange);
        };
    }, [isFlyoutOpen, isCollapsed]);

    return {
        triggerRef,
        isFlyoutOpen,
        flyoutPosition,
        openFlyout,
        scheduleCloseFlyout,
    };
}
