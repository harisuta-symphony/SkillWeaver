// spec: specs/plan.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { ProposalFormPage } from '../../page-objects/pages/ProposalFormPage';
import { SuggestedTeamPage } from '../../page-objects/pages/SuggestedTeamPage';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Full Team Assembly — Golden Path Journey', () => {
  let skillId: number;
  let employeeId: number;
  let proposalId: number;

  test.afterEach(async ({ request }) => {
    if (proposalId) await request.delete(`${API}/api/projectproposal/${proposalId}`);
    if (employeeId) await request.delete(`${API}/api/employee/${employeeId}`);
    if (skillId) await request.delete(`${API}/api/skill/${skillId}`);
  });

  test('Seed skill and qualified employee via API, then assemble a team through the UI', async ({ page, request }) => {
    const timestamp = Date.now();

    // 1. POST /api/skill and capture skillId
    const skillName = `E2E_Skill_${timestamp}`;
    const skillRes = await request.post(`${API}/api/skill`, {
      headers: { 'Content-Type': 'application/json' },
      data: { name: skillName, category: 'Engineering' },
    });

    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    expect(skillBody.name).toBe(skillName);
    skillId = skillBody.id;

    // 2. POST /api/employee and capture employeeId
    const employeeEmail = `e2e.candidate+${timestamp}@skillweaver.dev`;
    const employeeRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstName: 'E2E',
        lastName: 'Candidate',
        email: employeeEmail,
        department: 'Engineering',
        capacityPercentage: 20,
      },
    });

    expect(employeeRes.status()).toBe(201);
    const employeeBody = await employeeRes.json();
    expect(typeof employeeBody.id).toBe('number');
    expect(employeeBody.id).toBeGreaterThan(0);
    expect(employeeBody.availableCapacity).toBe(80);
    employeeId = employeeBody.id;

    // 3. POST /api/employee/{employeeId}/skills — assign skill at Intermediate proficiency
    const assignSkillRes = await request.post(`${API}/api/employee/${employeeId}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId, proficiency: 'Intermediate' },
    });

    expect(assignSkillRes.status()).toBe(200);

    // 4. Navigate to /proposals and verify heading
    const proposalForm = new ProposalFormPage(page);
    await proposalForm.goto();
    await expect(page).toHaveURL(/\/proposals/);
    await expect(proposalForm.heading).toBeVisible();

    // 5. Fill proposal title
    await proposalForm.fillTitle('E2E Golden Path Project');
    await expect(proposalForm.titleInput).toHaveValue('E2E Golden Path Project');

    // 6. Fill commitment percentage
    await proposalForm.fillCommitment(30);
    await expect(proposalForm.commitmentInput).toHaveValue('30');

    // 7. Add required skill — select skill from combobox, select proficiency, click Add Skill
    await proposalForm.addRequiredSkill(skillName, 'Intermediate');
    await expect(proposalForm.requiredSkillsList).toHaveCount(await proposalForm.getRequiredSkillCount());
    const skillCount = await proposalForm.getRequiredSkillCount();
    expect(skillCount).toBeGreaterThanOrEqual(1);

    // 8. Assert submit button is enabled, then submit
    await expect(proposalForm.submitButton).toBeEnabled();
    await proposalForm.submit();

    // 9. Wait for navigation to /proposals/{id}/team
    await page.waitForURL(/\/proposals\/\d+\/team/);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/proposals\/\d+\/team/);

    // Extract proposalId from URL for cleanup
    const urlMatch = currentUrl.match(/\/proposals\/(\d+)\/team/);
    if (urlMatch) proposalId = parseInt(urlMatch[1], 10);

    // 10. Wait for loading indicator to disappear
    const suggestedTeam = new SuggestedTeamPage(page);
    await suggestedTeam.waitForResult();
    await expect(suggestedTeam.errorMessage).toHaveCount(0);

    // 11. Verify member count >= 1
    const memberCount = await suggestedTeam.getMemberCount();
    expect(memberCount).toBeGreaterThanOrEqual(1);

    // 12. Verify 'E2E Candidate' appears in member names
    const memberNames = await suggestedTeam.getMemberNames();
    expect(memberNames).toContain('E2E Candidate');
  });
});
