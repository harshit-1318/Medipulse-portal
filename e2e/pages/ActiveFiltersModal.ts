import { type Page, type Locator, expect } from '@playwright/test';

export class ActiveFiltersModal {
  readonly page: Page;
  readonly modalContainer: Locator;
  readonly headerTitle: Locator;
  readonly closeButton: Locator;
  readonly orderIdInput: Locator;
  readonly customerInput: Locator;
  readonly productNameInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly urgentToggle: Locator;
  readonly parkedToggle: Locator;
  readonly clearAllButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalContainer = page.locator('div.fixed.inset-0.z-100');
    this.headerTitle = this.modalContainer.getByRole('heading', { name: 'Active Filters' });
    this.closeButton = this.modalContainer.getByLabel('Close modal');
    this.orderIdInput = this.modalContainer.getByPlaceholder('Order id...');
    this.customerInput = this.modalContainer.getByPlaceholder('Name, Email, ID...');
    this.productNameInput = this.modalContainer.getByPlaceholder('Product name...');
    
    // Date inputs
    this.startDateInput = this.modalContainer.locator('div:has(> label:has-text("Start Date")) input[type="date"]');
    this.endDateInput = this.modalContainer.locator('div:has(> label:has-text("End Date")) input[type="date"]');

    // Toggles
    this.urgentToggle = this.modalContainer.locator('div:has-text("Mark as Urgent Orders")').filter({ hasText: 'Mark as Urgent Orders' }).last();
    this.parkedToggle = this.modalContainer.locator('div:has-text("Mark as Parked Orders")').filter({ hasText: 'Mark as Parked Orders' }).last();

    // Footer actions
    this.clearAllButton = this.modalContainer.getByRole('button', { name: 'Clear All' });
    this.searchButton = this.modalContainer.getByRole('button', { name: 'Search' });
  }

  async isVisible(): Promise<boolean> {
    return await this.modalContainer.isVisible();
  }

  async waitForOpen(): Promise<void> {
    await this.modalContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForClose(): Promise<void> {
    await this.modalContainer.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async closeModal(): Promise<void> {
    await this.closeButton.click();
    await this.waitForClose();
  }

  async setOrderId(orderId: string): Promise<void> {
    await this.orderIdInput.fill(orderId);
  }

  async getOrderId(): Promise<string> {
    return await this.orderIdInput.inputValue();
  }

  async setCustomer(customer: string): Promise<void> {
    await this.customerInput.fill(customer);
  }

  async getCustomer(): Promise<string> {
    return await this.customerInput.inputValue();
  }

  async setProductName(name: string): Promise<void> {
    await this.productNameInput.fill(name);
  }

  async getProductName(): Promise<string> {
    return await this.productNameInput.inputValue();
  }

  async setStartDate(date: string): Promise<void> {
    await this.startDateInput.fill(date);
  }

  async getStartDate(): Promise<string> {
    return await this.startDateInput.inputValue();
  }

  async setEndDate(date: string): Promise<void> {
    await this.endDateInput.fill(date);
  }

  async getEndDate(): Promise<string> {
    return await this.endDateInput.inputValue();
  }

  private getDropdownContainer(dropdownLabel: string): Locator {
    return this.modalContainer
      .locator('div')
      .filter({ has: this.page.locator(`label:has-text("${dropdownLabel}")`) })
      .first();
  }

  async selectDropdownOption(dropdownLabel: string, optionLabel: string): Promise<void> {
    // Find dropdown trigger button
    const container = this.modalContainer.locator(`div:has(> label:text-is("${dropdownLabel}"))`);
    const trigger = container.locator('button[type="button"]').first();
    await trigger.click();

    // Wait for dropdown menu to appear and click option
    const menu = container.locator('ul');
    await menu.waitFor({ state: 'visible', timeout: 3000 });
    const optionBtn = menu.getByRole('button', { name: optionLabel, exact: true }).first();
    await optionBtn.click();
    await menu.waitFor({ state: 'hidden', timeout: 3000 });
  }

  async getSelectedDropdownLabel(dropdownLabel: string): Promise<string> {
    const container = this.modalContainer.locator(`div:has(> label:text-is("${dropdownLabel}"))`);
    const trigger = container.locator('button[type="button"]').first();
    const textSpan = trigger.locator('span.flex-1');
    return (await textSpan.textContent())?.trim() || '';
  }

  async selectStatus(statusLabel: string): Promise<void> {
    await this.selectDropdownOption('Status', statusLabel);
  }

  async selectCustomerOrders(optionLabel: string): Promise<void> {
    await this.selectDropdownOption('Customer Orders', optionLabel);
  }

  async selectProductType(typeLabel: string): Promise<void> {
    await this.selectDropdownOption('Product Type', typeLabel);
  }

  async selectDocuments(docLabel: string): Promise<void> {
    await this.selectDropdownOption('Documents', docLabel);
  }

  async selectProductCategory(categoryLabel: string): Promise<void> {
    await this.selectDropdownOption('Product Category', categoryLabel);
  }

  async isUrgentActive(): Promise<boolean> {
    return await this.urgentToggle.locator('span:text-is("Active")').isVisible();
  }

  async setUrgent(enable: boolean): Promise<void> {
    const active = await this.isUrgentActive();
    if (active !== enable) {
      await this.urgentToggle.click();
    }
  }

  async isParkedActive(): Promise<boolean> {
    return await this.parkedToggle.locator('span:text-is("Active")').isVisible();
  }

  async setParked(enable: boolean): Promise<void> {
    const active = await this.isParkedActive();
    if (active !== enable) {
      await this.parkedToggle.click();
    }
  }

  async clickClearAll(): Promise<void> {
    await this.clearAllButton.click();
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
    await this.waitForClose();
  }
}
