// spec: specs/team-assembly-core-algorithm.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';
const SKILL_BASE = `${API}/api/skill`;
const EMPLOYEE_BASE = `${API}/api/employee`;
const PROPOSAL_BASE = `${API}/api/projectproposal`;

test.describe('Team Assembly — Overbooked Employee Scenario', () => {

  test('Scenario 2 — Overbooked employee is excluded from suggestedMembers', async ({ request }) => {
    const timestamp = Date.now();

    // 1. POST /api/skill to create a new skill and capture skillId
    const skillRes = await request.post(SKILL_BASE, {
      data: {
        name: `Go_OverbookedTest_${timestamp}`,
        category: 'Backend',
      },
    });

    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    const skillId: number = skillBody.id;

    // 2. POST /api/employee to create overbooked employee (capacityPercentage: 70 → availableCapacity: 30) and capture employeeId
    const employeeRes = await request.post(EMPLOYEE_BASE, {
      data: {
        firstName: 'Overbooked',
        lastName: 'Tester',
        email: `overbooked.tester+${timestamp}@skillweaver.dev`,
        department: 'Engineering',
        capacityPercentage: 70,
      },
    });

    expect(employeeRes.status()).toBe(201);
    const employeeBody = await employeeRes.json();
    expect(typeof employeeBody.id).toBe('number');
    expect(employeeBody.id).toBeGreaterThan(0);
    expect(employeeBody.availableCapacity).toBe(30);
    const employeeId: number = employeeBody.id;

    // 3. POST /api/employee/{employeeId}/skills to assign the skill at Expert proficiency
    const skillAssignRes = await request.post(`${EMPLOYEE_BASE}/${employeeId}/skills`, {
      data: {
        skillId: skillId,
        proficiency: 'Expert',
      },
    });

    expect(skillAssignRes.status()).toBe(200);

    // 4. POST /api/projectproposal to create a proposal requiring 50% commitment (exceeds employee's 30% available) and capture proposalId
    const proposalRes = await request.post(PROPOSAL_BASE, {
      data: {
        title: `OverbookedProject_${timestamp}`,
        description: 'Scenario 2 test',
        requiredCommitmentPercentage: 50,
        requiredSkills: [
          {
            skillId: skillId,
            minimumProficiency: 'Beginner',
          },
        ],
      },
    });

    expect(proposalRes.status()).toBe(201);
    const proposalBody = await proposalRes.json();
    expect(typeof proposalBody.id).toBe('number');
    expect(proposalBody.id).toBeGreaterThan(0);
    expect(proposalBody.requiredCommitmentPercentage).toBe(50);
    const proposalId: number = proposalBody.id;

    // 5. GET /api/projectproposal/{proposalId}/assemble-team and verify the overbooked employee is NOT in suggestedMembers
    const assembleRes = await request.get(`${PROPOSAL_BASE}/${proposalId}/assemble-team`);

    expect(assembleRes.status()).toBe(200);
    const assembleBody = await assembleRes.json();
    expect(assembleBody.projectProposalId).toBe(proposalId);
    expect(Array.isArray(assembleBody.suggestedMembers)).toBe(true);

    const overbookedEmployee = assembleBody.suggestedMembers.find(
      (m: { email: string }) => m.email === `overbooked.tester+${timestamp}@skillweaver.dev`
    );
    expect(overbookedEmployee).toBeUndefined();
  });
});
