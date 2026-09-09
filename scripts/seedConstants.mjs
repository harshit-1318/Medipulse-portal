import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEnv() {
  for (const envFile of ['.env.local', '.env.production', '.env']) {
    const p = path.join(__dirname, '..', envFile);
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf-8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}

export const FIRST_NAMES = ['Oliver', 'Emma', 'Liam', 'Sophia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper', 'Daniel'];
export const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Taylor', 'Anderson', 'Thomas', 'Wilson', 'Moore', 'Jackson', 'Martin'];
export const MEDICATIONS = [
  { name: 'Semaglutide 0.25mg Pen', price: 89.99, tag: 'Weight Management' },
  { name: 'Semaglutide 0.5mg Pen', price: 109.99, tag: 'Weight Management' },
  { name: 'Tirzepatide 2.5mg Pen', price: 120.00, tag: 'GLP-1' },
  { name: 'Tirzepatide 5.0mg Pen', price: 145.00, tag: 'GLP-1' },
  { name: 'Wegovy 1mg FlexTouch', price: 135.50, tag: 'Weight Management' },
  { name: 'Ozempic 1mg Pen', price: 115.00, tag: 'Diabetes / Weight' },
  { name: 'Finasteride 1mg Tablets (28)', price: 28.50, tag: 'Hair Loss' },
  { name: 'Sildenafil 50mg Tablets (8)', price: 34.00, tag: 'Men’s Health' },
];
export const STATUSES = ['completed', 'pending_doctor_approval', 'dispatched', 'consultation_approved', 'payment_pending'];
