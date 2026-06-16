// spec: specs/team-assembly.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Team Assembly — Qualified Employee Scenario', () => {

  test('Scenario 1 — Qualified employee appears in suggestedMembers', async ({ request }) => {
    const timestamp = Date.now();

    // 1. POST /api/skill with body { "name": "Rust_QualifiedTest_{timestamp}", "category": "Backend" } and capture the returned id as skillId. Expect HTTP 201.
    const skillName = `Rust_QualifiedTest_${timestamp}`;
    const skillRes = await request.post(`${API}/api/skill`, {
      headers: { 'Content-Type': 'application/json' },
      data: { name: skillName, category: 'Backend' },
    });

    expect(skillRes.status()).toBe(201);
    const skillBody = await skillRes.json();
    expect(typeof skillBody.id).toBe('number');
    expect(skillBody.id).toBeGreaterThan(0);
    expect(skillBody.name).toBe(skillName);
    const skillId: number = skillBody.id;

    // 2. POST /api/employee with body { "firstName": "Qualified", "lastName": "Tester", "email": "qualified.tester+{timestamp}@skillweaver.dev", "department": "Engineering", "capacityPercentage": 20 } and capture the returned id as employeeId. Expect HTTP 201.
    const employeeEmail = `qualified.tester+${timestamp}@skillweaver.dev`;
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
    const employeeId: number = employeeBody.id;

    // 3. POST /api/employee/{employeeId}/skills with body { "skillId": {skillId}, "proficiency": "Intermediate" }. Expect HTTP 200.
    const assignSkillRes = await request.post(`${API}/api/employee/${employeeId}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: skillId, proficiency: 'Intermediate' },
    });

    expect(assignSkillRes.status()).toBe(200);

    // 4. POST /api/projectproposal with body { "title": "QualifiedProject_{timestamp}", "description": "Scenario 1 test", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": {skillId}, "minimumProficiency": "Intermediate" }] } and capture the returned id as proposalId. Expect HTTP 201.
    const projectTitle = `QualifiedProject_${timestamp}`;
    const proposalRes = await request.post(`${API}/api/projectproposal`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        title: projectTitle,
        description: 'Scenario 1 test',
        requiredCommitmentPercentage: 50,
        requiredSkills: [{ skillId: skillId, minimumProficiency: 'Intermediate' }],
      },
    });

    expect(proposalRes.status()).toBe(201);
    const proposalBody = await proposalRes.json();
    expect(typeof proposalBody.id).toBe('number');
    expect(proposalBody.id).toBeGreaterThan(0);
    expect(proposalBody.requiredCommitmentPercentage).toBe(50);
    const proposalId: number = proposalBody.id;

    // 5. GET /api/projectproposal/{proposalId}/assemble-team and inspect the response body.
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
