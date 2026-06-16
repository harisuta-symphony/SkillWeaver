// spec: e2e-tests/specs/team-assembly-integration.plan.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Team Assembly — Qualified Employee Scenario', () => {

  let skillId: number;
  let employeeId: number;
  let proposalId: number;

  test.afterEach(async ({ request }) => {
    if (proposalId) await request.delete(`${API}/api/projectproposal/${proposalId}`);
    if (employeeId) await request.delete(`${API}/api/employee/${employeeId}`);
    if (skillId) await request.delete(`${API}/api/skill/${skillId}`);
  });

  test('Scenario 1 — Qualified employee appears in suggestedMembers', async ({ request }) => {
    const id = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    // 1. POST /api/skill and capture skillId
    const skillName = `Rust_QualifiedTest_${id}`;
    const skillRes = await request.post(`${API}/api/skill`, {
      headers: { 'Content-Type': 'application/json' },
      data: { name: skillName, category: 'Backend' },
    });

    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    expect(skillBody.name).toBe(skillName);
    skillId = skillBody.id;

    // 2. POST /api/employee (capacityPercentage: 20 → availableCapacity: 80) and capture employeeId
    const employeeEmail = `qualified.tester+${id}@skillweaver.dev`;
    const employeeRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstName: 'Qualified',
        lastName: 'Tester',
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

    // 4. POST /api/projectproposal requiring 50% commitment and Intermediate proficiency, capture proposalId
    const projectTitle = `QualifiedProject_${id}`;
    const proposalRes = await request.post(`${API}/api/projectproposal`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        title: projectTitle,
        description: 'Scenario 1 test',
        requiredCommitmentPercentage: 50,
        requiredSkills: [{ skillId, minimumProficiency: 'Intermediate' }],
      },
    });

    expect(proposalRes.status()).toBe(201);
    const proposalBody = await proposalRes.json();
    expect(typeof proposalBody.id).toBe('number');
    expect(proposalBody.id).toBeGreaterThan(0);
    expect(proposalBody.requiredCommitmentPercentage).toBe(50);
    proposalId = proposalBody.id;

    // 5. GET /api/projectproposal/{proposalId}/assemble-team — employee must appear in suggestedMembers
    const assembleRes = await request.get(`${API}/api/projectproposal/${proposalId}/assemble-team`);

    expect(assembleRes.status()).toBe(200);
    const assembleBody = await assembleRes.json();
    expect(assembleBody.projectProposalId).toBe(proposalId);
    expect(assembleBody.projectTitle).toBe(projectTitle);
    expect(Array.isArray(assembleBody.suggestedMembers)).toBe(true);

    const member = assembleBody.suggestedMembers.find(
      (m: { email: string }) => m.email === employeeEmail
    );
    expect(member).toBeDefined();
    expect(assembleBody.suggestedMembers).toHaveLength(1);
    expect(member.employeeId).toBe(employeeId);
    expect(member.availableCapacity).toBe(80);
    expect(Array.isArray(member.matchedSkills)).toBe(true);
    expect(member.matchedSkills).toHaveLength(1);
    expect(member.matchedSkills[0].skillId).toBe(skillId);
    expect(member.matchedSkills[0].proficiencyLevel).toBe('Intermediate');
    expect(assembleBody.totalCandidates).toBe(1);
  });

});
