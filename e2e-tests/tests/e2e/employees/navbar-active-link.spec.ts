// spec: Employee Management Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { EmployeesPage } from '../../page-objects/pages/EmployeesPage';

test.describe('Employee Management Journey', () => {
  test('the Employees nav link is marked active when on /employees', async ({ page }) => {
    const employeesPage = new EmployeesPage(page);

    // 1. Construct a new EmployeesPage instance and call goto()
    await employeesPage.goto();
    await expect(page).toHaveURL('/employees');

    // 2. Call employeesPage.navbar.activeLink() which returns the text content of the nav anchor with the 'active' CSS class
    const activeLinkText = await employeesPage.navbar.activeLink();
    expect(activeLinkText).toBe('Employees');
  });
});
