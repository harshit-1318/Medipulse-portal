import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { connectToDatabase } from '../mongodb';

describe('MongoDB Connection Utility (src/lib/db/mongodb.ts)', () => {
  const originalUri = process.env.MONGODB_URI;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.MONGODB_URI = originalUri;
  });

  it('throws a descriptive error when MONGODB_URI is not set', async () => {
    delete process.env.MONGODB_URI;
    await expect(connectToDatabase()).rejects.toThrow('Please define the MONGODB_URI environment variable');
  });

  it('connects to mongoose and returns cached connection on subsequent calls', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test-medipulse';
    const mockMongooseInstance = { connection: { readyState: 1 } } as any;

    const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValueOnce(mockMongooseInstance);

    const firstCall = await connectToDatabase();
    expect(connectSpy).toHaveBeenCalledWith('mongodb://localhost:27017/test-medipulse', { bufferCommands: false });
    expect(firstCall).toBe(mockMongooseInstance);

    // Second call should return cached instance without calling connect again
    const secondCall = await connectToDatabase();
    expect(secondCall).toBe(mockMongooseInstance);
    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});
