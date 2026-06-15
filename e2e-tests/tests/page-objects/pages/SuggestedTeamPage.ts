import { Page, Locator } from '@playwright/test';
import { Navbar } from '../components/Navbar';

export class SuggestedTeamPage {
  readonly navbar: Navbar;
  readonly heading: Locator;
  readonly candidatesCount: Locator;
  readonly memberCards: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly noResultsMessage: Locator;
  readonly createAnotherLink: Locator;

  constructor(private readonly page: Page) {
    this.navbar = new Navbar(page);
    this.heading = page.getByRole('heading', { level: 2 });
    this.candidatesCount = page.locator('p', { hasText: 'candidate' });
    this.memberCards = page.locator('.member-card');
    this.loadingIndicator = page.locator('p', { hasText: 'Assembling team...' });
    this.errorMessage = page.locator('.error');
    this.noResultsMessage = page.locator('p', { hasText: 'No employees match' });
    this.createAnotherLink = page.getByRole('link', { name: 'Create another proposal' });
  }

  async waitForResult() {
    await this.loadingIndicator.waitFor({ state: 'hidden' });
  }

  async getMemberCount(): Promise<number> {
    return this.memberCards.count();
  }

  getMemberName(index: number): Locator {
    return this.memberCards.nth(index).getByRole('heading', { level: 3 });
  }

  getMemberSkills(index: number): Locator {
    return this.memberCards.nth(index).locator('span');
  }

  getMemberCapacity(index: number): Locator {
    return this.memberCards.nth(index).locator('p', { hasText: 'Available capacity' });
  }

  async getMemberNames(): Promise<string[]> {
    return this.memberCards.getByRole('heading', { level: 3 }).allTextContents();
  }
}
