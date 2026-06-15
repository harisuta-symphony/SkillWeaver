import { Page, Locator } from '@playwright/test';
import { Navbar } from '../components/Navbar';

export class SkillsPage {
  readonly navbar: Navbar;
  readonly skillCards: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.navbar = new Navbar(page);
    this.skillCards = page.locator('.skill-card');
    this.loadingIndicator = page.locator('p', { hasText: 'Loading skills...' });
    this.errorMessage = page.locator('.error');
  }

  async goto() {
    await this.page.goto('/skills');
  }

  async waitForSkills() {
    await this.loadingIndicator.waitFor({ state: 'hidden' });
  }

  async getSkillCount(): Promise<number> {
    return this.skillCards.count();
  }

  getSkillName(index: number): Locator {
    return this.skillCards.nth(index).getByRole('heading', { level: 3 });
  }

  getSkillCategory(index: number): Locator {
    return this.skillCards.nth(index).getByRole('paragraph');
  }

  async getSkillNames(): Promise<string[]> {
    return this.page.getByRole('heading', { level: 3 }).allTextContents();
  }
}
