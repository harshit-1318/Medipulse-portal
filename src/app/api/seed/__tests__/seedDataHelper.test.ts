import { describe, it, expect } from 'vitest';
import { generateSeedBatch, getRandomDateForDay } from '../seedDataHelper';

describe('seedDataHelper', () => {
  it('generates random date within the specified day', () => {
    const d = getRandomDateForDay('2026-09-09');
    expect(d).toBeInstanceOf(Date);
    expect(d.toISOString()).toContain('2026-09-09');
  });

  it('generates the requested batch count with realistic structure', () => {
    const { orders, rxList, customers } = generateSeedBatch('2026-09-09', 5);

    expect(orders).toHaveLength(5);
    expect(rxList).toHaveLength(5);
    expect(customers).toHaveLength(5);

    const firstOrder = orders[0];
    expect(firstOrder.orderNumber).toMatch(/^MP-\d+$/);
    expect(firstOrder.customerName).toBeDefined();
    expect(firstOrder.customerEmail).toContain('@');
    expect(firstOrder.total).toBeGreaterThan(0);
    expect(firstOrder.tags).toContain('mock_seed');
    expect(firstOrder.createdAt.toISOString()).toContain('2026-09-09');

    const firstRx = rxList[0];
    expect(firstRx.orderNumber).toBe(firstOrder.orderNumber);
    expect(firstRx.patientName).toBe(firstOrder.customerName);
    expect(firstRx.patientEmail).toBe(firstOrder.customerEmail);
  });
});
