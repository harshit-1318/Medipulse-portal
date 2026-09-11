import { type Page, type Locator, expect } from '@playwright/test';

export class ActivityLogsPage {
  readonly page: Page;
  readonly filtersButton: Locator;
  readonly modalContainer: Locator;
  readonly headerTitle: Locator;
  readonly headerCloseButton: Locator;
  readonly searchInput: Locator;
  readonly orderIdInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly clearAllButton: Locator;
  readonly closeButton: Locator;
  readonly tableRows: Locator;
  readonly totalBadge: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filtersButton = page.getByRole('button', { name: 'Filters' });
    this.modalContainer = page.locator('div.fixed.inset-0.z-100');
    this.headerTitle = this.modalContainer.getByRole('heading', { name: 'Active Filters' });
    this.headerCloseButton = this.modalContainer.getByLabel('Close filters');
    this.searchInput = this.modalContainer.getByPlaceholder('e.g. john@example.com');
    this.orderIdInput = this.modalContainer.getByPlaceholder('e.g. 1277551893');
    this.startDateInput = this.modalContainer.locator('input[type="date"]').first();
    this.endDateInput = this.modalContainer.locator('input[type="date"]').nth(1);
    this.clearAllButton = this.modalContainer.getByRole('button', { name: 'Clear All' });
    this.closeButton = this.modalContainer.getByRole('button', { name: 'Close', exact: true });
    this.tableRows = page.locator('table tbody tr:not(.animate-pulse)');
    this.totalBadge = page.locator('h2:text-is("System Activity Logs") + span');
    this.emptyState = page.locator('td:has-text("No activity logs found")');
  }

  async goto() {
    await this.page.goto('http://localhost:3000/activity-logs', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(1000);
  }

  async openFiltersModal() {
    if (!(await this.isModalVisible())) {
      await this.filtersButton.click();
      await this.modalContainer.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  async closeFiltersModal() {
    if (await this.isModalVisible()) {
      await this.closeButton.click();
      await this.modalContainer.waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async closeViaHeader() {
    if (await this.isModalVisible()) {
      await this.headerCloseButton.click();
      await this.modalContainer.waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async closeViaEscape() {
    if (await this.isModalVisible()) {
      await this.page.keyboard.press('Escape');
      await this.modalContainer.waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modalContainer.isVisible();
  }

  async setSearch(val: string) {
    await this.searchInput.fill(val);
    // Debounce wait
    await this.page.waitForTimeout(1000);
  }

  async getSearch(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  async setOrderId(val: string) {
    await this.orderIdInput.fill(val);
    await this.page.waitForTimeout(1000);
  }

  async getOrderId(): Promise<string> {
    return await this.orderIdInput.inputValue();
  }

  async selectDropdownOption(label: string, optionText: string) {
    const container = this.modalContainer.locator(`div:has(> label:text-is("${label}"))`);
    const trigger = container.locator('button[type="button"]').first();
    await trigger.click();
    const menu = container.locator('ul');
    await menu.waitFor({ state: 'visible', timeout: 3000 });
    const optionBtn = menu.getByRole('button', { name: optionText, exact: true });
    await optionBtn.click();
    await menu.waitFor({ state: 'hidden', timeout: 3000 });
    await this.page.waitForTimeout(500);
  }

  async getDropdownValue(label: string): Promise<string> {
    const container = this.modalContainer.locator(`div:has(> label:text-is("${label}"))`);
    const trigger = container.locator('button[type="button"]').first();
    return (await trigger.locator('span.flex-1').textContent())?.trim() || '';
  }

  async selectRole(roleText: string) {
    await this.selectDropdownOption('User Role', roleText);
  }

  async selectAction(actionText: string) {
    await this.selectDropdownOption('Action Type', actionText);
  }

  async selectPageScope(pageText: string) {
    await this.selectDropdownOption('Page Scope', pageText);
  }

  async selectSite(siteText: string) {
    await this.selectDropdownOption('Site', siteText);
  }

  async setStartDate(val: string) {
    await this.startDateInput.fill(val);
    await this.page.waitForTimeout(500);
  }

  async getStartDate(): Promise<string> {
    return await this.startDateInput.inputValue();
  }

  async setEndDate(val: string) {
    await this.endDateInput.fill(val);
    await this.page.waitForTimeout(500);
  }

  async getEndDate(): Promise<string> {
    return await this.endDateInput.inputValue();
  }

  async clickClearAll() {
    await this.clearAllButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getTotalCount(): Promise<number> {
    const text = (await this.totalBadge.textContent())?.trim() || '0';
    return parseInt(text.replace(/,/g, ''), 10) || 0;
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async hasEmptyState(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }
}
