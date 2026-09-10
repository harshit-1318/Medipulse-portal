import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('7. Search Behavior & UI State Testing', () => {

  // ==========================================
  // SECTION 10: SEARCH BEHAVIOR & EDGE CASES
  // ==========================================

  test('TC-SEARCH-001: Search with no filters applied', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      // Click Search immediately without filling anything
      await ordersPage.modal.clickSearch();
      await ordersPage.waitForTableLoad();

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(1);
      expect(await ordersPage.hasEmptyState()).toBe(false);

      passed = true;
      actualResult = `Modal closed smoothly; full default order list (${results.length} rows) rendered`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-SEARCH-001',
        combination: 'Search with no filters',
        input: 'Empty filter form -> Search',
        expected: 'Modal closes, default table data returned without empty state',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-SEARCH-002: Search with valid filter values matching data', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const validOrderId = '#MP-46287';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId(validOrderId);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toContain(validOrderId);
      expect(results[0].customerName).toBe('Liam Moore');

      passed = true;
      actualResult = `Search returned exactly 1 matching record: ${results[0].orderId} (${results[0].customerName})`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-SEARCH-002',
        combination: 'Search with valid values',
        input: `Order ID: ${validOrderId}`,
        expected: 'Returns exact matching record for #MP-46287',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-SEARCH-003: Search with non-existent Order ID (Empty State)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const fakeOrderId = '#MP-999999';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId(fakeOrderId);
      });

      const count = await ordersPage.getResultCount();
      expect(count).toBe(0);
      expect(await ordersPage.hasEmptyState()).toBe(true);

      passed = true;
      actualResult = `Zero rows returned; "No results" empty state rendered as expected`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-SEARCH-003',
        combination: 'Non-existent Order ID',
        input: `Order ID: ${fakeOrderId}`,
        expected: 'Zero rows returned; "No results" message displayed',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-SEARCH-004: Search with non-existent customer (Empty State)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const fakeCustomer = 'NonExistentCustomerXYZ999';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setCustomer(fakeCustomer);
      });

      const count = await ordersPage.getResultCount();
      expect(count).toBe(0);
      expect(await ordersPage.hasEmptyState()).toBe(true);

      passed = true;
      actualResult = `Zero rows returned; "No results" empty state confirmed`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-SEARCH-004',
        combination: 'Non-existent Customer',
        input: `Customer: ${fakeCustomer}`,
        expected: 'Zero rows returned; "No results" message displayed',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-SEARCH-005: Search with non-existent product (Empty State)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const fakeProduct = 'NonExistentMedicine999';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setProductName(fakeProduct);
      });

      const count = await ordersPage.getResultCount();
      expect(count).toBe(0);
      expect(await ordersPage.hasEmptyState()).toBe(true);

      passed = true;
      actualResult = `Zero rows returned; "No results" empty state confirmed`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-SEARCH-005',
        combination: 'Non-existent Product Name',
        input: `Product Name: ${fakeProduct}`,
        expected: 'Zero rows returned; "No results" message displayed',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  // ==========================================
  // SECTION 11: UI STATE & MODAL INTERACTION
  // ==========================================

  test('TC-UI-001: Modal opens and closes properly (Button & Esc key)', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      // 1. Open via Filters button
      await ordersPage.openActiveFilters();
      expect(await ordersPage.modal.isVisible()).toBe(true);

      // 2. Close via Close (X) button
      await ordersPage.closeActiveFilters();
      expect(await ordersPage.modal.isVisible()).toBe(false);

      // 3. Open again and close via 'Escape' keyboard shortcut
      await ordersPage.openActiveFilters();
      expect(await ordersPage.modal.isVisible()).toBe(true);
      await ordersPage.page.keyboard.press('Escape');
      await ordersPage.modal.waitForClose();
      expect(await ordersPage.modal.isVisible()).toBe(false);

      passed = true;
      actualResult = 'Modal reliably opens via Filters button and closes via close button and Escape key';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-UI-001',
        combination: 'Modal Open/Close Interactions',
        input: 'Filters button click -> Close button click -> Reopen -> Esc key press',
        expected: 'Modal opens and closes accurately on button clicks and Esc key',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-UI-002: Filter values retain when reopening modal without search', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const testOrderId = '#MP-46287';
    const testCustomer = 'Liam Moore';

    try {
      await ordersPage.openActiveFilters();
      await ordersPage.modal.setOrderId(testOrderId);
      await ordersPage.modal.setCustomer(testCustomer);

      // Close without clicking search
      await ordersPage.closeActiveFilters();
      expect(await ordersPage.modal.isVisible()).toBe(false);

      // Reopen modal
      await ordersPage.openActiveFilters();

      // Check values still present in inputs
      const retainedOrderId = await ordersPage.modal.getOrderId();
      const retainedCustomer = await ordersPage.modal.getCustomer();

      expect(retainedOrderId).toBe(testOrderId);
      expect(retainedCustomer).toBe(testCustomer);

      await ordersPage.closeActiveFilters();

      passed = true;
      actualResult = `Values preserved on reopen: Order ID="${retainedOrderId}", Customer="${retainedCustomer}"`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-UI-002',
        combination: 'Modal State Retention Without Search',
        input: `Order ID: ${testOrderId}, Customer: ${testCustomer} -> Close -> Reopen`,
        expected: 'Inputs retain user entered text when modal is reopened',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-UI-003: Applied filter values persist after Search and modal reopening', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';
    const testOrderId = '#MP-46287';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId(testOrderId);
        await modal.selectStatus('Unfulfilled');
      });

      // Filter chips should reflect the applied values
      const chips = await ordersPage.getActiveFilterChips();
      expect(chips.some((c) => c.value.includes(testOrderId))).toBe(true);
      expect(chips.some((c) => c.value.toLowerCase().includes('unfulfilled'))).toBe(true);

      // Reopen modal to verify internal controls reflect active filters
      await ordersPage.openActiveFilters();
      expect(await ordersPage.modal.getOrderId()).toBe(testOrderId);
      expect(await ordersPage.modal.getSelectedDropdownLabel('Status')).toBe('Unfulfilled');

      await ordersPage.closeActiveFilters();

      passed = true;
      actualResult = 'Applied filter values successfully persisted in chips and in modal controls upon reopening';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-UI-003',
        combination: 'Persistence After Search & Reopen',
        input: `Order ID: ${testOrderId}, Status: Unfulfilled -> Search -> Reopen`,
        expected: 'Filter state persisted in active chips and retained in modal controls',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-UI-004: Dropdown menu opens on click and closes on item selection', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();

      const container = ordersPage.modal.modalContainer.locator('div:has(> label:text-is("Status"))');
      const trigger = container.locator('button[type="button"]').first();
      const menu = container.locator('ul');

      // Initially menu should be hidden
      expect(await menu.isVisible()).toBe(false);

      // Click trigger -> menu opens
      await trigger.click();
      await menu.waitFor({ state: 'visible', timeout: 3000 });
      expect(await menu.isVisible()).toBe(true);

      // Select an option -> menu closes and value updates
      const optionBtn = menu.locator('button').filter({ hasText: 'On Hold' }).first();
      await optionBtn.click();
      await menu.waitFor({ state: 'hidden', timeout: 3000 });
      expect(await menu.isVisible()).toBe(false);

      expect(await ordersPage.modal.getSelectedDropdownLabel('Status')).toBe('On Hold');

      await ordersPage.closeActiveFilters();

      passed = true;
      actualResult = 'Status dropdown menu opened on trigger click and automatically closed on option selection';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-UI-004',
        combination: 'Dropdown Open & Close Mechanics',
        input: 'Click Status trigger -> Click "On Hold" option',
        expected: 'Menu opens smoothly on click and closes immediately upon selection',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

  test('TC-UI-005: Backdrop click closes modal', async ({ ordersPage }) => {
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.openActiveFilters();
      expect(await ordersPage.modal.isVisible()).toBe(true);

      // Click the backdrop overlay at top-left edge
      await ordersPage.modal.modalContainer.click({ position: { x: 10, y: 10 } });
      await ordersPage.modal.waitForClose();
      expect(await ordersPage.modal.isVisible()).toBe(false);

      passed = true;
      actualResult = 'Backdrop overlay click event successfully dismissed the modal';
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-UI-005',
        combination: 'Backdrop Click to Dismiss',
        input: 'Click outer backdrop area',
        expected: 'Modal closes when clicking outside the dialog content',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
      });
    }
  });

});
