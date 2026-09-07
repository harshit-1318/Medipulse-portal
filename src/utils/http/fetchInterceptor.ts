import { useGlobalLoader } from '@/store';

if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const { start, stop } = useGlobalLoader.getState();
        const reqId = Math.random().toString(36).substring(7);

        // Start loader
        start(reqId);

        try {
            const response = await originalFetch(...args);
            return response;
        } finally {
            // Stop loader regardless of success or failure
            stop(reqId);
        }
    };
}
