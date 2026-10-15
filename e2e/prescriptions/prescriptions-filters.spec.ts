import { test, expect } from '../fixtures/testBase';

test.describe('Prescriptions Filters QA Suite', () => {
  test('TC-RX-01: Filter by complete Order ID (#MP-10797) and without prefix (10797)', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.orderIdInput.fill('#MP-10797');
    await prescriptionsPage.clickSearch();

    const count = await prescriptionsPage.getDisplayedRowsCount();
    expect(count).toBe(1);
    await expect(prescriptionsPage.table.locator('tbody tr')).toContainText('8305442557');

    // Without prefix
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.orderIdInput.fill('10797');
    await prescriptionsPage.clickSearch();

    const countNoPrefix = await prescriptionsPage.getDisplayedRowsCount();
    expect(countNoPrefix).toBe(1);
    await expect(prescriptionsPage.table.locator('tbody tr')).toContainText('8305442557');
  });

  test('TC-RX-02: Filter by nonexistent Order ID shows clean empty state', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.orderIdInput.fill('MP-999999');
    await prescriptionsPage.clickSearch();

    const count = await prescriptionsPage.getDisplayedRowsCount();
    expect(count).toBe(0);
    await expect(prescriptionsPage.emptyState).toBeVisible();
  });

  test('TC-RX-03: Filter by Customer ID returns prescriptions for that customer', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.customerIdInput.fill('657339');
    await prescriptionsPage.clickSearch();

    const count = await prescriptionsPage.getDisplayedRowsCount();
    expect(count).toBe(1);
    await expect(prescriptionsPage.table.locator('tbody tr')).toContainText('657339');
  });

  test('TC-RX-04: Filter by Prescriber Name, Email, and RegNo', async ({ prescriptionsPage }) => {
    // By name
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.prescriberInput.fill('Sarah');
    await prescriptionsPage.clickSearch();

    const countName = await prescriptionsPage.getDisplayedRowsCount();
    expect(countName).toBeGreaterThan(0);
    await expect(prescriptionsPage.table.locator('tbody tr').first()).toContainText('Dr. Sarah Jenkins');

    // By email
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.prescriberInput.fill('sarah.j@medipulse.io');
    await prescriptionsPage.clickSearch();

    const countEmail = await prescriptionsPage.getDisplayedRowsCount();
    expect(countEmail).toBeGreaterThan(0);
    await expect(prescriptionsPage.table.locator('tbody tr').first()).toContainText('sarah.j@medipulse.io');

    // By RegNo
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.prescriberInput.fill('2089412');
    await prescriptionsPage.clickSearch();

    const countReg = await prescriptionsPage.getDisplayedRowsCount();
    expect(countReg).toBeGreaterThan(0);
    await expect(prescriptionsPage.table.locator('tbody tr').first()).toContainText('2089412');
  });

  test('TC-RX-05: Filter by Order Date matches records for that date', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.orderDateInput.fill('2026-09-09');
    await prescriptionsPage.clickSearch();

    const count = await prescriptionsPage.getDisplayedRowsCount();
    expect(count).toBeGreaterThan(0);
    await expect(prescriptionsPage.table.locator('tbody tr').first()).toContainText('09 Sept 26');
  });

  test('TC-RX-06: Filter by Review Date matches records for that review date', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.reviewDateInput.fill('2026-09-09');
    await prescriptionsPage.clickSearch();

    const count = await prescriptionsPage.getDisplayedRowsCount();
    expect(count).toBeGreaterThan(0);
    await expect(prescriptionsPage.table.locator('tbody tr').first()).toContainText('09 Sept 26');
  });

  test('TC-RX-07: Filter combinations narrow results with AND logic', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.orderIdInput.fill('MP-10797');
    await prescriptionsPage.customerIdInput.fill('657339');
    await prescriptionsPage.prescriberInput.fill('Dr. Sarah Jenkins');
    await prescriptionsPage.orderDateInput.fill('2026-09-09');
    await prescriptionsPage.reviewDateInput.fill('2026-09-09');
    await prescriptionsPage.clickSearch();

    const count = await prescriptionsPage.getDisplayedRowsCount();
    expect(count).toBe(1);
    await expect(prescriptionsPage.table.locator('tbody tr')).toContainText('8305442557');
    await expect(prescriptionsPage.table.locator('tbody tr')).toContainText('657339');
  });

  test('TC-RX-08: Clear All resets all filters and restores full prescriptions dataset', async ({ prescriptionsPage }) => {
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.orderIdInput.fill('MP-10797');
    await prescriptionsPage.clickSearch();
    expect(await prescriptionsPage.getDisplayedRowsCount()).toBe(1);

    // Now open and clear
    await prescriptionsPage.openFiltersModal();
    await prescriptionsPage.clickClearAll();
    await prescriptionsPage.clickSearch();

    const restoredCount = await prescriptionsPage.getDisplayedRowsCount();
    expect(restoredCount).toBe(20); // 20 per page on page 1 of 44 total
  });
});
