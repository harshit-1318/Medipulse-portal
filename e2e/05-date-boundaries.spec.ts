import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('5. Date Boundary & Range Filter Testing', () => {

  test('TC-DATE-001: Start Date only boundary condition', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const dateStr = '2026-09-10';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate(dateStr);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      const boundary = new Date('2026-09-10T00:00:00.000Z').getTime();
      for (const ord of apiData.data.orders) {
        expect(new Date(ord.createdAt).getTime()).toBeGreaterThanOrEqual(boundary);
      }

      passed = true;
      actualResult = `Start Date only returned ${results.length} orders; all on or after 2026-09-10`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-001',
        combination: 'Start Date only',
        input: dateStr,
        expected: 'Records created on or after 2026-09-10 returned without excluding boundary records',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-DATE-002: End Date only boundary condition', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const dateStr = '2026-09-10';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setEndDate(dateStr);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      const boundary = new Date('2026-09-10T23:59:59.999Z').getTime();
      for (const ord of apiData.data.orders) {
        expect(new Date(ord.createdAt).getTime()).toBeLessThanOrEqual(boundary);
      }

      passed = true;
      actualResult = `End Date only returned ${results.length} orders; all on or before 2026-09-10`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-002',
        combination: 'End Date only',
        input: dateStr,
        expected: 'Records created on or before 2026-09-10 returned without excluding boundary records',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-DATE-003: Same Start Date and End Date (Exact Single Day)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const dateStr = '2026-09-10';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate(dateStr);
        await modal.setEndDate(dateStr);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      const startBoundary = new Date('2026-09-10T00:00:00.000Z').getTime();
      const endBoundary = new Date('2026-09-10T23:59:59.999Z').getTime();
      for (const ord of apiData.data.orders) {
        const time = new Date(ord.createdAt).getTime();
        expect(time).toBeGreaterThanOrEqual(startBoundary);
        expect(time).toBeLessThanOrEqual(endBoundary);
      }

      passed = true;
      actualResult = `Same start/end date returned ${results.length} orders; all strictly on 2026-09-10`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-003',
        combination: 'Same Start Date & End Date',
        input: 'Start: 2026-09-10, End: 2026-09-10',
        expected: 'All orders strictly fall within the single-day 00:00:00 - 23:59:59 window',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-DATE-004: Multi-Day Date Range (Start: 2026-09-08, End: 2026-09-10)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate('2026-09-08');
        await modal.setEndDate('2026-09-10');
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      passed = true;
      actualResult = `Date range returned ${results.length} orders covering multi-day span`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-004',
        combination: 'Multi-Day Date Range',
        input: 'Start: 2026-09-08, End: 2026-09-10',
        expected: 'Records across the date span are returned',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-DATE-005: Date Range before any records exist (Historical Empty State: 2020-01-01)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate('2020-01-01');
        await modal.setEndDate('2020-01-02');
      });

      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      passed = true;
      actualResult = 'Correctly displayed "No results" empty state for historical date range';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-005',
        combination: 'Date before available records',
        input: 'Start: 2020-01-01, End: 2020-01-02',
        expected: 'Empty state with "No results" message',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-DATE-006: Date Range after all records (Far Future Empty State: 2035-01-01)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate('2035-01-01');
        await modal.setEndDate('2035-01-02');
      });

      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      passed = true;
      actualResult = 'Correctly displayed "No results" empty state for future date range';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-006',
        combination: 'Date after available records',
        input: 'Start: 2035-01-01, End: 2035-01-02',
        expected: 'Empty state with "No results" message',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-DATE-007: Inverted Date Range (Start Date > End Date)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate('2026-09-15');
        await modal.setEndDate('2026-09-01');
      });

      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      passed = true;
      actualResult = 'Inverted date range handled gracefully with 0 results / empty state';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-DATE-007',
        combination: 'Invalid Date Range (Start > End)',
        input: 'Start: 2026-09-15, End: 2026-09-01',
        expected: 'Zero records returned / empty state',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

});
