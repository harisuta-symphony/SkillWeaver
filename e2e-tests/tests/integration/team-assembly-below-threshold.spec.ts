// spec: specs/team-assembly-scenarios.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Team Assembly — Below-Threshold Proficiency Scenario', () => {

  test('Scenario 3 — Below-threshold proficiency employee is excluded from suggestedMembers', async ({ request }) => {
    const timestamp = Date.now();

    // 1. POST /api/skill with a unique name and capture the returned id as skillId
    const skillRes = await request.post(`${API}/api/skill`, {
      data: {
        name: `Kotlin_ProficiencyTest_${timestamp}`,
        category: 'Backend',
      },
    });

    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    const skillId: number = skillBody.id;

    // 2. POST /api/employee with capacityPercentage 0 (availableCapacity should be 100) and capture employeeId
    const employeeRes = await request.post(`${API}/api/employee`, {
      data: {
        firstName: 'Undertrained',
        lastName: 'Tester',
        email: `undertrained.tester+${timestamp}@skillweaver.dev`,
        department: 'Engineering',
        capacityPercentage: 0,
      },
    });

    expect(employeeRes.status()).toBe(201);
    const employeeBody = await employeeRes.json();
    expect(typeof employeeBody.id).toBe('number');
    expect(employeeBody.id).toBeGreaterThan(0);
    expect(employeeBody.availableCapacity).toBe(100);
    const employeeId: number = employeeBody.id;

    // 3. POST /api/employee/{employeeId}/skills assigning Beginner proficiency for the skill
    const skillAssignRes = await request.post(`${API}/api/employee/${employeeId}/skills`, {
      data: {
        skillId: skillId,
        proficiency: 'Beginner',
      },
    });

    expect(skillAssignRes.status()).toBe(200);

    // 4. POST /api/projectproposal requiring Expert proficiency (higher than employee's Beginner) and capture proposalId
    const proposalRes = await request.post(`${API}/api/projectproposal`, {
      data: {
        title: `ProficiencyGateProject_${timestamp}`,
        description: 'Scenario 3 test',
        requiredCommitmentPercentage: 10,
        requiredSkills: [
          {
            skillId: skillId,
            minimumProficiency: 'Expert',
          },
        ],
      },
    });

    expect(proposalRes.status()).toBe(201);
    const proposalBody = await proposalRes.json();
    expect(typeof proposalBody.id).toBe('number');
    expect(proposalBody.id).toBeGreaterThan(0);
    expect(proposalBody.requiredCommitmentPercentage).toBe(10);
    const proposalId: number = proposalBody.id;

    // 5. GET /api/projectproposal/{proposalId}/assemble-team and verify employee is excluded
    const assembleRes = await request.get(`${API}/api/projectproposal/${proposalId}/assemble-team`);

    expect(assembleRes.status()).toBe(200);
    const assembleBody = await assembleRes.json();
    expect(assembleBody.projectProposalId).toBe(proposalId);
    expect(Array.isArray(assembleBody.suggestedMembers)).toBe(true);

    const excludedEmail = `undertrained.tester+${timestamp}@skillweaver.dev`;
    const found = assembleBody.suggestedMembers.find(
      (m: { email: string }) => m.email === excludedEmail,
    );
    expect(found).toBeUndefined();
  });
});
