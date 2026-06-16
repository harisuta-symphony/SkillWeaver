// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('each employee card displays the employee name and available capacity', async ({ page }) => {
    const employeesPage = new EmployeesPage(page);

    // 1. Construct a new EmployeesPage instance, call goto(), then call waitForEmployees()
    await employeesPage.goto();
    await employeesPage.waitForEmployees();
    await expect(employeesPage.employeeCards.first()).toBeVisible();

    // 2. Call getEmployeeCount() and assert the result is at least 1
    const count = await employeesPage.getEmployeeCount();
    expect(count).toBeGreaterThanOrEqual(1);

    // 3. Call getCard(0) to get an EmployeeCard for the first card, then call name().textContent() on it
    const firstCard = employeesPage.getCard(0);
    const nameText = await firstCard.name().textContent();
    expect(nameText).toBeTruthy();
    expect(nameText!.trim().length).toBeGreaterThan(0);

    // 4. On the same EmployeeCard, call availableCapacity().textContent()
    const capacityText = await firstCard.availableCapacity().textContent();
    expect(capacityText).toMatch(/Available capacity: \d+%/);
  });
});
