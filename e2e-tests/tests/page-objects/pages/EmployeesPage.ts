import { Page, Locator } from '@playwright/test';
import { EmployeeCard } from '../components/EmployeeCard';
import { Navbar } from '../components/Navbar';

export class EmployeesPage {
  readonly navbar: Navbar;
  readonly employeeCards: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.navbar = new Navbar(page);
    this.employeeCards = page.locator('.employee-card');
    this.loadingIndicator = page.locator('p', { hasText: 'Loading employees...' });
    this.errorMessage = page.locator('.error');
  }

  async goto() {
    await this.page.goto('/employees');
  }

  async waitForEmployees() {
    await this.loadingIndicator.waitFor({ state: 'hidden' });
  }

  async getEmployeeCount(): Promise<number> {
    return this.employeeCards.count();
  }

  getCard(index: number): EmployeeCard {
    return new EmployeeCard(this.employeeCards.nth(index));
  }

  async getCardByName(name: string): Promise<EmployeeCard> {
    const card = this.employeeCards.filter({ hasText: name });
    return new EmployeeCard(card);
  }
}
