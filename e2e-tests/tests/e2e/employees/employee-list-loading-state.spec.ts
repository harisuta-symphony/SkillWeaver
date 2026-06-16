// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('loading indicator is shown while employees are being fetched then disappears', async ({ page }) => {
    // 1. Register a page.route() intercept for GET **/api/employee that delays the response by 1000ms before forwarding it
    await page.route('**/api/employee', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    // 2. Construct a new EmployeesPage instance and call goto()
    const employeesPage = new EmployeesPage(page);
    await employeesPage.goto();

    // 3. Immediately assert that employeesPage.loadingIndicator is visible before the delayed response resolves
    await expect(employeesPage.loadingIndicator).toBeVisible();

    // 4. Call waitForEmployees() to wait for the loading indicator to be hidden once the response arrives
    await employeesPage.waitForEmployees();
    await expect(employeesPage.loadingIndicator).not.toBeVisible();

    // 5. Call getEmployeeCount() and assert the result is at least 1
    const count = await employeesPage.getEmployeeCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
