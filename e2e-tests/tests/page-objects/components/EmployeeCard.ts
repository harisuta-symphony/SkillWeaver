import { Locator } from '@playwright/test';

export class EmployeeCard {
  constructor(readonly root: Locator) {}

  name(): Locator {
    return this.root.getByRole('heading', { level: 3 });
  }

  email(): Locator {
    return this.root.locator('p').nth(0);
  }

  availableCapacity(): Locator {
    return this.root.locator('p', { hasText: 'Available capacity' });
  }

  skillCount(): Locator {
    return this.root.locator('p', { hasText: 'Skills:' });
  }
}
