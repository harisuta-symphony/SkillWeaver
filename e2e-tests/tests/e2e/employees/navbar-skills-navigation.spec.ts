// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('clicking the Skills nav link from the employees page navigates to /skills', async ({ page }) => {
    const employeesPage = new EmployeesPage(page);

    // 1. Construct a new EmployeesPage instance and call goto(), then call waitForEmployees()
    await employeesPage.goto();
    await employeesPage.waitForEmployees();
    await expect(page).toHaveURL('http://localhost:4200/employees');
    await expect(employeesPage.employeeCards.first()).toBeVisible();

    // 2. Access employeesPage.navbar.skillsLink and assert it is visible
    await expect(employeesPage.navbar.skillsLink).toBeVisible();

    // 3. Call employeesPage.navbar.goToSkills() which clicks the Skills anchor
    await employeesPage.navbar.goToSkills();

    // 4. Wait for the URL to change to http://localhost:4200/skills
    await expect(page).toHaveURL('http://localhost:4200/skills');

    // 5. Assert that the page no longer shows .employee-card elements
    await expect(page.locator('.employee-card')).toHaveCount(0);
  });
});
