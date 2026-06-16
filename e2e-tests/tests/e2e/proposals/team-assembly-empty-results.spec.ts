// spec: Full Team Assembly — Golden Path Journey
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { SuggestedTeamPage } from '../../page-objects/pages/SuggestedTeamPage';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Full Team Assembly — Golden Path Journey', () => {
  let skillId: number;
  let proposalId: number;

  test.afterEach(async ({ request }) => {
    if (proposalId) await request.delete(`${API}/api/projectproposal/${proposalId}`);
    if (skillId) await request.delete(`${API}/api/skill/${skillId}`);
  });

  test('SuggestedTeamPage shows no employees match when no candidate qualifies', async ({ page, request }) => {
    const timestamp = Date.now();

    // 1. POST http://localhost:5047/api/skill with body { "name": "ImpossibleSkill_{timestamp}", "category": "Research" }, capture skillId
    const skillRes = await request.post(`${API}/api/skill`, {
      headers: { 'Content-Type': 'application/json' },
      data: { name: `ImpossibleSkill_${timestamp}`, category: 'Research' },
    });
    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    skillId = skillBody.id;

    // 2. POST http://localhost:5047/api/projectproposal with requiredSkills referencing the new skill at Expert proficiency, capture proposalId
    const proposalRes = await request.post(`${API}/api/projectproposal`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        title: `Impossible E2E Project_${timestamp}`,
        description: 'Empty results test',
        requiredCommitmentPercentage: 99,
        requiredSkills: [{ skillId, minimumProficiency: 'Expert' }],
      },
    });
    expect(proposalRes.status()).toBe(201);
    const proposalBody = await proposalRes.json();
    expect(typeof proposalBody.id).toBe('number');
    expect(proposalBody.id).toBeGreaterThan(0);
    proposalId = proposalBody.id;

    // 3. Navigate browser to http://localhost:4200/proposals/{proposalId}/team, construct SuggestedTeamPage and call waitForResult()
    await page.goto(`http://localhost:4200/proposals/${proposalId}/team`);
    await expect(page).toHaveURL(`http://localhost:4200/proposals/${proposalId}/team`);
    const suggestedTeamPage = new SuggestedTeamPage(page);
    await suggestedTeamPage.waitForResult();

    // 4. Call getMemberCount() — expect 0
    const memberCount = await suggestedTeamPage.getMemberCount();
    expect(memberCount).toBe(0);

    // 5. Assert noResultsMessage locator (text 'No employees match') is visible
    await expect(suggestedTeamPage.noResultsMessage).toBeVisible();

    // 6. Assert createAnotherLink is visible and navigates to /proposals when clicked
    await expect(suggestedTeamPage.createAnotherLink).toBeVisible();
    await suggestedTeamPage.createAnotherLink.click();
    await expect(page).toHaveURL('http://localhost:4200/proposals');
  });
});
