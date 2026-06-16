// spec: Full Team Assembly — Golden Path Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { ProposalFormPage } from '../../page-objects/pages/ProposalFormPage';

test.describe('Full Team Assembly — Golden Path Journey', () => {
  test('Proposal form blocks submission when the title is missing', async ({ page }) => {
    const proposalFormPage = new ProposalFormPage(page);

    // 1. Construct ProposalFormPage and call goto() to navigate to http://localhost:4200/proposals
    await proposalFormPage.goto();
    await expect(page).toHaveURL('http://localhost:4200/proposals');
    await expect(proposalFormPage.heading).toBeVisible();

    // 2. Call fillCommitment(30) to populate only the commitment field, leaving title empty
    await proposalFormPage.fillCommitment(30);
    await expect(proposalFormPage.commitmentInput).toHaveValue('30');
    await expect(proposalFormPage.titleInput).toHaveValue('');

    // 3. Call isSubmitDisabled() — form should not allow submission without a title
    const disabled = await proposalFormPage.isSubmitDisabled();
    expect(disabled).toBe(true);

    // 4. Assert browser has not navigated away from /proposals
    await expect(page).toHaveURL('http://localhost:4200/proposals');
  });
});
