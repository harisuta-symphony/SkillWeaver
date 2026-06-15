// spec: e2e-tests/specs/proposals-api.md
// seed: e2e-tests/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';
const BASE = `${API}/api/projectproposal`;

// ---------------------------------------------------------------------------
// 1. POST /api/projectproposal — Create Proposal
// ---------------------------------------------------------------------------
test.describe('POST /api/projectproposal — Create Proposal', () => {

  // 1.1 Creates a proposal with required skills and returns 201
  test.describe('Creates a proposal with required skills and returns 201', () => {

    test('creates a single-skill proposal and returns correct shape', async ({ request }) => {
      const suffix = Date.now();

      // 1. Send POST with title "Alpha Backend Service {suffix}", one required skill
      const res = await request.post(BASE, {
        data: {
          title: `Alpha Backend Service ${suffix}`,
          description: 'New microservice project',
          requiredCommitmentPercentage: 50,
          requiredSkills: [{ skillId: 2, minimumProficiency: 'Intermediate' }],
        },
      });

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(typeof body.id).toBe('number');
      expect(body.id).toBeGreaterThan(0);
      expect(body.title).toBe(`Alpha Backend Service ${suffix}`);
      expect(body.description).toBe('New microservice project');
      expect(body.requiredCommitmentPercentage).toBe(50);
      expect(new Date(body.createdAt).toISOString()).toBeTruthy();
      expect(Array.isArray(body.requiredSkills)).toBe(true);
      expect(body.requiredSkills).toHaveLength(1);
      expect(body.requiredSkills[0].skillId).toBe(2);
      expect(body.requiredSkills[0].minimumProficiency).toBe('Intermediate');
      const location = res.headers()['location'];
      expect(location.toLowerCase()).toMatch(new RegExp(`/api/projectproposal/${body.id}`));
    });

    test('creates a two-skill proposal without description and returns correct shape', async ({ request }) => {
      const suffix = Date.now();

      // 2. Send POST with two required skills, no description
      const res = await request.post(BASE, {
        data: {
          title: `Full Stack Platform ${suffix}`,
          requiredCommitmentPercentage: 30,
          requiredSkills: [
            { skillId: 1, minimumProficiency: 'Expert' },
            { skillId: 2, minimumProficiency: 'Beginner' },
          ],
        },
      });

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.title).toBe(`Full Stack Platform ${suffix}`);
      expect(body.description == null).toBe(true);
      expect(Array.isArray(body.requiredSkills)).toBe(true);
      expect(body.requiredSkills).toHaveLength(2);
      const skill1 = body.requiredSkills.find((s: { skillId: number }) => s.skillId === 1);
      const skill2 = body.requiredSkills.find((s: { skillId: number }) => s.skillId === 2);
      expect(skill1).toBeDefined();
      expect(skill1.minimumProficiency).toBe('Expert');
      expect(skill2).toBeDefined();
      expect(skill2.minimumProficiency).toBe('Beginner');
    });

    test('creates a proposal with maximum commitment percentage of 100', async ({ request }) => {
      const suffix = Date.now();

      // 3. Send POST with requiredCommitmentPercentage: 100
      const res = await request.post(BASE, {
        data: {
          title: `Infra Upgrade ${suffix}`,
          requiredCommitmentPercentage: 100,
          requiredSkills: [{ skillId: 6, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.requiredCommitmentPercentage).toBe(100);
    });

    test('creates a proposal with minimum commitment percentage of 1', async ({ request }) => {
      const suffix = Date.now();

      // 4. Send POST with requiredCommitmentPercentage: 1
      const res = await request.post(BASE, {
        data: {
          title: `Minimal Project ${suffix}`,
          requiredCommitmentPercentage: 1,
          requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.requiredCommitmentPercentage).toBe(1);
    });
  });

  // 1.2 Returns 400 when validation fails (FluentValidation)
  test.describe('Returns 400 when validation fails (FluentValidation)', () => {

    test('returns 400 when title is an empty string', async ({ request }) => {
      // 1. POST with empty string title
      const res = await request.post(BASE, {
        data: {
          title: '',
          requiredCommitmentPercentage: 50,
          requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('title');
    });

    test('returns 400 when title field is omitted', async ({ request }) => {
      // 2. POST with title field omitted
      const res = await request.post(BASE, {
        data: {
          requiredCommitmentPercentage: 50,
          requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('title');
    });

    test('returns 400 when title is whitespace-only', async ({ request }) => {
      // 3. POST with whitespace-only title
      const res = await request.post(BASE, {
        data: {
          title: '   ',
          requiredCommitmentPercentage: 50,
          requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('title');
    });

    test('returns 400 when commitment percentage is 0 (below minimum)', async ({ request }) => {
      // 4. POST with requiredCommitmentPercentage: 0
      const res = await request.post(BASE, {
        data: {
          title: 'Valid Title',
          requiredCommitmentPercentage: 0,
          requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('commitment');
    });

    test('returns 400 when commitment percentage is 101 (above maximum)', async ({ request }) => {
      // 5. POST with requiredCommitmentPercentage: 101
      const res = await request.post(BASE, {
        data: {
          title: 'Valid Title',
          requiredCommitmentPercentage: 101,
          requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('commitment');
    });

    test('returns 400 when requiredSkills is an empty array', async ({ request }) => {
      // 6. POST with requiredSkills: []
      const res = await request.post(BASE, {
        data: {
          title: 'Valid Title',
          requiredCommitmentPercentage: 50,
          requiredSkills: [],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('skill');
    });

    test('returns 400 when requiredSkills field is omitted', async ({ request }) => {
      // 7. POST with requiredSkills field omitted
      const res = await request.post(BASE, {
        data: {
          title: 'Valid Title',
          requiredCommitmentPercentage: 50,
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body);
      expect(bodyText.toLowerCase()).toContain('skill');
    });

    test('returns 400 with multiple errors when title, commitment, and skills are all invalid', async ({ request }) => {
      // 8. POST with all three fields simultaneously invalid
      const res = await request.post(BASE, {
        data: {
          title: '',
          requiredCommitmentPercentage: 0,
          requiredSkills: [],
        },
      });

      expect(res.status()).toBe(400);
      const body = await res.json();
      const bodyText = JSON.stringify(body).toLowerCase();
      expect(bodyText).toContain('title');
      expect(bodyText).toContain('commitment');
      expect(bodyText).toContain('skill');
    });
  });
});

// ---------------------------------------------------------------------------
// 2. GET /api/projectproposal/{id} — Get Proposal By ID
// ---------------------------------------------------------------------------
test.describe('GET /api/projectproposal/{id} — Get Proposal By ID', () => {

  // 2.1 Returns the full proposal including its skills list
  test('returns the full proposal including its skills list', async ({ request }) => {
    const suffix = Date.now();

    // 1. Create proposal with two required skills and capture the id
    const createRes = await request.post(BASE, {
      data: {
        title: `Retrieve Test Proposal ${suffix}`,
        description: 'Testing GET by ID',
        requiredCommitmentPercentage: 40,
        requiredSkills: [
          { skillId: 3, minimumProficiency: 'Expert' },
          { skillId: 4, minimumProficiency: 'Intermediate' },
        ],
      },
    });

    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const proposalId: number = createBody.id;
    expect(typeof proposalId).toBe('number');
    expect(proposalId).toBeGreaterThan(0);

    // 2. GET /api/projectproposal/{proposalId}
    const getRes = await request.get(`${BASE}/${proposalId}`);

    expect(getRes.status()).toBe(200);
    const body = await getRes.json();
    expect(typeof body).toBe('object');
    expect(body.id).toBe(proposalId);
    expect(body.title).toBe(`Retrieve Test Proposal ${suffix}`);
    expect(body.description).toBe('Testing GET by ID');
    expect(body.requiredCommitmentPercentage).toBe(40);
    expect(new Date(body.createdAt).toISOString()).toBeTruthy();
    expect(Array.isArray(body.requiredSkills)).toBe(true);
    expect(body.requiredSkills).toHaveLength(2);
    const skill3 = body.requiredSkills.find((s: { skillId: number }) => s.skillId === 3);
    const skill4 = body.requiredSkills.find((s: { skillId: number }) => s.skillId === 4);
    expect(skill3).toBeDefined();
    expect(skill3.minimumProficiency).toBe('Expert');
    expect(typeof skill3.skillName).toBe('string');
    expect(skill3.skillName.length).toBeGreaterThan(0);
    expect(skill4).toBeDefined();
    expect(skill4.minimumProficiency).toBe('Intermediate');
    expect(typeof skill4.skillName).toBe('string');
    expect(skill4.skillName.length).toBeGreaterThan(0);
  });

  test('returns null description and single skill for a no-description proposal', async ({ request }) => {
    const suffix = Date.now();

    // 3. POST with no description then GET by the new id
    const createRes = await request.post(BASE, {
      data: {
        title: `No Description Proposal ${suffix}`,
        requiredCommitmentPercentage: 25,
        requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
      },
    });

    const createBody = await createRes.json();
    const proposalId: number = createBody.id;

    const getRes = await request.get(`${BASE}/${proposalId}`);

    expect(getRes.status()).toBe(200);
    const body = await getRes.json();
    expect(body.description == null).toBe(true);
    expect(Array.isArray(body.requiredSkills)).toBe(true);
    expect(body.requiredSkills).toHaveLength(1);
  });

  // 2.2 Returns 404 for a non-existent proposal ID
  test.describe('Returns 404 for a non-existent proposal ID', () => {

    test('returns 404 for a very large non-existent ID', async ({ request }) => {
      // 1. GET /api/projectproposal/999999
      const res = await request.get(`${BASE}/999999`);

      expect(res.status()).toBe(404);
    });

    test('returns 404 or 400 for ID of zero', async ({ request }) => {
      // 2. GET /api/projectproposal/0
      const res = await request.get(`${BASE}/0`);

      expect([404, 400]).toContain(res.status());
    });

    test('returns 404 or 400 for a negative ID', async ({ request }) => {
      // 3. GET /api/projectproposal/-1
      const res = await request.get(`${BASE}/-1`);

      expect([404, 400]).toContain(res.status());
    });
  });
});

// ---------------------------------------------------------------------------
// 3. GET /api/projectproposal/{id}/assemble-team — Team Assembly
// ---------------------------------------------------------------------------
test.describe('GET /api/projectproposal/{id}/assemble-team — Team Assembly', () => {

  // 3.1 Returns a SuggestedTeamDto with suggestedMembers array
  test('returns a SuggestedTeamDto with correct shape', async ({ request }) => {
    const suffix = Date.now();

    // 1. POST Angular proposal and capture id
    const createRes = await request.post(BASE, {
      data: {
        title: `Angular Project ${suffix}`,
        requiredCommitmentPercentage: 30,
        requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
      },
    });

    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const proposalId: number = createBody.id;
    expect(typeof proposalId).toBe('number');

    // 2. GET assemble-team
    const res = await request.get(`${BASE}/${proposalId}/assemble-team`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body).toBe('object');
    expect(body.projectProposalId).toBe(proposalId);
    expect(body.projectTitle).toBe(`Angular Project ${suffix}`);
    expect(Array.isArray(body.suggestedMembers)).toBe(true);
    expect(typeof body.totalCandidates).toBe('number');
    expect(body.totalCandidates).toBeGreaterThanOrEqual(0);
    expect(body.totalCandidates).toBe(body.suggestedMembers.length);
    for (const member of body.suggestedMembers) {
      expect(typeof member.employeeId).toBe('number');
      expect(typeof member.fullName).toBe('string');
      expect(typeof member.email).toBe('string');
      expect(typeof member.availableCapacity).toBe('number');
      expect(Array.isArray(member.matchedSkills)).toBe(true);
      for (const skill of member.matchedSkills) {
        expect(typeof skill.skillId).toBe('number');
        expect(typeof skill.skillName).toBe('string');
        expect(typeof skill.proficiencyLevel).toBe('string');
      }
    }
  });

  // 3.2 Suggests correct candidates for a .NET + PostgreSQL proposal
  test('suggests Bruno and Clara for a .NET Intermediate + PostgreSQL Intermediate, 30% commitment proposal', async ({ request }) => {
    const suffix = Date.now();

    // 1. POST Backend API Project proposal and capture id
    const createRes = await request.post(BASE, {
      data: {
        title: `Backend API Project ${suffix}`,
        requiredCommitmentPercentage: 30,
        requiredSkills: [
          { skillId: 2, minimumProficiency: 'Intermediate' },
          { skillId: 3, minimumProficiency: 'Intermediate' },
        ],
      },
    });

    expect(createRes.status()).toBe(201);
    const proposalId: number = (await createRes.json()).id;

    // 2. GET assemble-team and verify Bruno and Clara are candidates
    const res = await request.get(`${BASE}/${proposalId}/assemble-team`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.totalCandidates).toBe(2);
    expect(body.suggestedMembers).toHaveLength(2);

    const bruno = body.suggestedMembers.find((m: { email: string }) => m.email === 'bruno.martins@skillweaver.dev');
    const clara = body.suggestedMembers.find((m: { email: string }) => m.email === 'clara.nkosi@skillweaver.dev');

    expect(bruno).toBeDefined();
    expect(bruno.availableCapacity).toBe(40);
    expect(clara).toBeDefined();
    expect(clara.availableCapacity).toBe(100);

    const alice = body.suggestedMembers.find((m: { email: string }) => m.email === 'alice.chen@skillweaver.dev');
    const david = body.suggestedMembers.find((m: { email: string }) => m.email === 'david.park@skillweaver.dev');
    expect(alice).toBeUndefined();
    expect(david).toBeUndefined();

    const brunoSkillIds = bruno.matchedSkills.map((s: { skillId: number }) => s.skillId);
    expect(brunoSkillIds).toContain(2);
    expect(brunoSkillIds).toContain(3);

    const claraSkillIds = clara.matchedSkills.map((s: { skillId: number }) => s.skillId);
    expect(claraSkillIds).toContain(2);
    expect(claraSkillIds).toContain(3);
  });

  // 3.3 Excludes candidates with insufficient available capacity
  test('excludes Bruno (40% free) when 50% commitment is required, includes Clara (100% free)', async ({ request }) => {
    const suffix = Date.now();

    // 1. POST High Commitment Project requiring 50% and capture id
    const createRes = await request.post(BASE, {
      data: {
        title: `High Commitment Project ${suffix}`,
        requiredCommitmentPercentage: 50,
        requiredSkills: [
          { skillId: 2, minimumProficiency: 'Intermediate' },
          { skillId: 3, minimumProficiency: 'Intermediate' },
        ],
      },
    });

    expect(createRes.status()).toBe(201);
    const proposalId: number = (await createRes.json()).id;

    // 2. GET assemble-team and verify only Clara is included
    const res = await request.get(`${BASE}/${proposalId}/assemble-team`);

    expect(res.status()).toBe(200);
    const body = await res.json();

    const bruno = body.suggestedMembers.find((m: { email: string }) => m.email === 'bruno.martins@skillweaver.dev');
    const clara = body.suggestedMembers.find((m: { email: string }) => m.email === 'clara.nkosi@skillweaver.dev');

    expect(bruno).toBeUndefined();
    expect(clara).toBeDefined();
    expect(body.totalCandidates).toBe(1);
    expect(body.suggestedMembers).toHaveLength(1);
    expect(clara.availableCapacity).toBe(100);
  });

  // 3.4 Returns empty suggestedMembers when no candidate meets all requirements
  test('returns empty suggestedMembers when requirements are impossible to satisfy', async ({ request }) => {
    const suffix = Date.now();

    // 1. POST Impossible Project (.NET Expert + PostgreSQL Expert + 90% free) and capture id
    const createRes = await request.post(BASE, {
      data: {
        title: `Impossible Project ${suffix}`,
        requiredCommitmentPercentage: 90,
        requiredSkills: [
          { skillId: 2, minimumProficiency: 'Expert' },
          { skillId: 3, minimumProficiency: 'Expert' },
        ],
      },
    });

    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const proposalId: number = createBody.id;

    // 2. GET assemble-team and verify empty results
    const res = await request.get(`${BASE}/${proposalId}/assemble-team`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.suggestedMembers).toEqual([]);
    expect(body.totalCandidates).toBe(0);
    expect(body.projectProposalId).toBe(proposalId);
    expect(body.projectTitle).toBe(`Impossible Project ${suffix}`);
  });

  // 3.5 Respects minimum proficiency threshold
  test('includes Alice (Angular Expert) and excludes David (Angular Beginner) when Expert is required', async ({ request }) => {
    const suffix = Date.now();

    // 1. POST Expert Angular Project and capture id
    const createRes = await request.post(BASE, {
      data: {
        title: `Expert Angular Project ${suffix}`,
        requiredCommitmentPercentage: 10,
        requiredSkills: [{ skillId: 1, minimumProficiency: 'Expert' }],
      },
    });

    expect(createRes.status()).toBe(201);
    const proposalId: number = (await createRes.json()).id;

    // 2. GET assemble-team and verify proficiency filtering
    const res = await request.get(`${BASE}/${proposalId}/assemble-team`);

    expect(res.status()).toBe(200);
    const body = await res.json();

    const alice = body.suggestedMembers.find((m: { email: string }) => m.email === 'alice.chen@skillweaver.dev');
    const david = body.suggestedMembers.find((m: { email: string }) => m.email === 'david.park@skillweaver.dev');

    expect(alice).toBeDefined();
    expect(david).toBeUndefined();
    expect(body.totalCandidates).toBe(1);
  });

  // 3.6 Returns 404 when assembling a team for a non-existent proposal
  test('returns 404 when assembling a team for a non-existent proposal', async ({ request }) => {
    // 1. GET assemble-team for non-existent proposal ID
    const res = await request.get(`${BASE}/999999/assemble-team`);

    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// 4. GET /api/projectproposal — Get All Proposals
// ---------------------------------------------------------------------------
test.describe('GET /api/projectproposal — Get All Proposals', () => {

  // 4.1 Returns an array of all proposals
  test('returns an array containing all created proposals', async ({ request }) => {
    const suffix = Date.now();

    // 1. POST two proposals and store both ids
    const resA = await request.post(BASE, {
      data: {
        title: `List Test A ${suffix}`,
        requiredCommitmentPercentage: 20,
        requiredSkills: [{ skillId: 1, minimumProficiency: 'Beginner' }],
      },
    });
    const resB = await request.post(BASE, {
      data: {
        title: `List Test B ${suffix}`,
        requiredCommitmentPercentage: 20,
        requiredSkills: [{ skillId: 2, minimumProficiency: 'Beginner' }],
      },
    });

    expect(resA.status()).toBe(201);
    expect(resB.status()).toBe(201);
    const idA: number = (await resA.json()).id;
    const idB: number = (await resB.json()).id;

    // 2. GET /api/projectproposal and verify the array
    const res = await request.get(BASE);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);

    const foundA = body.find((p: { id: number }) => p.id === idA);
    const foundB = body.find((p: { id: number }) => p.id === idB);
    expect(foundA).toBeDefined();
    expect(foundB).toBeDefined();

    // Verify each proposal has the required fields
    for (const proposal of body) {
      expect(typeof proposal.id).toBe('number');
      expect(typeof proposal.title).toBe('string');
      expect(typeof proposal.requiredCommitmentPercentage).toBe('number');
      expect(typeof proposal.createdAt).toBe('string');
      expect(Array.isArray(proposal.requiredSkills)).toBe(true);
    }

    const titleA = body.find((p: { title: string }) => p.title === `List Test A ${suffix}`);
    const titleB = body.find((p: { title: string }) => p.title === `List Test B ${suffix}`);
    expect(titleA).toBeDefined();
    expect(titleB).toBeDefined();
  });
});
