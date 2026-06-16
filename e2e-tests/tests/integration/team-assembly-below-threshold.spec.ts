// spec: e2e-tests/specs/team-assembly-integration.plan.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Team Assembly — Below-Threshold Proficiency Scenario', () => {

  let skillId: number;
  let employeeId: number;
  let proposalId: number;

  test.afterEach(async ({ request }) => {
    if (proposalId) await request.delete(`${API}/api/projectproposal/${proposalId}`);
    if (employeeId) await request.delete(`${API}/api/employee/${employeeId}`);
    if (skillId) await request.delete(`${API}/api/skill/${skillId}`);
  });

  test('Scenario 3 — Below-threshold proficiency employee is excluded from suggestedMembers', async ({ request }) => {
    const id = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    // 1. POST /api/skill and capture skillId
    const skillRes = await request.post(`${API}/api/skill`, {
      data: { name: `Kotlin_ProficiencyTest_${id}`, category: 'Backend' },
    });

    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    skillId = skillBody.id;

    // 2. POST /api/employee (capacityPercentage: 0 → availableCapacity: 100) and capture employeeId
    const employeeRes = await request.post(`${API}/api/employee`, {
      data: {
        firstName: 'Undertrained',
        lastName: 'Tester',
        email: `undertrained.tester+${id}@skillweaver.dev`,
        department: 'Engineering',
        capacityPercentage: 0,
      },
    });

    expect(employeeRes.status()).toBe(201);
    const employeeBody = await employeeRes.json();
    expect(typeof employeeBody.id).toBe('number');
    expect(employeeBody.id).toBeGreaterThan(0);
    expect(employeeBody.availableCapacity).toBe(100);
    employeeId = employeeBody.id;

    // 3. POST /api/employee/{employeeId}/skills — assign at Beginner (enum value 1)
    const skillAssignRes = await request.post(`${API}/api/employee/${employeeId}/skills`, {
      data: { skillId, proficiency: 'Beginner' },
    });

    expect(skillAssignRes.status()).toBe(200);

    // 4. POST /api/projectproposal requiring Expert proficiency (enum value 3 > Beginner 1) and capture proposalId
    const proposalRes = await request.post(`${API}/api/projectproposal`, {
      data: {
        title: `ProficiencyGateProject_${id}`,
        description: 'Scenario 3 test',
        requiredCommitmentPercentage: 10,
        requiredSkills: [{ skillId, minimumProficiency: 'Expert' }],
      },
    });

    expect(proposalRes.status()).toBe(201);
    const proposalBody = await proposalRes.json();
    expect(typeof proposalBody.id).toBe('number');
    expect(proposalBody.id).toBeGreaterThan(0);
    expect(proposalBody.requiredCommitmentPercentage).toBe(10);
    proposalId = proposalBody.id;

    // 5. GET /api/projectproposal/{proposalId}/assemble-team — below-threshold employee must NOT appear
    const assembleRes = await request.get(`${API}/api/projectproposal/${proposalId}/assemble-team`);

    expect(assembleRes.status()).toBe(200);
    const assembleBody = await assembleRes.json();
    expect(assembleBody.projectProposalId).toBe(proposalId);
    expect(Array.isArray(assembleBody.suggestedMembers)).toBe(true);

    const found = assembleBody.suggestedMembers.find(
      (m: { email: string }) => m.email === `undertrained.tester+${id}@skillweaver.dev`
    );
    expect(found).toBeUndefined();
    expect(assembleBody.totalCandidates).toBe(0);
  });

});
