import { describe, it, expect } from 'vitest';
import { detectOrderStatus, getOrderStatusStyle, getDisplayStatus } from '../../utils/status';

describe('order-details status utils', () => {
  describe('detectOrderStatus', () => {
    it('detects unfulfilled status correctly from fulfillmentStatus', () => {
      expect(detectOrderStatus('unfulfilled', 'pending_doctor_approval')).toBe('UNFULFILLED');
      expect(detectOrderStatus('UNFULFILLED', 'any')).toBe('UNFULFILLED');
    });

    it('detects fulfilled status correctly from fulfillmentStatus', () => {
      expect(detectOrderStatus('fulfilled', 'completed')).toBe('FULFILLED');
      expect(detectOrderStatus('completed', undefined)).toBe('FULFILLED');
      expect(detectOrderStatus(undefined, 'dispatched')).toBe('FULFILLED');
    });

    it('prioritizes on_hold when either source indicates on hold', () => {
      expect(detectOrderStatus('on_hold', 'fulfilled')).toBe('ON_HOLD');
      expect(detectOrderStatus('fulfilled', 'on_hold')).toBe('ON_HOLD');
      expect(detectOrderStatus('hold', undefined)).toBe('ON_HOLD');
    });

    it('detects cancelled status correctly', () => {
      expect(detectOrderStatus('cancelled', 'cancelled')).toBe('CANCELLED');
      expect(detectOrderStatus(undefined, 'voided')).toBe('CANCELLED');
    });

    it('falls back to unfulfilled for pending medical approvals when fulfillmentStatus is missing', () => {
      expect(detectOrderStatus(undefined, 'pending_doctor_approval')).toBe('UNFULFILLED');
      expect(detectOrderStatus(null, 'payment_pending')).toBe('UNFULFILLED');
      expect(detectOrderStatus('', 'consultation_approved')).toBe('UNFULFILLED');
    });

    it('defaults to UNFULFILLED when both statuses are empty', () => {
      expect(detectOrderStatus(undefined, undefined)).toBe('UNFULFILLED');
    });
  });

  describe('getOrderStatusStyle', () => {
    it('returns amber styling for UNFULFILLED', () => {
      const style = getOrderStatusStyle('UNFULFILLED');
      expect(style.label).toBe('Unfulfilled');
      expect(style.text).toContain('amber');
    });

    it('returns emerald styling for FULFILLED', () => {
      const style = getOrderStatusStyle('FULFILLED');
      expect(style.label).toBe('Fulfilled');
      expect(style.text).toContain('emerald');
    });

    it('returns orange styling for ON_HOLD', () => {
      const style = getOrderStatusStyle('ON_HOLD');
      expect(style.label).toBe('On Hold');
      expect(style.text).toContain('orange');
    });

    it('returns red styling for CANCELLED', () => {
      const style = getOrderStatusStyle('CANCELLED');
      expect(style.label).toBe('Cancelled');
      expect(style.text).toContain('red');
    });
  });

  describe('getDisplayStatus', () => {
    it('returns Unfulfilled for empty status', () => {
      expect(getDisplayStatus(null)).toBe('Unfulfilled');
      expect(getDisplayStatus(undefined)).toBe('Unfulfilled');
    });

    it('formats recognized status labels properly', () => {
      expect(getDisplayStatus('UNFULFILLED')).toBe('Unfulfilled');
      expect(getDisplayStatus('FULFILLED')).toBe('Fulfilled');
    });
  });
});
