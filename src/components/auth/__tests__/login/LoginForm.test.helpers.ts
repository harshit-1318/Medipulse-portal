import { vi } from 'vitest';
import { useUserStore } from '@/store';

export const commonBeforeEach = (mockSetUser: any, mockSetToken: any) => {
    vi.clearAllMocks();
    vi.mocked(useUserStore).mockImplementation((selector: any) => {
        const state = {
            actions: {
                setUser: mockSetUser,
                setToken: mockSetToken,
            }
        };
        return selector ? selector(state) : state;
    });

    Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
    });

    Storage.prototype.setItem = vi.fn();
};
