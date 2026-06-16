// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';
import { Navbar } from '../../page-objects/components/Navbar';

test.describe('Employee Management Journey', () => {
  test('navigating to /employees via the Employees nav link from another route also renders the list', async ({ page }) => {
    // 1. Navigate directly to http://localhost:4200/skills to start on a different route
    await page.goto('/skills');
    await expect(page).toHaveURL('http://localhost:4200/skills');

    // 2. Construct a Navbar instance and call goToEmployees() which clicks the Employees anchor
    const navbar = new Navbar(page);
    await navbar.goToEmployees();

    // 3. Wait for the URL to become http://localhost:4200/employees
    await expect(page).toHaveURL('http://localhost:4200/employees');

    // 4. Construct an EmployeesPage instance and call waitForEmployees()
    const employeesPage = new EmployeesPage(page);
    await employeesPage.waitForEmployees();
    await expect(employeesPage.loadingIndicator).not.toBeVisible();

    // 5. Call getEmployeeCount() and assert the result is at least 1
    const count = await employeesPage.getEmployeeCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
