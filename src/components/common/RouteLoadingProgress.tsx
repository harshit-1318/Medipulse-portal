import { useEffect, useState } from "react";
import { useGlobalLoader } from '@/store';

export default function RouteLoadingProgress() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const { loading } = useGlobalLoader();

    useEffect(() => {
        // Unique ID for route navigations
        const ROUTE_LOADER_ID = 'route-navigation';
        let routeTimeout: ReturnType<typeof setTimeout>;

        const handleStart = () => {
            useGlobalLoader.getState().start(ROUTE_LOADER_ID);
            // Safety fallback: if Astro fails to fire a page load event, clear the loader after 5 seconds
            clearTimeout(routeTimeout);
            routeTimeout = setTimeout(() => {
                useGlobalLoader.getState().stop(ROUTE_LOADER_ID);
            }, 5000);
        };

        const handleStop = () => {
            clearTimeout(routeTimeout);
            useGlobalLoader.getState().stop(ROUTE_LOADER_ID);
        };

        // Listen to Astro route events for SPA feel navigation
        document.addEventListener('astro:before-preparation', handleStart);
        document.addEventListener('astro:page-load', handleStop);
        document.addEventListener('astro:after-swap', handleStop);

        // Custom failsafe from Layout
        window.addEventListener('start-route-load', handleStart);

        return () => {
            clearTimeout(routeTimeout);
            document.removeEventListener('astro:before-preparation', handleStart);
            document.removeEventListener('astro:page-load', handleStop);
            document.removeEventListener('astro:after-swap', handleStop);
            window.removeEventListener('start-route-load', handleStart);
        };
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        let timeout: ReturnType<typeof setTimeout>;
        let resetTimeout: ReturnType<typeof setTimeout>;

        if (loading) {
            setVisible(true);
            setProgress(0);
            let currentProgress = 0;
            // Start progress incrementally
            interval = setInterval(() => {
                if (currentProgress < 90) {
                    currentProgress += (90 - currentProgress) * 0.1; // Logarithmic-ish approach
                    if (currentProgress < 1) currentProgress = 1;
                    setProgress(currentProgress);
                }
            }, 100);
        } else {
            // Complete progress
            setProgress(100);
            // Hide after a brief moment to show it reached 100%
            timeout = setTimeout(() => {
                setVisible(false);
                // Reset progress internally after it's hidden
                resetTimeout = setTimeout(() => setProgress(0), 300);
            }, 400);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            clearTimeout(resetTimeout);
        };
    }, [loading]);

    if (!visible && progress === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-9999 w-screen h-1 bg-transparent pointer-events-none">
            <div
                className="h-full bg-linear-to-r from-brand-ocean via-brand-teal to-brand-cyan shadow-brand transition-all ease-out"
                style={{
                    width: `${progress}%`,
                    opacity: visible ? 1 : 0,
                    transitionDuration: loading ? '100ms' : '300ms'
                }}
            />
        </div>
    );
}
