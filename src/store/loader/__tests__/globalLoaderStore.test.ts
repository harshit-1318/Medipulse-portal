import { describe, it, expect, beforeEach } from 'vitest';
import { useGlobalLoader } from '../globalLoaderStore';

describe('GlobalLoaderStore (src/store/loader/globalLoaderStore.ts)', () => {
  beforeEach(() => {
    useGlobalLoader.setState({ loading: false, activeRequests: new Set() });
  });

  it('starts with loading false and empty activeRequests set', () => {
    const state = useGlobalLoader.getState();
    expect(state.loading).toBe(false);
    expect(state.activeRequests.size).toBe(0);
  });

  it('sets loading true when request starts', () => {
    useGlobalLoader.getState().start('req-1');
    const state = useGlobalLoader.getState();
    expect(state.loading).toBe(true);
    expect(state.activeRequests.has('req-1')).toBe(true);
  });

  it('tracks concurrent requests and sets loading false only when all complete', () => {
    const { start, stop } = useGlobalLoader.getState();
    start('req-1');
    start('req-2');

    expect(useGlobalLoader.getState().loading).toBe(true);
    expect(useGlobalLoader.getState().activeRequests.size).toBe(2);

    stop('req-1');
    expect(useGlobalLoader.getState().loading).toBe(true);
    expect(useGlobalLoader.getState().activeRequests.size).toBe(1);

    stop('req-2');
    expect(useGlobalLoader.getState().loading).toBe(false);
    expect(useGlobalLoader.getState().activeRequests.size).toBe(0);
  });

  it('handles stop on non-existent request gracefully', () => {
    useGlobalLoader.getState().stop('non-existent');
    const state = useGlobalLoader.getState();
    expect(state.loading).toBe(false);
    expect(state.activeRequests.size).toBe(0);
  });
});
