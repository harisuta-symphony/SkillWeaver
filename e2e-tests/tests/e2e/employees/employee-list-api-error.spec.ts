// spec: specs/employee-management.plan.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('employee list shows error message when the API is unreachable', async ({ page }) => {
    // 1. Intercept all GET requests to **/api/employee** by routing them to an abort response using page.route() before navigation
    await page.route('**/api/employee', (route) => {
      if (route.request().method() === 'GET') {
        route.abort();
      } else {
        route.continue();
      }
    });

    // 2. Construct a new EmployeesPage instance and call goto()
    const employeesPage = new EmployeesPage(page);
    await employeesPage.goto();

    // 3. Call waitForEmployees() to wait for the loading state to clear
    await employeesPage.waitForEmployees();

    // 4. Assert that employeesPage.errorMessage is visible and contains the text 'Failed to load employees'
    await expect(employeesPage.errorMessage).toBeVisible();
    await expect(employeesPage.errorMessage).toContainText('Failed to load employees');

    // 5. Assert that employeesPage.employeeCards has count 0
    await expect(employeesPage.employeeCards).toHaveCount(0);
  });
});
