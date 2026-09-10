import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('2. Order ID + Each Other Filter Combinations', () => {

  test('TC-COMB-001: Order ID + Status (#MP-46287 + Unfulfilled)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectStatus('Unfulfilled');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].status.toUpperCase()).toContain('UNFULFILLED');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying both Order ID and Status conditions';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-001',
        combination: 'Order ID + Status',
        input: '#MP-46287 + Unfulfilled',
        expected: '#MP-46287 returned satisfying both conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-002: Order ID + Customer (#MP-46287 + Liam Moore)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setCustomer('Liam Moore');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].customerName.toLowerCase()).toContain('liam moore');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying both Order ID and Customer conditions';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-002',
        combination: 'Order ID + Customer',
        input: '#MP-46287 + Liam Moore',
        expected: '#MP-46287 returned satisfying both conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-003: Order ID + Customer Orders (#MP-46287 + Repeat Orders)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectCustomerOrders('Repeat Orders');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying Repeat Orders condition';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-003',
        combination: 'Order ID + Customer Orders',
        input: '#MP-46287 + Repeat Orders',
        expected: '#MP-46287 returned satisfying both conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-004: Order ID + Product Type (#MP-46287 + Oral)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectProductType('Oral');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].productName.toLowerCase()).toContain('sildenafil');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying both Order ID and Oral Product Type';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-004',
        combination: 'Order ID + Product Type',
        input: '#MP-46287 + Oral',
        expected: '#MP-46287 returned with Oral medication',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-005: Order ID + Documents (#MP-46287 + Not Uploaded)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectDocuments('Not Uploaded');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying Documents Not Uploaded condition';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-005',
        combination: 'Order ID + Documents',
        input: '#MP-46287 + Not Uploaded',
        expected: '#MP-46287 returned',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-006: Order ID + Start Date (#MP-46287 + 2026-09-10)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setStartDate('2026-09-10');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying Start Date boundary';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-006',
        combination: 'Order ID + Start Date',
        input: '#MP-46287 + 2026-09-10',
        expected: '#MP-46287 returned',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-007: Order ID + End Date (#MP-46287 + 2026-09-10)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setEndDate('2026-09-10');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying End Date boundary';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-007',
        combination: 'Order ID + End Date',
        input: '#MP-46287 + 2026-09-10',
        expected: '#MP-46287 returned',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-008: Order ID + Product Category (#MP-46287 + Weight Loss - Incompatible)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectProductCategory('Weight Loss');
      });

      // Since #MP-46287 is ED (Sildenafil), combining with Weight Loss must return 0 results
      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      passed = true;
      actualResult = 'Correctly returned empty state (0 results) for incompatible Order ID + Product Category combination';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-008',
        combination: 'Order ID + Product Category',
        input: '#MP-46287 + Weight Loss',
        expected: 'Empty state (0 results) due to logical incompatibility',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-009: Order ID + Product Name (#MP-46287 + Sildenafil)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setProductName('Sildenafil');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].productName.toLowerCase()).toContain('sildenafil');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying both Order ID and Product Name';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-009',
        combination: 'Order ID + Product Name',
        input: '#MP-46287 + Sildenafil',
        expected: '#MP-46287 returned satisfying both filters',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-010: Order ID + Mark as Urgent Orders (Incompatible #MP-46287 & Compatible YM-1002)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      // 1. Incompatible: #MP-46287 is not urgent -> should return 0 results
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setUrgent(true);
      });
      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      // 2. Compatible: YM-1002 is urgent -> should return YM-1002
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.clickClearAll();
        await modal.setOrderId('YM-1002');
        await modal.setUrgent(true);
      });
      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#YM-1002');
      expect(results[0].isUrgent).toBe(true);

      passed = true;
      actualResult = 'Correctly returned empty state for non-urgent #MP-46287, and returned #YM-1002 for urgent order';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-010',
        combination: 'Order ID + Urgent',
        input: '#MP-46287 (Urgent: ON) and #YM-1002 (Urgent: ON)',
        expected: 'Empty state for #MP-46287; #YM-1002 returned for urgent anchor',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-COMB-011: Order ID + Mark as Parked Orders (Incompatible #MP-46287 & Compatible MP-78007)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      // 1. Incompatible: #MP-46287 is not parked -> should return 0 results
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setParked(true);
      });
      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      // 2. Compatible: MP-78007 is parked -> should return MP-78007
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.clickClearAll();
        await modal.setOrderId('MP-78007');
        await modal.setParked(true);
      });
      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-78007');
      expect(results[0].isParked).toBe(true);

      passed = true;
      actualResult = 'Correctly returned empty state for non-parked #MP-46287, and returned #MP-78007 for parked order';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-COMB-011',
        combination: 'Order ID + Parked',
        input: '#MP-46287 (Parked: ON) and #MP-78007 (Parked: ON)',
        expected: 'Empty state for #MP-46287; #MP-78007 returned for parked anchor',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

});
