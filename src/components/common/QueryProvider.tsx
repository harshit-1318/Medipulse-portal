import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { initializeSite } from '@/store';
import '@/utils/http';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    }));

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                // Ensure site info and headers are loaded before rendering children
                await initializeSite();
            } catch (err) {
                console.error('Failed to initialize site:', err);
            } finally {
                setIsInitialized(true);
            }
        };
        init();
    }, []);

    // Prevent rendering children (which might trigger API calls) until site is ready
    if (!isInitialized) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-9999">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-500 font-medium text-sm">Initializing...</span>
                </div>
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
