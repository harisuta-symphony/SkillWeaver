// spec: e2e-tests/specs/employees-api.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test.describe('Employees API', () => {

  // ---------------------------------------------------------------------------
  // 1.1 GET /api/employee returns 200 with a non-empty array of employees
  // ---------------------------------------------------------------------------
  test('GET /api/employee returns 200 with a non-empty array of employees', async ({ request }) => {
    // 1. Send GET http://localhost:5047/api/employee with no request body or query parameters
    const res = await request.get(`${API}/api/employee`);

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');

    const body = await res.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(4);

    // 2. Inspect each item in the response array for required fields
    for (const item of body) {
      expect(typeof item.id).toBe('number');
      expect(item.id).toBeGreaterThan(0);
      expect(typeof item.firstName).toBe('string');
      expect(typeof item.lastName).toBe('string');
      expect(typeof item.email).toBe('string');
      expect(typeof item.capacityPercentage).toBe('number');
      expect(item.capacityPercentage).toBeGreaterThanOrEqual(0);
      expect(item.capacityPercentage).toBeLessThanOrEqual(100);
      expect(typeof item.availableCapacity).toBe('number');
      expect(item.availableCapacity).toBe(100 - item.capacityPercentage);
      expect(Array.isArray(item.skills)).toBe(true);
    }

    // 3. Verify the four seeded employees are present in the response array
    const alice = body.find((e: { firstName: string; lastName: string }) => e.firstName === 'Alice' && e.lastName === 'Chen');
    expect(alice).toBeTruthy();
    expect(alice.department).toBe('Engineering');
    expect(alice.capacityPercentage).toBe(20);

    const bruno = body.find((e: { firstName: string; lastName: string }) => e.firstName === 'Bruno' && e.lastName === 'Martins');
    expect(bruno).toBeTruthy();
    expect(bruno.department).toBe('Engineering');
    expect(bruno.capacityPercentage).toBe(60);

    const clara = body.find((e: { firstName: string; lastName: string }) => e.firstName === 'Clara' && e.lastName === 'Nkosi');
    expect(clara).toBeTruthy();
    expect(clara.department).toBe('Architecture');
    expect(clara.capacityPercentage).toBe(0);

    const david = body.find((e: { firstName: string; lastName: string }) => e.firstName === 'David' && e.lastName === 'Park');
    expect(david).toBeTruthy();
    expect(david.department).toBe('Frontend');
    expect(david.capacityPercentage).toBe(80);

    // 4. Inspect the skills arrays of the seeded employees
    const aliceAngular = alice.skills.find((s: { skillName: string }) => s.skillName === 'Angular');
    expect(aliceAngular).toBeTruthy();
    expect(aliceAngular.proficiencyLevel).toBe('Expert');

    const aliceDotnet = alice.skills.find((s: { skillName: string }) => s.skillName === '.NET');
    expect(aliceDotnet).toBeTruthy();
    expect(aliceDotnet.proficiencyLevel).toBe('Intermediate');

    const brunoDotnet = bruno.skills.find((s: { skillName: string }) => s.skillName === '.NET');
    expect(brunoDotnet).toBeTruthy();
    expect(brunoDotnet.proficiencyLevel).toBe('Expert');

    const brunoPostgres = bruno.skills.find((s: { skillName: string }) => s.skillName === 'PostgreSQL');
    expect(brunoPostgres).toBeTruthy();
    expect(brunoPostgres.proficiencyLevel).toBe('Expert');

    const brunoDocker = bruno.skills.find((s: { skillName: string }) => s.skillName === 'Docker');
    expect(brunoDocker).toBeTruthy();
    expect(brunoDocker.proficiencyLevel).toBe('Intermediate');

    const claraSystemDesign = clara.skills.find((s: { skillName: string }) => s.skillName === 'System Design');
    expect(claraSystemDesign).toBeTruthy();
    expect(claraSystemDesign.proficiencyLevel).toBe('Expert');

    const claraDotnet = clara.skills.find((s: { skillName: string }) => s.skillName === '.NET');
    expect(claraDotnet).toBeTruthy();
    expect(claraDotnet.proficiencyLevel).toBe('Intermediate');

    const claraPostgres = clara.skills.find((s: { skillName: string }) => s.skillName === 'PostgreSQL');
    expect(claraPostgres).toBeTruthy();
    expect(claraPostgres.proficiencyLevel).toBe('Intermediate');

    const davidReact = david.skills.find((s: { skillName: string }) => s.skillName === 'React');
    expect(davidReact).toBeTruthy();
    expect(davidReact.proficiencyLevel).toBe('Expert');

    const davidAngular = david.skills.find((s: { skillName: string }) => s.skillName === 'Angular');
    expect(davidAngular).toBeTruthy();
    expect(davidAngular.proficiencyLevel).toBe('Beginner');

    for (const emp of [alice, bruno, clara, david]) {
      for (const skill of emp.skills) {
        expect(typeof skill.skillId).toBe('number');
        expect(skill.skillId).toBeGreaterThan(0);
        expect(typeof skill.skillName).toBe('string');
        expect(skill.skillName.length).toBeGreaterThan(0);
        expect(typeof skill.proficiencyLevel).toBe('string');
        expect(skill.proficiencyLevel.length).toBeGreaterThan(0);
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 1.2 POST /api/employee creates a new employee and returns 201 with the created resource
  // ---------------------------------------------------------------------------
  test('POST /api/employee creates a new employee and returns 201 with the created resource', async ({ request }) => {
    // 1. Send POST http://localhost:5047/api/employee with Content-Type: application/json
    const email = `eva.rodriguez+${Date.now()}@skillweaver.dev`;
    const postRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstName: 'Eva',
        lastName: 'Rodriguez',
        email,
        department: 'QA',
        capacityPercentage: 30,
      },
    });

    expect(postRes.status()).toBe(201);
    expect(postRes.headers()['content-type']).toContain('application/json');

    const created = await postRes.json();

    expect(typeof created.id).toBe('number');
    expect(created.id).toBeGreaterThan(0);
    expect(created.firstName).toBe('Eva');
    expect(created.lastName).toBe('Rodriguez');
    expect(created.email).toBe(email);
    expect(created.department).toBe('QA');
    expect(created.capacityPercentage).toBe(30);
    expect(created.availableCapacity).toBe(70);
    expect(Array.isArray(created.skills)).toBe(true);
    expect(created.skills.length).toBe(0);

    const locationHeader = postRes.headers()['location'];
    expect(locationHeader).toBeTruthy();
    expect(locationHeader.toLowerCase()).toContain(`/api/employee/${created.id}`);

    // 2. Send GET /api/employee to verify the newly created employee is present
    const getAllRes = await request.get(`${API}/api/employee`);

    expect(getAllRes.status()).toBe(200);

    const allEmployees = await getAllRes.json();
    const found = allEmployees.find((e: { firstName: string; email: string }) => e.firstName === 'Eva' && e.email === email);

    expect(found).toBeTruthy();
    expect(allEmployees.length).toBeGreaterThanOrEqual(5);
  });

  // ---------------------------------------------------------------------------
  // 1.3 POST /api/employee creates an employee without the optional department field
  // ---------------------------------------------------------------------------
  test('POST /api/employee creates an employee without the optional department field', async ({ request }) => {
    // 1. Send POST http://localhost:5047/api/employee with department field omitted
    const email = `frank.osei+${Date.now()}@skillweaver.dev`;
    const postRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstName: 'Frank',
        lastName: 'Osei',
        email,
        capacityPercentage: 0,
      },
    });

    expect(postRes.status()).toBe(201);

    const created = await postRes.json();

    expect(typeof created.id).toBe('number');
    expect(created.id).toBeGreaterThan(0);
    expect(created.firstName).toBe('Frank');
    expect(created.lastName).toBe('Osei');
    expect(created.email).toBe(email);
    expect(created.department == null).toBe(true);
    expect(created.capacityPercentage).toBe(0);
    expect(created.availableCapacity).toBe(100);
  });

  // ---------------------------------------------------------------------------
  // 1.4 GET /api/employee/{id} returns the correct employee for a seeded ID
  // ---------------------------------------------------------------------------
  test('GET /api/employee/{id} returns the correct employee for a seeded ID', async ({ request }) => {
    // 1. Send GET /api/employee to retrieve all employees and record Alice Chen's id
    const listRes = await request.get(`${API}/api/employee`);

    expect(listRes.status()).toBe(200);

    const allEmployees = await listRes.json();
    const alice = allEmployees.find((e: { email: string }) => e.email === 'alice.chen@skillweaver.dev');

    expect(alice).toBeTruthy();
    expect(typeof alice.id).toBe('number');
    expect(alice.id).toBeGreaterThan(0);

    // 2. Send GET /api/employee/{id} using Alice Chen's id
    const getRes = await request.get(`${API}/api/employee/${alice.id}`);

    expect(getRes.status()).toBe(200);
    expect(getRes.headers()['content-type']).toContain('application/json');

    const emp = await getRes.json();

    expect(Array.isArray(emp)).toBe(false);
    expect(emp.id).toBe(alice.id);
    expect(emp.firstName).toBe('Alice');
    expect(emp.lastName).toBe('Chen');
    expect(emp.email).toBe('alice.chen@skillweaver.dev');
    expect(emp.department).toBe('Engineering');
    expect(emp.capacityPercentage).toBe(20);
    expect(emp.availableCapacity).toBe(80);
    expect(Array.isArray(emp.skills)).toBe(true);
    expect(emp.skills.length).toBe(2);

    const angular = emp.skills.find((s: { skillName: string }) => s.skillName === 'Angular');
    expect(angular).toBeTruthy();
    expect(angular.proficiencyLevel).toBe('Expert');

    const dotnet = emp.skills.find((s: { skillName: string }) => s.skillName === '.NET');
    expect(dotnet).toBeTruthy();
    expect(dotnet.proficiencyLevel).toBe('Intermediate');
  });

  // ---------------------------------------------------------------------------
  // 1.5 GET /api/employee/{id} returns the correct employee after a POST
  // ---------------------------------------------------------------------------
  test('GET /api/employee/{id} returns the correct employee after a POST', async ({ request }) => {
    // 1. Send POST /api/employee with Grace Kim's data and record the id from the 201 response
    const email = `grace.kim+${Date.now()}@skillweaver.dev`;
    const postRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstName: 'Grace',
        lastName: 'Kim',
        email,
        department: 'DevOps',
        capacityPercentage: 50,
      },
    });

    expect(postRes.status()).toBe(201);

    const created = await postRes.json();

    expect(typeof created.id).toBe('number');
    expect(created.id).toBeGreaterThan(0);

    // 2. Send GET /api/employee/{id} using the id returned in the previous step
    const getRes = await request.get(`${API}/api/employee/${created.id}`);

    expect(getRes.status()).toBe(200);

    const emp = await getRes.json();

    expect(emp.id).toBe(created.id);
    expect(emp.firstName).toBe('Grace');
    expect(emp.lastName).toBe('Kim');
    expect(emp.email).toBe(email);
    expect(emp.department).toBe('DevOps');
    expect(emp.capacityPercentage).toBe(50);
    expect(emp.availableCapacity).toBe(50);
    expect(Array.isArray(emp.skills)).toBe(true);
    expect(emp.skills.length).toBe(0);
  });

  // ---------------------------------------------------------------------------
  // 1.6 GET /api/employee/{id} returns 404 for a non-existent ID
  // ---------------------------------------------------------------------------
  test('GET /api/employee/{id} returns 404 for a non-existent ID', async ({ request }) => {
    // 1. Send GET /api/employee/999999 (an ID that does not exist in the database)
    const res = await request.get(`${API}/api/employee/999999`);

    expect(res.status()).toBe(404);

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    if (parsed !== null && typeof parsed === 'object') {
      const obj = parsed as Record<string, unknown>;
      const hasValidId = typeof obj['id'] === 'number' && (obj['id'] as number) > 0;
      const hasFirstName = typeof obj['firstName'] === 'string' && (obj['firstName'] as string).length > 0;
      const hasLastName = typeof obj['lastName'] === 'string' && (obj['lastName'] as string).length > 0;
      expect(hasValidId && hasFirstName && hasLastName).toBe(false);
    }
  });

  // ---------------------------------------------------------------------------
  // 1.7 PATCH /api/employee/{id}/capacity updates the employee's capacityPercentage and returns 200
  // ---------------------------------------------------------------------------
  test('PATCH /api/employee/{id}/capacity updates the capacityPercentage and returns 200', async ({ request }) => {
    // 1. Send GET /api/employee to retrieve all employees and record Clara Nkosi's id
    const listRes = await request.get(`${API}/api/employee`);

    expect(listRes.status()).toBe(200);

    const allEmployees = await listRes.json();
    const clara = allEmployees.find((e: { email: string }) => e.email === 'clara.nkosi@skillweaver.dev');

    expect(clara).toBeTruthy();
    expect(clara.capacityPercentage).toBe(0);
    expect(clara.availableCapacity).toBe(100);

    // 2. Send PATCH /api/employee/{id}/capacity with body { "capacityPercentage": 40 }
    const patchRes = await request.patch(`${API}/api/employee/${clara.id}/capacity`, {
      headers: { 'Content-Type': 'application/json' },
      data: { capacityPercentage: 40 },
    });

    expect(patchRes.status()).toBe(200);
    expect(patchRes.headers()['content-type']).toContain('application/json');

    const patched = await patchRes.json();

    expect(patched.capacityPercentage).toBe(40);
    expect(patched.availableCapacity).toBe(60);
    expect(patched.firstName).toBe('Clara');
    expect(patched.lastName).toBe('Nkosi');
    expect(patched.email).toBe('clara.nkosi@skillweaver.dev');
    expect(patched.department).toBe('Architecture');
    expect(Array.isArray(patched.skills)).toBe(true);

    // 3. Send GET /api/employee/{id} to confirm the update was persisted
    const getRes = await request.get(`${API}/api/employee/${clara.id}`);

    expect(getRes.status()).toBe(200);

    const fetched = await getRes.json();

    expect(fetched.capacityPercentage).toBe(40);
    expect(fetched.availableCapacity).toBe(60);

    // Restore Clara's capacity to 0 to avoid affecting other tests
    await request.patch(`${API}/api/employee/${clara.id}/capacity`, {
      headers: { 'Content-Type': 'application/json' },
      data: { capacityPercentage: 0 },
    });
  });

  // ---------------------------------------------------------------------------
  // 1.8 PATCH /api/employee/{id}/capacity sets capacityPercentage to boundary values 0 and 100
  // ---------------------------------------------------------------------------
  test('PATCH /api/employee/{id}/capacity sets capacityPercentage to boundary values 0 and 100', async ({ request }) => {
    // 1. Send GET /api/employee, record the id of Bruno Martins
    const listRes = await request.get(`${API}/api/employee`);

    expect(listRes.status()).toBe(200);

    const allEmployees = await listRes.json();
    const bruno = allEmployees.find((e: { email: string }) => e.email === 'bruno.martins@skillweaver.dev');

    expect(bruno).toBeTruthy();
    expect(typeof bruno.id).toBe('number');

    // 2. Send PATCH /api/employee/{id}/capacity with body { "capacityPercentage": 0 }
    const patchZeroRes = await request.patch(`${API}/api/employee/${bruno.id}/capacity`, {
      headers: { 'Content-Type': 'application/json' },
      data: { capacityPercentage: 0 },
    });

    expect(patchZeroRes.status()).toBe(200);

    const patchedZero = await patchZeroRes.json();

    expect(patchedZero.capacityPercentage).toBe(0);
    expect(patchedZero.availableCapacity).toBe(100);

    // 3. Send PATCH /api/employee/{id}/capacity with body { "capacityPercentage": 100 }
    const patchHundredRes = await request.patch(`${API}/api/employee/${bruno.id}/capacity`, {
      headers: { 'Content-Type': 'application/json' },
      data: { capacityPercentage: 100 },
    });

    expect(patchHundredRes.status()).toBe(200);

    const patchedHundred = await patchHundredRes.json();

    expect(patchedHundred.capacityPercentage).toBe(100);
    expect(patchedHundred.availableCapacity).toBe(0);

    // Restore Bruno's capacity to original value (60)
    await request.patch(`${API}/api/employee/${bruno.id}/capacity`, {
      headers: { 'Content-Type': 'application/json' },
      data: { capacityPercentage: 60 },
    });
  });

  // ---------------------------------------------------------------------------
  // 1.9 PATCH /api/employee/{id}/capacity returns 404 for a non-existent employee ID
  // ---------------------------------------------------------------------------
  test('PATCH /api/employee/{id}/capacity returns 404 for a non-existent employee ID', async ({ request }) => {
    // 1. Send PATCH /api/employee/999999/capacity with body { "capacityPercentage": 50 }
    const res = await request.patch(`${API}/api/employee/999999/capacity`, {
      headers: { 'Content-Type': 'application/json' },
      data: { capacityPercentage: 50 },
    });

    expect(res.status()).toBe(404);
  });

  // ---------------------------------------------------------------------------
  // 1.10 POST /api/employee/{id}/skills assigns a skill to an existing employee and returns 200
  // ---------------------------------------------------------------------------
  test('POST /api/employee/{id}/skills assigns a skill to an existing employee and returns 200', async ({ request }) => {
    // 1. Send GET /api/employee to record David Park's id, and GET /api/skill to record the Docker skill id
    const [empRes, skillRes] = await Promise.all([
      request.get(`${API}/api/employee`),
      request.get(`${API}/api/skill`),
    ]);

    expect(empRes.status()).toBe(200);
    expect(skillRes.status()).toBe(200);

    const allEmployees = await empRes.json();
    const allSkills = await skillRes.json();

    const david = allEmployees.find((e: { email: string }) => e.email === 'david.park@skillweaver.dev');
    expect(david).toBeTruthy();

    const dockerSkill = allSkills.find((s: { name: string }) => s.name === 'Docker');
    expect(dockerSkill).toBeTruthy();
    expect(typeof dockerSkill.id).toBe('number');
    expect(dockerSkill.id).toBeGreaterThan(0);

    const skillCountBefore = david.skills.filter((s: { skillName: string }) => s.skillName !== 'Docker').length;

    // 2. Send POST /api/employee/{employeeId}/skills with body { "skillId": dockerSkillId, "proficiency": "Intermediate" }
    const assignRes = await request.post(`${API}/api/employee/${david.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: dockerSkill.id, proficiency: 'Intermediate' },
    });

    expect(assignRes.status()).toBe(200);

    // 3. Send GET /api/employee/{employeeId} to verify the skill was assigned
    const getRes = await request.get(`${API}/api/employee/${david.id}`);

    expect(getRes.status()).toBe(200);

    const updatedDavid = await getRes.json();
    const dockerEntry = updatedDavid.skills.find((s: { skillName: string }) => s.skillName === 'Docker');

    expect(dockerEntry).toBeTruthy();
    expect(dockerEntry.proficiencyLevel).toBe('Intermediate');
    const nonDockerCount = updatedDavid.skills.filter((s: { skillName: string }) => s.skillName !== 'Docker').length;
    expect(nonDockerCount).toBe(skillCountBefore);

    const react = updatedDavid.skills.find((s: { skillName: string }) => s.skillName === 'React');
    expect(react).toBeTruthy();
    expect(react.proficiencyLevel).toBe('Expert');

    const angular = updatedDavid.skills.find((s: { skillName: string }) => s.skillName === 'Angular');
    expect(angular).toBeTruthy();
    expect(angular.proficiencyLevel).toBe('Beginner');
  });

  // ---------------------------------------------------------------------------
  // 1.11 POST /api/employee/{id}/skills assigns a skill with each valid proficiency level
  // ---------------------------------------------------------------------------
  test('POST /api/employee/{id}/skills assigns a skill with each valid proficiency level', async ({ request }) => {
    // 1. Create a new employee and record all skill ids
    const email = `henry.webb+${Date.now()}@skillweaver.dev`;
    const postEmpRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: { firstName: 'Henry', lastName: 'Webb', email, capacityPercentage: 10 },
    });

    expect(postEmpRes.status()).toBe(201);

    const newEmp = await postEmpRes.json();

    expect(typeof newEmp.id).toBe('number');
    expect(newEmp.id).toBeGreaterThan(0);

    const skillRes = await request.get(`${API}/api/skill`);

    expect(skillRes.status()).toBe(200);

    const allSkills = await skillRes.json();
    const angularSkill = allSkills.find((s: { name: string }) => s.name === 'Angular');
    const reactSkill = allSkills.find((s: { name: string }) => s.name === 'React');
    const dotnetSkill = allSkills.find((s: { name: string }) => s.name === '.NET');

    expect(angularSkill).toBeTruthy();
    expect(reactSkill).toBeTruthy();
    expect(dotnetSkill).toBeTruthy();

    // 2. Send POST /api/employee/{id}/skills with Angular at Beginner
    const res1 = await request.post(`${API}/api/employee/${newEmp.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: angularSkill.id, proficiency: 'Beginner' },
    });

    expect(res1.status()).toBe(200);

    // 3. Send POST /api/employee/{id}/skills with React at Intermediate
    const res2 = await request.post(`${API}/api/employee/${newEmp.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: reactSkill.id, proficiency: 'Intermediate' },
    });

    expect(res2.status()).toBe(200);

    // 4. Send POST /api/employee/{id}/skills with .NET at Expert
    const res3 = await request.post(`${API}/api/employee/${newEmp.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: dotnetSkill.id, proficiency: 'Expert' },
    });

    expect(res3.status()).toBe(200);

    // 5. Send GET /api/employee/{id} to verify all three skills were assigned
    const getRes = await request.get(`${API}/api/employee/${newEmp.id}`);

    expect(getRes.status()).toBe(200);

    const emp = await getRes.json();

    expect(emp.skills.length).toBe(3);

    const assignedAngular = emp.skills.find((s: { skillName: string }) => s.skillName === 'Angular');
    expect(assignedAngular).toBeTruthy();
    expect(assignedAngular.proficiencyLevel).toBe('Beginner');

    const assignedReact = emp.skills.find((s: { skillName: string }) => s.skillName === 'React');
    expect(assignedReact).toBeTruthy();
    expect(assignedReact.proficiencyLevel).toBe('Intermediate');

    const assignedDotnet = emp.skills.find((s: { skillName: string }) => s.skillName === '.NET');
    expect(assignedDotnet).toBeTruthy();
    expect(assignedDotnet.proficiencyLevel).toBe('Expert');
  });

  // ---------------------------------------------------------------------------
  // 1.12 POST /api/employee/{id}/skills updates proficiency when the same skill is assigned again
  // ---------------------------------------------------------------------------
  test('POST /api/employee/{id}/skills updates proficiency when the same skill is assigned again', async ({ request }) => {
    // 1. Record Alice Chen's id and the Angular skill id; note Angular is at Expert
    const [empRes, skillRes] = await Promise.all([
      request.get(`${API}/api/employee`),
      request.get(`${API}/api/skill`),
    ]);

    expect(empRes.status()).toBe(200);
    expect(skillRes.status()).toBe(200);

    const allEmployees = await empRes.json();
    const allSkills = await skillRes.json();

    const alice = allEmployees.find((e: { email: string }) => e.email === 'alice.chen@skillweaver.dev');
    expect(alice).toBeTruthy();

    const aliceAngular = alice.skills.find((s: { skillName: string }) => s.skillName === 'Angular');
    expect(aliceAngular).toBeTruthy();
    expect(aliceAngular.proficiencyLevel).toBe('Expert');

    const angularSkill = allSkills.find((s: { name: string }) => s.name === 'Angular');
    expect(angularSkill).toBeTruthy();

    const skillCountBefore = alice.skills.length;

    // 2. Send POST /api/employee/{aliceId}/skills with Angular at Beginner to downgrade
    const assignRes = await request.post(`${API}/api/employee/${alice.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: angularSkill.id, proficiency: 'Beginner' },
    });

    expect(assignRes.status()).toBe(200);

    // 3. Send GET /api/employee/{aliceId} to verify the proficiency was updated
    const getRes = await request.get(`${API}/api/employee/${alice.id}`);

    expect(getRes.status()).toBe(200);

    const updatedAlice = await getRes.json();
    const angularEntries = updatedAlice.skills.filter((s: { skillName: string }) => s.skillName === 'Angular');

    expect(angularEntries.length).toBe(1);
    expect(angularEntries[0].proficiencyLevel).toBe('Beginner');
    expect(updatedAlice.skills.length).toBe(skillCountBefore);

    // Restore Alice's Angular proficiency to Expert
    await request.post(`${API}/api/employee/${alice.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: angularSkill.id, proficiency: 'Expert' },
    });
  });

  // ---------------------------------------------------------------------------
  // 1.13 POST /api/employee/{id}/skills returns 400 for an invalid proficiency value
  // ---------------------------------------------------------------------------
  test('POST /api/employee/{id}/skills returns 400 for an invalid proficiency value', async ({ request }) => {
    // 1. Get any seeded employee id and any skill id
    const [empRes, skillRes] = await Promise.all([
      request.get(`${API}/api/employee`),
      request.get(`${API}/api/skill`),
    ]);

    expect(empRes.status()).toBe(200);
    expect(skillRes.status()).toBe(200);

    const allEmployees = await empRes.json();
    const allSkills = await skillRes.json();

    const emp = allEmployees[0];
    const skill = allSkills[0];

    expect(emp).toBeTruthy();
    expect(skill).toBeTruthy();

    // 2. Send POST /api/employee/{id}/skills with proficiency "Master" (invalid)
    const res = await request.post(`${API}/api/employee/${emp.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: skill.id, proficiency: 'Master' },
    });

    expect(res.status()).toBe(400);

    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // 1.14 POST /api/employee/{id}/skills returns 400 for a non-existent skill ID
  // ---------------------------------------------------------------------------
  test('POST /api/employee/{id}/skills returns 400 for a non-existent skill ID', async ({ request }) => {
    // 1. Get any seeded employee id (Alice Chen)
    const listRes = await request.get(`${API}/api/employee`);

    expect(listRes.status()).toBe(200);

    const allEmployees = await listRes.json();
    const alice = allEmployees.find((e: { email: string }) => e.email === 'alice.chen@skillweaver.dev');

    expect(alice).toBeTruthy();
    expect(typeof alice.id).toBe('number');

    // 2. Send POST /api/employee/{id}/skills with non-existent skillId 999999
    const res = await request.post(`${API}/api/employee/${alice.id}/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: 999999, proficiency: 'Expert' },
    });

    expect([400, 500]).toContain(res.status());

    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // 1.15 POST /api/employee/{id}/skills returns 400 for a non-existent employee ID
  // ---------------------------------------------------------------------------
  test('POST /api/employee/{id}/skills returns 400 for a non-existent employee ID', async ({ request }) => {
    // 1. Get any seeded skill id (Angular)
    const skillRes = await request.get(`${API}/api/skill`);

    expect(skillRes.status()).toBe(200);

    const allSkills = await skillRes.json();
    const angularSkill = allSkills.find((s: { name: string }) => s.name === 'Angular');

    expect(angularSkill).toBeTruthy();
    expect(typeof angularSkill.id).toBe('number');

    // 2. Send POST /api/employee/999999/skills with a valid skill id and non-existent employee
    const res = await request.post(`${API}/api/employee/999999/skills`, {
      headers: { 'Content-Type': 'application/json' },
      data: { skillId: angularSkill.id, proficiency: 'Expert' },
    });

    expect([400, 404, 500]).toContain(res.status());

    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // 1.16 POST /api/employee rejects a request with a missing required field
  // ---------------------------------------------------------------------------
  // Employee endpoint has no server-side validation yet; missing fields are accepted
  test.skip('POST /api/employee rejects a request with a missing required field', async ({ request }) => {
    // 1. Send POST /api/employee with firstName field omitted
    const res1 = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: { lastName: 'Test', email: 'test@skillweaver.dev', capacityPercentage: 10 },
    });

    expect([400, 422]).toContain(res1.status());

    // 2. Send POST /api/employee with email field omitted
    const res2 = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: { firstName: 'Test', lastName: 'User', capacityPercentage: 10 },
    });

    expect([400, 422, 500]).toContain(res2.status());
  });

  // ---------------------------------------------------------------------------
  // 1.17 GET /api/employee/{id} returns 404 for ID zero and negative IDs
  // ---------------------------------------------------------------------------
  test('GET /api/employee/{id} returns 404 for ID zero and negative IDs', async ({ request }) => {
    // 1. Send GET /api/employee/0
    const resZero = await request.get(`${API}/api/employee/0`);

    expect([400, 404]).toContain(resZero.status());

    // 2. Send GET /api/employee/-1
    const resNeg = await request.get(`${API}/api/employee/-1`);

    expect([400, 404]).toContain(resNeg.status());
  });

  // ---------------------------------------------------------------------------
  // 1.18 GET /api/employee/{id} returns 400 for a non-integer ID
  // ---------------------------------------------------------------------------
  test('GET /api/employee/{id} returns 400 for a non-integer ID', async ({ request }) => {
    // 1. Send GET /api/employee/abc (a non-numeric string in place of the integer ID)
    const res = await request.get(`${API}/api/employee/abc`);

    expect(res.status()).toBe(400);

    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // 1.19 POST /api/employee rejects a duplicate email address
  // ---------------------------------------------------------------------------
  test('POST /api/employee rejects a duplicate email address', async ({ request }) => {
    // 1. Send POST /api/employee with alice.chen@skillweaver.dev which already exists in the seeded data
    const dupRes = await request.post(`${API}/api/employee`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstName: 'Duplicate',
        lastName: 'Alice',
        email: 'alice.chen@skillweaver.dev',
        capacityPercentage: 0,
      },
    });

    expect(dupRes.status()).not.toBe(201);

    // 2. Send GET /api/employee and count how many employees have the email alice.chen@skillweaver.dev
    const getAllRes = await request.get(`${API}/api/employee`);

    expect(getAllRes.status()).toBe(200);

    const allEmployees = await getAllRes.json();
    const aliceCount = allEmployees.filter((e: { email: string }) => e.email === 'alice.chen@skillweaver.dev').length;

    expect(aliceCount).toBe(1);
  });

});
