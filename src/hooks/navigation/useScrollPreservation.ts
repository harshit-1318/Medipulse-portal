import { useEffect, useRef } from "react";

/**
 * useScrollPreservation Hook
 * 
 * Saves and restores scroll position of a specific element.
 * 
 * @param key Unique key for sessionStorage
 * @param loading Boolean indicating if data is still loading
 */
export function useScrollPreservation(key: string, loading: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollKey = `scroll_pos_${key}`;

    // Restore scroll position after loading completes
    useEffect(() => {
        if (!loading && typeof window !== 'undefined') {
            const savedPos = sessionStorage.getItem(scrollKey);
            if (savedPos && containerRef.current) {
                const targetScroll = Number(savedPos);
                // Use requestAnimationFrame + setTimeout to ensure DOM is fully rendered and stable
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        if (containerRef.current) {
                            containerRef.current.scrollTo({ top: targetScroll, behavior: 'instant' });
                        }
                    }, 150); // Increased buffer slightly for complex table renders
                });
            }
        }
    }, [loading, scrollKey, key]);

    // Save scroll position on scroll
    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target) {
                sessionStorage.setItem(scrollKey, String(target.scrollTop));
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [scrollKey]);

    // Also save on unmount just in case
    useEffect(() => {
        return () => {
            if (containerRef.current) {
                sessionStorage.setItem(scrollKey, String(containerRef.current.scrollTop));
            }
        };
    }, [scrollKey]);

    return containerRef;
}
