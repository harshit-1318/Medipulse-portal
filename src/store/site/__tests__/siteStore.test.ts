import { describe, it, expect, beforeEach } from 'vitest';
import { useSiteStore, useSiteActions } from '../siteStore';

describe('SiteStore (src/store/site/siteStore.ts)', () => {
  beforeEach(() => {
    useSiteStore.setState({
      siteInfo: {},
      currentOrderLabel: undefined,
      isLoading: false,
      error: null,
    });
  });

  it('initializes with default empty state', () => {
    const state = useSiteStore.getState();
    expect(state.siteInfo).toEqual({});
    expect(state.currentOrderLabel).toBeUndefined();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('updates state directly through setState', () => {
    useSiteStore.setState({
      siteInfo: { id: 'site_100', name: 'MediPulse Main' } as any,
      isLoading: true,
      error: 'Network glitch',
    });

    const state = useSiteStore.getState();
    expect(state.siteInfo.id).toBe('site_100');
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe('Network glitch');
  });

  it('updates currentOrderLabel via useSiteActions', () => {
    const actions = useSiteActions();
    actions.updateCurrentOrderLabel('Prescription Batch #12');
    expect(useSiteStore.getState().currentOrderLabel).toBe('Prescription Batch #12');

    actions.updateCurrentOrderLabel(undefined);
    expect(useSiteStore.getState().currentOrderLabel).toBeUndefined();
  });
});
