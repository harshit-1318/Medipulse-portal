import { describe, it, expect } from 'vitest';
import { buildPrescriptionFilterQuery, mapPrescriptionItem } from '../helpers';

describe('Prescription Filter Query Builder & Item Mapper', () => {
  describe('Order ID Filter', () => {
    it('handles exact order ID', () => {
      const params = new URLSearchParams('orderId=MP-61644');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and).toBeDefined();
      expect(query.$and[0].$or).toBeDefined();
      expect(query.$and[0].$or[0].orderNumber.$regex).toBe('MP[- ]?61644');
    });

    it('strips leading # prefix from order ID', () => {
      const params = new URLSearchParams('orderId=%23MP-61644');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].orderNumber.$regex).toBe('MP[- ]?61644');
    });

    it('escapes special regex characters in order ID safely without crashing', () => {
      const params = new URLSearchParams('orderId=MP-(');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].orderNumber.$regex).toBe('MP[- ]?\\(');
    });

    it('matches partial and whitespace padded order IDs', () => {
      const params = new URLSearchParams('orderId=%20%2061644%20%20');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].orderNumber.$regex).toBe('61644');
    });
  });

  describe('Customer ID Filter', () => {
    it('handles valid customer ID', () => {
      const params = new URLSearchParams('customerId=674080');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and).toBeDefined();
      expect(query.$and[0].$or).toBeDefined();
      expect(query.$and[0].$or[0].customerId.$regex).toBe('674080');
      expect(query.$and[0].$or[1].storeOrderId.$regex).toBe('674080');
    });

    it('escapes regex metacharacters in customer ID safely', () => {
      const params = new URLSearchParams('customerId=[123');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].customerId.$regex).toBe('\\[123');
    });

    it('trims whitespace and strips # prefix from customer ID', () => {
      const params = new URLSearchParams('customerId=%20%20%23558467%20%20');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].customerId.$regex).toBe('558467');
    });
  });

  describe('Prescriber Filter', () => {
    it('searches prescriber across name, email, regNo, and gphcNumber', () => {
      const params = new URLSearchParams('prescriber=Dr.+Sarah');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and).toBeDefined();
      expect(query.$and[0].$or).toHaveLength(4);
      expect(query.$and[0].$or[0].pharmacistName.$regex).toBe('Dr\\. Sarah');
      expect(query.$and[0].$or[1].pharmacistEmail.$regex).toBe('Dr\\. Sarah');
      expect(query.$and[0].$or[2].pharmacistRegNo.$regex).toBe('Dr\\. Sarah');
      expect(query.$and[0].$or[3].gphcNumber.$regex).toBe('Dr\\. Sarah');
    });

    it('supports individual regNo param safely', () => {
      const params = new URLSearchParams('regNo=2089412');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].pharmacistRegNo.$regex).toBe('2089412');
      expect(query.$and[0].$or[1].gphcNumber.$regex).toBe('2089412');
    });

    it('escapes regex in prescriber input', () => {
      const params = new URLSearchParams('prescriber=sarah+(');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or[0].pharmacistName.$regex).toBe('sarah \\(');
    });
  });

  describe('Order Date and Review Date Filters', () => {
    it('filters orderDate to UTC day boundaries', () => {
      const params = new URLSearchParams('orderDate=2026-09-09');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and[0].$or).toBeDefined();
      const dateGte = query.$and[0].$or[0].orderDate.$gte;
      const dateLte = query.$and[0].$or[0].orderDate.$lte;
      expect(dateGte.toISOString()).toBe('2026-09-09T00:00:00.000Z');
      expect(dateLte.toISOString()).toBe('2026-09-09T23:59:59.999Z');
    });

    it('filters reviewDate to UTC day boundaries on generatedAt', () => {
      const params = new URLSearchParams('reviewDate=2026-09-09');
      const { query } = buildPrescriptionFilterQuery(params);
      const dateGte = query.$and[0].generatedAt.$gte;
      const dateLte = query.$and[0].generatedAt.$lte;
      expect(dateGte.toISOString()).toBe('2026-09-09T00:00:00.000Z');
      expect(dateLte.toISOString()).toBe('2026-09-09T23:59:59.999Z');
    });

    it('handles invalid dates defensively without throwing exception', () => {
      const params = new URLSearchParams('orderDate=invalid-date&reviewDate=another-bad-date');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and).toBeDefined();
      expect(query.$and[0].orderDate.$gt.toISOString()).toBe('9999-12-31T00:00:00.000Z');
      expect(query.$and[1].generatedAt.$gt.toISOString()).toBe('9999-12-31T00:00:00.000Z');
    });

    it('combines both Order Date and Review Date simultaneously via $and', () => {
      const params = new URLSearchParams('orderDate=2026-09-09&reviewDate=2026-09-10');
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and).toHaveLength(2);
      expect(query.$and[0].$or[0].orderDate.$gte.toISOString()).toBe('2026-09-09T00:00:00.000Z');
      expect(query.$and[1].generatedAt.$gte.toISOString()).toBe('2026-09-10T00:00:00.000Z');
    });
  });

  describe('Compound Filter Combinations', () => {
    it('applies AND logic across all 5 active filter criteria', () => {
      const params = new URLSearchParams(
        'orderId=MP-10797&customerId=657339&prescriber=Dr.+Sarah&orderDate=2026-09-09&reviewDate=2026-09-09'
      );
      const { query } = buildPrescriptionFilterQuery(params);
      expect(query.$and).toHaveLength(5);
    });
  });

  describe('Prescription Item Mapper', () => {
    it('maps real database fields without hardcoded dummy values', () => {
      const raw = {
        _id: '6aa1a5f185d4d391b903ea75',
        orderNumber: 'MP-10797',
        shopifyOrderId: '8305442557',
        storeOrderId: '657339',
        customerId: '657339',
        pharmacistName: 'Dr. Sarah Jenkins',
        pharmacistEmail: 'sarah.j@medipulse.io',
        pharmacistRegNo: '2089412',
        generatedAt: '2026-09-09T12:24:27.000Z',
        orderDate: '2026-09-09T12:24:27.000Z',
      };

      const mapped = mapPrescriptionItem(raw, 0);
      expect(mapped.shopifyOrderId).toBe('8305442557');
      expect(mapped.customerId).toBe('657339');
      expect(mapped.orderNumber).toBe('MP-10797');
      expect(mapped.pharmacistName).toBe('Dr. Sarah Jenkins');
      expect(mapped.pharmacistRegNo).toBe('2089412');
    });
  });
});
