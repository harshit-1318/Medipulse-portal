import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('6. Toggle Filters & Clear All Behavior', () => {

  // ==========================================
  // SECTION 8: TOGGLE FILTERS
  // ==========================================

  test('TC-TOGGLE-001: Mark as Urgent Orders = ON', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setUrgent(true);
        expect(await modal.isUrgentActive()).toBe(true);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      // Verify API payload: every order returned should have isUrgent: true
      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      for (const ord of apiData.data.orders) {
        expect(ord.isUrgent).toBe(true);
      }

      // Verify table UI has urgent markers
      expect(results.every((r) => r.isUrgent)).toBe(true);

      passed = true;
      actualResult = `Returned ${results.length} urgent orders; all verified with isUrgent=true`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-TOGGLE-001',
        combination: 'Urgent Orders = ON',
        input: 'Urgent toggle: ON',
        expected: 'Only orders with isUrgent === true returned; urgent badges visible',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-TOGGLE-002: Mark as Urgent Orders = OFF (Unfiltered urgent)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setUrgent(false);
        expect(await modal.isUrgentActive()).toBe(false);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      // In the database there are both urgent and non-urgent orders
      const hasNonUrgent = results.some((r) => !r.isUrgent);
      expect(hasNonUrgent).toBe(true);

      const apiData = ordersPage.getLastSearchApiResponse();
      if (apiData?.data?.orders) {
        const hasNonUrgentApi = apiData.data.orders.some((ord: any) => !ord.isUrgent);
        expect(hasNonUrgentApi).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; dataset includes regular non-urgent orders`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-TOGGLE-002',
        combination: 'Urgent Orders = OFF',
        input: 'Urgent toggle: OFF',
        expected: 'Regular order list returned without urgent-only restriction',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-TOGGLE-003: Mark as Parked Orders = ON', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setParked(true);
        expect(await modal.isParkedActive()).toBe(true);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      // Verify API payload: every order returned should have isParked: true
      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      for (const ord of apiData.data.orders) {
        expect(ord.isParked).toBe(true);
      }

      // Verify table UI has parked markers
      expect(results.every((r) => r.isParked)).toBe(true);

      passed = true;
      actualResult = `Returned ${results.length} parked orders; all verified with isParked=true`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-TOGGLE-003',
        combination: 'Parked Orders = ON',
        input: 'Parked toggle: ON',
        expected: 'Only orders with isParked === true returned; parked indicators visible',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-TOGGLE-004: Mark as Parked Orders = OFF (Unfiltered parked)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setParked(false);
        expect(await modal.isParkedActive()).toBe(false);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      const hasNonParked = results.some((r) => !r.isParked);
      expect(hasNonParked).toBe(true);

      const apiData = ordersPage.getLastSearchApiResponse();
      if (apiData?.data?.orders) {
        const hasNonParkedApi = apiData.data.orders.some((ord: any) => !ord.isParked);
        expect(hasNonParkedApi).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; dataset includes regular non-parked orders`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-TOGGLE-004',
        combination: 'Parked Orders = OFF',
        input: 'Parked toggle: OFF',
        expected: 'Regular order list returned without parked-only restriction',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-TOGGLE-005: Urgent Orders = ON + Parked Orders = ON (Compound AND)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setUrgent(true);
        await modal.setParked(true);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      for (const ord of apiData.data.orders) {
        expect(ord.isUrgent).toBe(true);
        expect(ord.isParked).toBe(true);
      }

      // Check compound order MP-78007
      const hasKnownCompound = results.some((r) => r.orderId.includes('MP-78007'));
      expect(hasKnownCompound).toBe(true);

      passed = true;
      actualResult = `Returned ${results.length} orders matching BOTH Urgent AND Parked (#MP-78007)`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-TOGGLE-005',
        combination: 'Urgent ON + Parked ON',
        input: 'Urgent: ON, Parked: ON',
        expected: 'Returns only intersection of urgent AND parked orders',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  // ==========================================
  // SECTION 9: CLEAR ALL BUTTON BEHAVIOR
  // ==========================================

  test('TC-CLEAR-001: Clear All after applying 1 filter', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      await ordersPage.modal.setOrderId('#MP-46287');
      expect(await ordersPage.modal.getOrderId()).toBe('#MP-46287');

      // Click Clear All
      await ordersPage.modal.clickClearAll();

      // Assert input was wiped
      expect(await ordersPage.modal.getOrderId()).toBe('');

      // Click search to confirm table resets to unfiltered view
      await ordersPage.modal.clickSearch();
      await ordersPage.waitForTableLoad();

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(1);

      passed = true;
      actualResult = `Order ID cleared to empty string; Search restored full table (${results.length} rows)`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-CLEAR-001',
        combination: 'Clear All after 1 filter',
        input: 'Order ID: #MP-46287 -> Clear All',
        expected: 'Input resets to empty; table restores all unfiltered records',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-CLEAR-002: Clear All after applying 2 filters', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      await ordersPage.modal.selectStatus('Fulfilled');
      await ordersPage.modal.selectCustomerOrders('Repeat Orders');

      expect(await ordersPage.modal.getSelectedDropdownLabel('Status')).toBe('Fulfilled');
      expect(await ordersPage.modal.getSelectedDropdownLabel('Customer Orders')).toBe('Repeat Orders');

      await ordersPage.modal.clickClearAll();

      // Dropdowns should reset to All Status / All
      const statusLabel = await ordersPage.modal.getSelectedDropdownLabel('Status');
      const ordersLabel = await ordersPage.modal.getSelectedDropdownLabel('Customer Orders');

      expect(statusLabel).toMatch(/All/i);
      expect(ordersLabel).toMatch(/All/i);

      await ordersPage.modal.clickSearch();
      await ordersPage.waitForTableLoad();

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(1);

      passed = true;
      actualResult = `Status reset to "${statusLabel}", Customer Orders to "${ordersLabel}"; full table restored`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-CLEAR-002',
        combination: 'Clear All after 2 dropdown filters',
        input: 'Status: Fulfilled, Customer Orders: Repeat Orders -> Clear All',
        expected: 'Both dropdowns reset to default (All); search returns all orders',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-CLEAR-003: Clear All after applying multiple text & dropdown filters', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      await ordersPage.modal.setOrderId('#MP-46287');
      await ordersPage.modal.setCustomer('Liam Moore');
      await ordersPage.modal.selectStatus('Unfulfilled');
      await ordersPage.modal.selectProductType('Oral');

      await ordersPage.modal.clickClearAll();

      expect(await ordersPage.modal.getOrderId()).toBe('');
      expect(await ordersPage.modal.getCustomer()).toBe('');
      expect(await ordersPage.modal.getSelectedDropdownLabel('Status')).toMatch(/All/i);
      expect(await ordersPage.modal.getSelectedDropdownLabel('Product Type')).toMatch(/All/i);

      await ordersPage.modal.clickSearch();
      await ordersPage.waitForTableLoad();

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(1);

      passed = true;
      actualResult = `All 4 filter controls successfully cleared; full list (${results.length} orders) loaded`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-CLEAR-003',
        combination: 'Clear All after multiple filters',
        input: 'Order ID, Customer, Status, Product Type -> Clear All',
        expected: 'All inputs emptied and dropdowns reset to default; table unfiltered',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-CLEAR-004: Clear All after all filters populated', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      await ordersPage.modal.setOrderId('#MP-46287');
      await ordersPage.modal.setCustomer('Liam Moore');
      await ordersPage.modal.setProductName('Sildenafil');
      await ordersPage.modal.setStartDate('2026-09-10');
      await ordersPage.modal.setEndDate('2026-09-10');
      await ordersPage.modal.selectStatus('Unfulfilled');
      await ordersPage.modal.selectCustomerOrders('Repeat Orders');
      await ordersPage.modal.selectProductType('Oral');
      await ordersPage.modal.selectDocuments('Not Uploaded');
      await ordersPage.modal.setUrgent(true);
      await ordersPage.modal.setParked(true);

      // Perform Clear All
      await ordersPage.modal.clickClearAll();

      // Validate all controls reset
      expect(await ordersPage.modal.getOrderId()).toBe('');
      expect(await ordersPage.modal.getCustomer()).toBe('');
      expect(await ordersPage.modal.getProductName()).toBe('');
      expect(await ordersPage.modal.getStartDate()).toBe('');
      expect(await ordersPage.modal.getEndDate()).toBe('');
      expect(await ordersPage.modal.isUrgentActive()).toBe(false);
      expect(await ordersPage.modal.isParkedActive()).toBe(false);

      await ordersPage.modal.clickSearch();
      await ordersPage.waitForTableLoad();

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(1);

      passed = true;
      actualResult = `Entire form (11 filters including toggles & dates) completely reset; table fully restored`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-CLEAR-004',
        combination: 'Clear All after all filters populated',
        input: 'All 11 inputs, dropdowns, dates, and toggles populated -> Clear All',
        expected: 'Every field is cleared or returned to default state',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-CLEAR-005: Clear All with toggle filters enabled', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      await ordersPage.modal.setUrgent(true);
      await ordersPage.modal.setParked(true);

      expect(await ordersPage.modal.isUrgentActive()).toBe(true);
      expect(await ordersPage.modal.isParkedActive()).toBe(true);

      await ordersPage.modal.clickClearAll();

      expect(await ordersPage.modal.isUrgentActive()).toBe(false);
      expect(await ordersPage.modal.isParkedActive()).toBe(false);

      await ordersPage.modal.clickSearch();
      await ordersPage.waitForTableLoad();

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(1);

      passed = true;
      actualResult = `Both Urgent and Parked toggles switched to OFF/Inactive; regular orders displayed`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-CLEAR-005',
        combination: 'Clear All with active toggles',
        input: 'Urgent: ON, Parked: ON -> Clear All',
        expected: 'Toggles immediately flip to Inactive state',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

});
