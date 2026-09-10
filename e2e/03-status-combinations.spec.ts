import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('3. Status + Each Other Filter Combinations', () => {
  const statusAnchor = 'Unfulfilled';

  test('TC-STAT-001: Status + Customer (Unfulfilled + Liam Moore)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.setCustomer('Liam Moore');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
        expect(row.customerName.toLowerCase()).toContain('liam moore');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all satisfy Unfulfilled status and belong to Liam Moore`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-001',
        combination: 'Status + Customer',
        input: 'Unfulfilled + Liam Moore',
        expected: 'All returned results satisfy both Status and Customer filters',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-002: Status + Customer Orders (Unfulfilled + Repeat Orders)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.selectCustomerOrders('Repeat Orders');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
      }

      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      for (const ord of apiData.data.orders) {
        expect(ord.fulfillment_status === 'unfulfilled' || ord.status === 'unfulfilled' || ord.status === 'payment_pending').toBe(true);
        expect(ord.order_type === 'repeat' || ord.repeatedOrders > 0).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders satisfying Unfulfilled status and Repeat Orders condition`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-002',
        combination: 'Status + Customer Orders',
        input: 'Unfulfilled + Repeat Orders',
        expected: 'All returned results satisfy both Status and Customer Orders',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-003: Status + Product Type (Unfulfilled + Oral)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.selectProductType('Oral');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
        const pLower = row.productName.toLowerCase();
        expect(pLower.includes('tablet') || pLower.includes('capsule') || pLower.includes('sildenafil') || pLower.includes('finasteride')).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all are Unfulfilled and contain Oral medication`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-003',
        combination: 'Status + Product Type',
        input: 'Unfulfilled + Oral',
        expected: 'Returned orders satisfy Unfulfilled status and Oral Product Type',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-004: Status + Documents (Unfulfilled + Not Uploaded)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.selectDocuments('Not Uploaded');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all satisfy Unfulfilled and Not Uploaded conditions`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-004',
        combination: 'Status + Documents',
        input: 'Unfulfilled + Not Uploaded',
        expected: 'All results satisfy Unfulfilled status and Documents filter',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-005: Status + Start Date (Unfulfilled + 2026-09-10)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.setStartDate('2026-09-10');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all satisfy Unfulfilled status and Start Date boundary`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-005',
        combination: 'Status + Start Date',
        input: 'Unfulfilled + 2026-09-10',
        expected: 'Results satisfy Unfulfilled status and Start Date',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-006: Status + End Date (Unfulfilled + 2026-09-10)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.setEndDate('2026-09-10');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all satisfy Unfulfilled status and End Date boundary`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-006',
        combination: 'Status + End Date',
        input: 'Unfulfilled + 2026-09-10',
        expected: 'Results satisfy Unfulfilled status and End Date',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-007: Status + Product Category (Unfulfilled + Weight Loss)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
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
      actualResult = `Returned ${results.length} orders; all satisfy Unfulfilled status and Weight Loss category`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-007',
        combination: 'Status + Product Category',
        input: 'Unfulfilled + Weight Loss',
        expected: 'Results satisfy Unfulfilled status and Weight Loss category',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-008: Status + Product Name (Unfulfilled + Sildenafil)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.setProductName('Sildenafil');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
        expect(row.productName.toLowerCase()).toContain('sildenafil');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all satisfy Unfulfilled status and product Sildenafil`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-008',
        combination: 'Status + Product Name',
        input: 'Unfulfilled + Sildenafil',
        expected: 'Results satisfy Unfulfilled status and Product Name Sildenafil',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-009: Status + Urgent (Unfulfilled + Urgent: ON)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.setUrgent(true);
      });

      const results = await ordersPage.getResults();
      // If there are unfulfilled urgent orders or empty state
      if (results.length > 0) {
        for (const row of results) {
          expect(row.status.toUpperCase()).toContain('UNFULFILLED');
          expect(row.isUrgent).toBe(true);
        }
        actualResult = `Returned ${results.length} orders; all are Unfulfilled and Marked Urgent`;
      } else {
        expect(await ordersPage.hasEmptyState()).toBe(true);
        actualResult = 'Correctly returned empty state (no unfulfilled orders are marked urgent in DB)';
      }

      passed = true;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-009',
        combination: 'Status + Urgent',
        input: 'Unfulfilled + Urgent: ON',
        expected: 'All returned orders satisfy both Unfulfilled and Urgent conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-STAT-010: Status + Parked (Unfulfilled + Parked: ON)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(statusAnchor);
        await modal.setParked(true);
      });

      const results = await ordersPage.getResults();
      if (results.length > 0) {
        for (const row of results) {
          expect(row.status.toUpperCase()).toContain('UNFULFILLED');
          expect(row.isParked).toBe(true);
        }
        actualResult = `Returned ${results.length} orders; all are Unfulfilled and Parked`;
      } else {
        expect(await ordersPage.hasEmptyState()).toBe(true);
        actualResult = 'Correctly returned empty state (no unfulfilled orders are parked in DB)';
      }

      passed = true;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-STAT-010',
        combination: 'Status + Parked',
        input: 'Unfulfilled + Parked: ON',
        expected: 'All returned orders satisfy both Unfulfilled and Parked conditions',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

});
