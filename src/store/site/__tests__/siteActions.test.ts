import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSiteInfo, initializeSite } from '../siteActions';
import { useSiteStore } from '../siteStore';
import * as siteService from '@/api/services/site/siteService';
import * as brandingUtils from '@/utils/branding';

vi.mock('@/api/services/site/siteService');
vi.mock('@/utils/branding');

describe('Site Actions (src/store/site/siteActions.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useSiteStore.setState({ siteInfo: {}, isLoading: false, error: null });
  });

  it('fetches site info and sets localStorage headers on success', async () => {
    const mockSite: any = {
      id: 'site_abc',
      key: 'key_123',
      name: 'MediPulse Portal',
      small_icon_url: 'https://cdn.example.com/icon.ico',
    };
    vi.mocked(siteService.getSiteInfoApi).mockResolvedValueOnce(mockSite);

    const result = await fetchSiteInfo('portal.medipulse.io');

    expect(result).toEqual(mockSite);
    expect(useSiteStore.getState().siteInfo).toEqual(mockSite);
    expect(useSiteStore.getState().isLoading).toBe(false);
    expect(localStorage.getItem('X-SITE-ID')).toBe('site_abc');
    expect(localStorage.getItem('X-SITE-KEY')).toBe('key_123');
    expect(localStorage.getItem('X-SITE-HOST')).toBe('portal.medipulse.io');
    expect(brandingUtils.applySiteFavicon).toHaveBeenCalledWith('https://cdn.example.com/icon.ico');
  });

  it('handles empty site data response and sets error', async () => {
    vi.mocked(siteService.getSiteInfoApi).mockResolvedValueOnce(null as any);

    const result = await fetchSiteInfo('unknown.domain');
    expect(result).toBeNull();
    expect(useSiteStore.getState().error).toBe('No site data received');
    expect(useSiteStore.getState().isLoading).toBe(false);
  });

  it('catches and handles API failures during fetchSiteInfo', async () => {
    vi.mocked(siteService.getSiteInfoApi).mockRejectedValueOnce(new Error('Network failure'));

    const result = await fetchSiteInfo('failing.domain');
    expect(result).toBeNull();
    expect(useSiteStore.getState().error).toBe('Network failure');
    expect(useSiteStore.getState().isLoading).toBe(false);
  });

  it('initializes site from cached store without re-fetching if host matches', async () => {
    const targetHost = process.env.NEXT_PUBLIC_DEFAULT_SITE_HOST || 'localhost';
    localStorage.setItem('X-SITE-HOST', targetHost);
    useSiteStore.setState({
      siteInfo: { id: 'cached_id', key: 'cached_key', small_icon_url: '/icon.png' } as any,
    });

    await initializeSite();

    expect(siteService.getSiteInfoApi).not.toHaveBeenCalled();
    expect(localStorage.getItem('X-SITE-ID')).toBe('cached_id');
  });
});
