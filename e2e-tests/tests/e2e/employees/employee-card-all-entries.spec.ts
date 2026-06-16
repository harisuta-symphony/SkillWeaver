// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('every visible employee card has a non-empty name and a valid available capacity value', async ({ page }) => {
    const employeesPage = new EmployeesPage(page);

    // 1. Construct a new EmployeesPage instance, call goto(), then call waitForEmployees()
    await employeesPage.goto();
    await employeesPage.waitForEmployees();

    // 2. Call getEmployeeCount() to get the total number of cards
    await expect(employeesPage.employeeCards.first()).toBeVisible();
    const count = await employeesPage.getEmployeeCount();
    expect(count).toBeGreaterThan(0);

    // 3. Loop from index 0 to count-1; for each index call getCard(index), then assert name().textContent() is not empty
    // 4. For each card in the same loop call availableCapacity().textContent() and assert it matches /Available capacity: \d+%/
    for (let i = 0; i < count; i++) {
      const card = employeesPage.getCard(i);

      const nameText = await card.name().textContent();
      expect(nameText).toBeTruthy();
      expect(nameText!.trim()).not.toBe('');

      const capacityText = await card.availableCapacity().textContent();
      expect(capacityText).toMatch(/Available capacity: \d+%/);
    }
  });
});
