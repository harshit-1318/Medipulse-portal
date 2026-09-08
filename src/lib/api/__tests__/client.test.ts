import { describe, it, expect, vi } from 'vitest';
import { APIClient, apiClient } from '../client';

describe('APIClient (src/lib/api/client.ts)', () => {
  it('instantiates the singleton apiClient correctly', () => {
    expect(apiClient).toBeInstanceOf(APIClient);
  });

  it('delegates get calls with string url and config object', async () => {
    const client = new APIClient();
    const reqSpy = vi.spyOn(client, 'request').mockResolvedValue({ ok: true });

    await client.get('/test-endpoint');
    expect(reqSpy).toHaveBeenCalledWith({ url: '/test-endpoint', method: 'GET' });

    await client.get({ url: '/test-obj', params: { page: 1 } });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/test-obj', params: { page: 1 }, method: 'GET' });
  });

  it('delegates post calls with string url + data and config object', async () => {
    const client = new APIClient();
    const reqSpy = vi.spyOn(client, 'request').mockResolvedValue({ id: 1 });

    await client.post('/create', { name: 'Item' });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/create', method: 'POST', data: { name: 'Item' } });

    await client.post({ url: '/create-obj', data: { val: 2 } });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/create-obj', method: 'POST', data: { val: 2 } });
  });

  it('delegates put calls with string url + data and config object', async () => {
    const client = new APIClient();
    const reqSpy = vi.spyOn(client, 'request').mockResolvedValue({ updated: true });

    await client.put('/update/1', { name: 'New' });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/update/1', method: 'PUT', data: { name: 'New' } });

    await client.put({ url: '/update/2', data: { name: 'Two' } });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/update/2', method: 'PUT', data: { name: 'Two' } });
  });

  it('delegates patch calls with string url + data and config object', async () => {
    const client = new APIClient();
    const reqSpy = vi.spyOn(client, 'request').mockResolvedValue({ patched: true });

    await client.patch('/patch/1', { status: 'active' });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/patch/1', method: 'PATCH', data: { status: 'active' } });

    await client.patch({ url: '/patch/2', data: { status: 'pending' } });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/patch/2', method: 'PATCH', data: { status: 'pending' } });
  });

  it('delegates delete calls with string url and config object', async () => {
    const client = new APIClient();
    const reqSpy = vi.spyOn(client, 'request').mockResolvedValue({ deleted: true });

    await client.delete('/remove/1');
    expect(reqSpy).toHaveBeenCalledWith({ url: '/remove/1', method: 'DELETE' });

    await client.delete({ url: '/remove/2', params: { hard: true } });
    expect(reqSpy).toHaveBeenCalledWith({ url: '/remove/2', params: { hard: true }, method: 'DELETE' });
  });
});
