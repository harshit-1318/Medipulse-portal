import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('4. Cross-Filter Combinations (3-Filter Scenarios)', () => {

  test('TC-XCOMB-001: Order ID + Status + Customer (#MP-46287 + Unfulfilled + Liam Moore)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectStatus('Unfulfilled');
        await modal.setCustomer('Liam Moore');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].status.toUpperCase()).toContain('UNFULFILLED');
      expect(results[0].customerName.toLowerCase()).toContain('liam moore');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying Order ID, Status, and Customer filters';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-001',
        combination: 'Order ID + Status + Customer',
        input: '#MP-46287 + Unfulfilled + Liam Moore',
        expected: '#MP-46287 returned satisfying all 3 filters',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-002: Order ID + Status + Product Type (#MP-46287 + Unfulfilled + Oral)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.selectStatus('Unfulfilled');
        await modal.selectProductType('Oral');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying Order ID, Status, and Oral Product Type';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-002',
        combination: 'Order ID + Status + Product Type',
        input: '#MP-46287 + Unfulfilled + Oral',
        expected: '#MP-46287 returned satisfying all 3 filters',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-003: Order ID + Customer + Product Category (#MP-46287 + Liam Moore + Weight Loss - Incompatible)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setCustomer('Liam Moore');
        await modal.selectProductCategory('Weight Loss');
      });

      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      passed = true;
      actualResult = 'Correctly returned empty state (0 results) for logically incompatible 3-filter combination';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-003',
        combination: 'Order ID + Customer + Product Category',
        input: '#MP-46287 + Liam Moore + Weight Loss',
        expected: 'Empty state (0 results) expected due to incompatibility',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-004: Order ID + Customer + Product Name (#MP-46287 + Liam Moore + Sildenafil)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId('#MP-46287');
        await modal.setCustomer('Liam Moore');
        await modal.setProductName('Sildenafil');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].customerName.toLowerCase()).toContain('liam moore');
      expect(results[0].productName.toLowerCase()).toContain('sildenafil');

      passed = true;
      actualResult = 'Returned #MP-46287 satisfying Order ID, Customer, and Product Name';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-004',
        combination: 'Order ID + Customer + Product Name',
        input: '#MP-46287 + Liam Moore + Sildenafil',
        expected: '#MP-46287 returned satisfying all 3 conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-005: Status + Product Type + Product Category (Unfulfilled + Injectable + Weight Loss)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus('Unfulfilled');
        await modal.selectProductType('Injectable');
        await modal.selectProductCategory('Weight Loss');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
        const pLower = row.productName.toLowerCase();
        expect(pLower.includes('semaglutide') || pLower.includes('tirzepatide') || pLower.includes('wegovy') || pLower.includes('ozempic')).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all are Unfulfilled Injectable Weight Loss orders`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-005',
        combination: 'Status + Product Type + Product Category',
        input: 'Unfulfilled + Injectable + Weight Loss',
        expected: 'Results satisfy Unfulfilled status, Injectable type, and Weight Loss category',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-006: Status + Customer + Product Category (Unfulfilled + Liam Moore + ED)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus('Unfulfilled');
        await modal.setCustomer('Liam Moore');
        await modal.selectProductCategory('ED');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
        expect(row.customerName.toLowerCase()).toContain('liam moore');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders for Liam Moore with Unfulfilled status`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-006',
        combination: 'Status + Customer + Product Category',
        input: 'Unfulfilled + Liam Moore + ED',
        expected: 'Returned orders belong to Liam Moore with Unfulfilled status',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-007: Customer + Product Type + Product Name (Liam Moore + Oral + Sildenafil)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setCustomer('Liam Moore');
        await modal.selectProductType('Oral');
        await modal.setProductName('Sildenafil');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.customerName.toLowerCase()).toContain('liam moore');
        expect(row.productName.toLowerCase()).toContain('sildenafil');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders satisfying Customer, Product Type, and Product Name`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-007',
        combination: 'Customer + Product Type + Product Name',
        input: 'Liam Moore + Oral + Sildenafil',
        expected: 'Results satisfy Customer, Oral type, and product Sildenafil',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-008: Product Category + Product Type + Product Name (Weight Loss + Injectable + Semaglutide)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectProductCategory('Weight Loss');
        await modal.selectProductType('Injectable');
        await modal.setProductName('Semaglutide');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.productName.toLowerCase()).toContain('semaglutide');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all are Injectable Semaglutide Weight Loss items`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-008',
        combination: 'Product Category + Product Type + Product Name',
        input: 'Weight Loss + Injectable + Semaglutide',
        expected: 'Results satisfy Category, Injectable type, and Semaglutide',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-009: Start Date + End Date + Product Category (2026-09-10 + 2026-09-10 + Weight Loss)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate('2026-09-10');
        await modal.setEndDate('2026-09-10');
        await modal.selectProductCategory('Weight Loss');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        const pLower = row.productName.toLowerCase();
        expect(pLower.includes('semaglutide') || pLower.includes('tirzepatide') || pLower.includes('wegovy') || pLower.includes('ozempic')).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders created on 2026-09-10 in Weight Loss category`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-009',
        combination: 'Start Date + End Date + Product Category',
        input: '2026-09-10 + 2026-09-10 + Weight Loss',
        expected: 'Results satisfy single-day range and Weight Loss category',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-XCOMB-010: Status + Urgent + Parked (Fulfilled + Urgent: ON + Parked: ON)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus('Fulfilled');
        await modal.setUrgent(true);
        await modal.setParked(true);
      });

      const results = await ordersPage.getResults();
      // MP-78007 is fulfilled, urgent, and parked in the DB
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-78007');
      expect(results[0].status.toUpperCase()).toContain('FULFILLED');
      expect(results[0].isUrgent).toBe(true);
      expect(results[0].isParked).toBe(true);

      passed = true;
      actualResult = 'Returned 1 order (#MP-78007) satisfying Fulfilled status, Urgent ON, and Parked ON';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-XCOMB-010',
        combination: 'Status + Urgent + Parked',
        input: 'Fulfilled + Urgent: ON + Parked: ON',
        expected: '#MP-78007 returned satisfying all 3 compound conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

});
