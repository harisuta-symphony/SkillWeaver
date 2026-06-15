import { Page, Locator } from '@playwright/test';

export class Navbar {
  readonly nav: Locator;
  readonly employeesLink: Locator;
  readonly skillsLink: Locator;
  readonly proposalsLink: Locator;

  constructor(page: Page) {
    this.nav = page.locator('nav');
    this.employeesLink = page.getByRole('link', { name: 'Employees' });
    this.skillsLink = page.getByRole('link', { name: 'Skills' });
    this.proposalsLink = page.getByRole('link', { name: 'Proposals' });
  }

  async goToEmployees() {
    await this.employeesLink.click();
  }

  async goToSkills() {
    await this.skillsLink.click();
  }

  async goToProposals() {
    await this.proposalsLink.click();
  }

  async activeLink(): Promise<string | null> {
    return this.nav.locator('a.active').textContent();
  }
}
