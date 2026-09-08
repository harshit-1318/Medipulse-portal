import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

if (typeof process.loadEnvFile === 'function') {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    try {
      process.loadEnvFile(envLocalPath);
      delete process.env.NEXT_PUBLIC_AUTO_RESYNC;
    } catch {
      // ignore
    }
  }
}
