// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('navigating directly to /employees renders the employee list page', async ({ page }) => {
    const employeesPage = new EmployeesPage(page);

    // 1. Construct a new EmployeesPage instance and call goto() to navigate to http://localhost:4200/employees
    await employeesPage.goto();
    await expect(page).toHaveURL('http://localhost:4200/employees');
    await expect(page.locator('.error')).not.toBeVisible();

    // 2. Call waitForEmployees() on the EmployeesPage instance to wait until the loading indicator disappears
    await employeesPage.waitForEmployees();
    await expect(employeesPage.loadingIndicator).not.toBeVisible();
    await expect(employeesPage.employeeCards.first()).toBeVisible();

    // 3. Call getEmployeeCount() on the EmployeesPage instance
    const count = await employeesPage.getEmployeeCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
