// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('getCardByName returns the correct card for a named employee', async ({ page }) => {
    const employeesPage = new EmployeesPage(page);

    // 1. Construct a new EmployeesPage instance, call goto(), then call waitForEmployees()
    await employeesPage.goto();
    await employeesPage.waitForEmployees();
    await expect(employeesPage.employeeCards.first()).toBeVisible();

    // 2. Call getCard(0) to get the first card, then read name().textContent() to capture the first employee's full name
    const firstCard = employeesPage.getCard(0);
    const capturedName = await firstCard.name().textContent();
    expect(capturedName).toBeTruthy();

    // 3. Call getCardByName(capturedName) on the EmployeesPage to look up the card by that name
    const cardByName = await employeesPage.getCardByName(capturedName!);

    // 4. Assert that the returned EmployeeCard's name().textContent() equals the originally captured name
    await expect(cardByName.name()).toHaveText(capturedName!);
  });
});
