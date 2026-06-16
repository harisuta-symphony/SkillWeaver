// spec: Full Team Assembly — Golden Path Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { ProposalFormPage } from '../../page-objects/pages/ProposalFormPage';

test.describe('Full Team Assembly — Golden Path Journey', () => {
  test('Proposal form blocks submission when no required skill has been added', async ({ page }) => {
    const proposalFormPage = new ProposalFormPage(page);

    // 1. Construct ProposalFormPage and call goto() to navigate to http://localhost:4200/proposals
    await proposalFormPage.goto();
    await expect(page).toHaveURL('/proposals');
    await expect(proposalFormPage.heading).toBeVisible();

    // 2. Call fillTitle('No Skills Project') and fillCommitment(25) without calling addRequiredSkill()
    await proposalFormPage.fillTitle('No Skills Project');
    await proposalFormPage.fillCommitment(25);
    await expect(proposalFormPage.titleInput).toHaveValue('No Skills Project');
    await expect(proposalFormPage.commitmentInput).toHaveValue('25');
    await expect(proposalFormPage.requiredSkillsList).toHaveCount(0);

    // 3. Call isSubmitDisabled() — form should not allow submission without at least one required skill
    const isDisabled = await proposalFormPage.isSubmitDisabled();
    expect(isDisabled).toBe(true);

    // 4. Assert browser has not navigated away from /proposals
    await expect(page).toHaveURL('/proposals');
  });
});
