# SkillWeaver Project Proposals API Test Plan

## Application Overview

SkillWeaver is a team assembly tool that matches employees to project requirements based on skills and capacity. This test plan covers the Project Proposals API at http://localhost:5047/api/projectproposal. The API exposes endpoints to create project proposals (with required skills), retrieve proposals by ID, and assemble a suggested team for a proposal using the TeamAssemblyService algorithm. The database is seeded with 4 employees (Alice Chen, Bruno Martins, Clara Nkosi, David Park) and 6 skills (Angular, .NET, PostgreSQL, System Design, React, Docker). FluentValidation enforces that title must not be empty, requiredCommitmentPercentage must be 1-100, and requiredSkills must have at least one item. ProficiencyLevel is an ordered enum: Beginner=1, Intermediate=2, Expert=3. The team assembly algorithm requires an employee to satisfy ALL required skills at or above the minimum proficiency threshold AND have enough free capacity (100 - capacityPercentage >= requiredCommitmentPercentage).

## Test Scenarios

### 1. POST /api/projectproposal — Create Proposal

**Seed:** `tests/seed.spec.ts`

#### 1.1. Creates a proposal with required skills and returns 201

**File:** `tests/api/proposals/create-proposal.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with Content-Type: application/json and body: { "title": "Alpha Backend Service", "description": "New microservice project", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": 2, "minimumProficiency": "Intermediate" }] } (skillId 2 corresponds to .NET in the seed data)
    - expect: Response status is 201 Created
    - expect: Response body is JSON
    - expect: Response body contains an "id" field that is a positive integer
    - expect: Response body "title" equals "Alpha Backend Service"
    - expect: Response body "description" equals "New microservice project"
    - expect: Response body "requiredCommitmentPercentage" equals 50
    - expect: Response body "createdAt" is a valid ISO 8601 datetime string
    - expect: Response body "requiredSkills" is an array with exactly one element
    - expect: The single requiredSkill element has "skillId" equal to 2
    - expect: The single requiredSkill element has "minimumProficiency" equal to "Intermediate"
    - expect: The single requiredSkill element has a "skillName" string (e.g. ".NET")
    - expect: Response Location header points to /api/projectproposal/{id}
  2. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Full Stack Platform", "requiredCommitmentPercentage": 30, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Expert" }, { "skillId": 2, "minimumProficiency": "Beginner" }] } (two required skills, no description)
    - expect: Response status is 201 Created
    - expect: Response body "title" equals "Full Stack Platform"
    - expect: Response body "description" is null or absent
    - expect: Response body "requiredSkills" array has exactly 2 elements
    - expect: First requiredSkill has "skillId" 1 and "minimumProficiency" "Expert"
    - expect: Second requiredSkill has "skillId" 2 and "minimumProficiency" "Beginner"
    - expect: Each requiredSkill element contains a non-empty "skillName" string
  3. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Infra Upgrade", "requiredCommitmentPercentage": 100, "requiredSkills": [{ "skillId": 6, "minimumProficiency": "Beginner" }] } (maximum commitment percentage of 100)
    - expect: Response status is 201 Created
    - expect: Response body "requiredCommitmentPercentage" equals 100
  4. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Minimal Project", "requiredCommitmentPercentage": 1, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (minimum commitment percentage of 1)
    - expect: Response status is 201 Created
    - expect: Response body "requiredCommitmentPercentage" equals 1

#### 1.2. Returns 400 when title is empty (FluentValidation)

**File:** `tests/api/proposals/create-proposal-validation.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (empty string title)
    - expect: Response status is 400 Bad Request
    - expect: Response body is a JSON problem details object
    - expect: Response body contains an "errors" object or "title" field describing validation failures
    - expect: The validation error references the "Title" field with message "Title is required."
  2. Send POST http://localhost:5047/api/projectproposal with body: { "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (title field omitted entirely)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains a validation error indicating title is required
  3. Send POST http://localhost:5047/api/projectproposal with body: { "title": "   ", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (whitespace-only title)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains a validation error for the Title field
  4. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Valid Title", "requiredCommitmentPercentage": 0, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (commitment percentage of 0, below the minimum of 1)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains a validation error for "RequiredCommitmentPercentage" with message "Commitment percentage must be between 1 and 100."
  5. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Valid Title", "requiredCommitmentPercentage": 101, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (commitment percentage of 101, above the maximum of 100)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains a validation error for "RequiredCommitmentPercentage" with message "Commitment percentage must be between 1 and 100."
  6. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Valid Title", "requiredCommitmentPercentage": 50, "requiredSkills": [] } (requiredSkills is an empty array)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains a validation error for "RequiredSkills" with message "At least one required skill must be specified."
  7. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Valid Title", "requiredCommitmentPercentage": 50 } (requiredSkills field is omitted entirely)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains a validation error for the RequiredSkills field
  8. Send POST http://localhost:5047/api/projectproposal with body: { "title": "", "requiredCommitmentPercentage": 0, "requiredSkills": [] } (all three fields simultaneously invalid)
    - expect: Response status is 400 Bad Request
    - expect: Response body contains multiple validation errors — one for Title, one for RequiredCommitmentPercentage, and one for RequiredSkills

### 2. GET /api/projectproposal/{id} — Get Proposal By ID

**Seed:** `tests/seed.spec.ts`

#### 2.1. Returns the full proposal including its skills list

**File:** `tests/api/proposals/get-proposal-by-id.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Retrieve Test Proposal", "description": "Testing GET by ID", "requiredCommitmentPercentage": 40, "requiredSkills": [{ "skillId": 3, "minimumProficiency": "Expert" }, { "skillId": 4, "minimumProficiency": "Intermediate" }] } and capture the "id" from the 201 response body (skillId 3 = PostgreSQL, skillId 4 = System Design)
    - expect: Response status is 201 Created
    - expect: Response body contains an "id" field — store this as {proposalId}
  2. Send GET http://localhost:5047/api/projectproposal/{proposalId} using the id captured in the previous step
    - expect: Response status is 200 OK
    - expect: Response body is a JSON object
    - expect: Response body "id" equals {proposalId}
    - expect: Response body "title" equals "Retrieve Test Proposal"
    - expect: Response body "description" equals "Testing GET by ID"
    - expect: Response body "requiredCommitmentPercentage" equals 40
    - expect: Response body "createdAt" is a valid ISO 8601 datetime string
    - expect: Response body "requiredSkills" is an array with exactly 2 elements
    - expect: One requiredSkill has "skillId" 3 and "minimumProficiency" "Expert" and a non-empty "skillName"
    - expect: One requiredSkill has "skillId" 4 and "minimumProficiency" "Intermediate" and a non-empty "skillName"
  3. Send POST http://localhost:5047/api/projectproposal with body: { "title": "No Description Proposal", "requiredCommitmentPercentage": 25, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } (no description field), then GET /api/projectproposal/{new id}
    - expect: GET response status is 200 OK
    - expect: Response body "description" is null or absent
    - expect: Response body "requiredSkills" is an array with exactly 1 element

#### 2.2. Returns 404 for a non-existent proposal ID

**File:** `tests/api/proposals/get-proposal-not-found.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/projectproposal/999999 (an ID that does not exist in the database)
    - expect: Response status is 404 Not Found
  2. Send GET http://localhost:5047/api/projectproposal/0 (ID of zero, which is never a valid database ID)
    - expect: Response status is 404 Not Found or 400 Bad Request
  3. Send GET http://localhost:5047/api/projectproposal/-1 (a negative ID)
    - expect: Response status is 404 Not Found or 400 Bad Request

### 3. GET /api/projectproposal/{id}/assemble-team — Team Assembly

**Seed:** `tests/seed.spec.ts`

#### 3.1. Returns a SuggestedTeamDto with suggestedMembers array

**File:** `tests/api/proposals/assemble-team-shape.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Angular Project", "requiredCommitmentPercentage": 30, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } and capture the "id" (skillId 1 = Angular)
    - expect: Response status is 201 Created
    - expect: Response body contains an "id" field — store as {proposalId}
  2. Send GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team
    - expect: Response status is 200 OK
    - expect: Response body is a JSON object
    - expect: Response body contains field "projectProposalId" equal to {proposalId}
    - expect: Response body contains field "projectTitle" equal to "Angular Project"
    - expect: Response body contains field "suggestedMembers" which is an array
    - expect: Response body contains field "totalCandidates" which is a non-negative integer
    - expect: "totalCandidates" equals the length of the "suggestedMembers" array
    - expect: Each element in "suggestedMembers" contains: "employeeId" (integer), "fullName" (string), "email" (string), "availableCapacity" (integer), and "matchedSkills" (array)
    - expect: Each element in "matchedSkills" contains: "skillId" (integer), "skillName" (string), and "proficiencyLevel" (string)

#### 3.2. Suggests correct candidates for a .NET + PostgreSQL proposal (capacity and skill match)

**File:** `tests/api/proposals/assemble-team-candidates.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Backend API Project", "requiredCommitmentPercentage": 30, "requiredSkills": [{ "skillId": 2, "minimumProficiency": "Intermediate" }, { "skillId": 3, "minimumProficiency": "Intermediate" }] } (skillId 2 = .NET at Intermediate+, skillId 3 = PostgreSQL at Intermediate+) and capture the id
    - expect: Response status is 201 Created
    - expect: Store the id as {proposalId}
  2. Send GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team and inspect the suggestedMembers list. Seed data: Bruno (60% used = 40% free, .NET Expert + PostgreSQL Expert + Docker Intermediate) and Clara (0% used = 100% free, System Design Expert + .NET Intermediate + PostgreSQL Intermediate). Both have .NET >= Intermediate and PostgreSQL >= Intermediate. Both have 40% or 100% free capacity which is >= 30% required.
    - expect: Response status is 200 OK
    - expect: "totalCandidates" equals 2
    - expect: "suggestedMembers" array has exactly 2 elements
    - expect: One member has email "bruno.martins@skillweaver.dev" with "availableCapacity" 40
    - expect: One member has email "clara.nkosi@skillweaver.dev" with "availableCapacity" 100
    - expect: Alice (angular.com, .NET Intermediate only — no PostgreSQL) is NOT in the results
    - expect: David (react + angular Beginner only — no .NET or PostgreSQL) is NOT in the results
    - expect: Bruno's "matchedSkills" contains entries for skillId 2 (.NET) and skillId 3 (PostgreSQL)
    - expect: Clara's "matchedSkills" contains entries for skillId 2 (.NET) and skillId 3 (PostgreSQL)

#### 3.3. Excludes candidates with insufficient available capacity

**File:** `tests/api/proposals/assemble-team-capacity.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "High Commitment Project", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": 2, "minimumProficiency": "Intermediate" }, { "skillId": 3, "minimumProficiency": "Intermediate" }] } (50% commitment required; Bruno has only 40% free capacity). Capture the id.
    - expect: Response status is 201 Created
  2. Send GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team
    - expect: Response status is 200 OK
    - expect: Bruno (40% free) is excluded because 40 < 50
    - expect: Clara (100% free) is included because 100 >= 50
    - expect: "totalCandidates" equals 1
    - expect: "suggestedMembers" contains only Clara's entry
    - expect: Clara's "availableCapacity" is 100

#### 3.4. Returns empty suggestedMembers when no candidate meets all requirements

**File:** `tests/api/proposals/assemble-team-no-candidates.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Impossible Project", "requiredCommitmentPercentage": 90, "requiredSkills": [{ "skillId": 2, "minimumProficiency": "Expert" }, { "skillId": 3, "minimumProficiency": "Expert" }] } (.NET Expert AND PostgreSQL Expert AND 90% free capacity). Seed data: no single employee has all three conditions — Bruno has Expert for both but only 40% free; Clara has Intermediate for both, not Expert. Capture the id.
    - expect: Response status is 201 Created
  2. Send GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team
    - expect: Response status is 200 OK
    - expect: "suggestedMembers" is an empty array
    - expect: "totalCandidates" equals 0
    - expect: "projectProposalId" still equals the created proposal id
    - expect: "projectTitle" still equals "Impossible Project"

#### 3.5. Respects minimum proficiency threshold — Beginner does not satisfy Expert requirement

**File:** `tests/api/proposals/assemble-team-proficiency-filter.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal with body: { "title": "Expert Angular Project", "requiredCommitmentPercentage": 10, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Expert" }] } (Angular at Expert level required). Seed data: Alice has Angular Expert; David has Angular Beginner. Capture the id.
    - expect: Response status is 201 Created
  2. Send GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team
    - expect: Response status is 200 OK
    - expect: Alice (Angular Expert, 80% free) is in suggestedMembers
    - expect: David (Angular Beginner, 20% free) is NOT in suggestedMembers because Beginner < Expert
    - expect: "totalCandidates" equals 1

#### 3.6. Returns 404 when assembling a team for a non-existent proposal

**File:** `tests/api/proposals/assemble-team-not-found.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/projectproposal/999999/assemble-team (an ID that does not exist)
    - expect: Response status is 404 Not Found

### 4. GET /api/projectproposal — Get All Proposals

**Seed:** `tests/seed.spec.ts`

#### 4.1. Returns an array of all proposals

**File:** `tests/api/proposals/get-all-proposals.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/projectproposal twice with bodies: (1) { "title": "List Test A", "requiredCommitmentPercentage": 20, "requiredSkills": [{ "skillId": 1, "minimumProficiency": "Beginner" }] } and (2) { "title": "List Test B", "requiredCommitmentPercentage": 20, "requiredSkills": [{ "skillId": 2, "minimumProficiency": "Beginner" }] } and store both returned ids
    - expect: Both POST requests return 201 Created
  2. Send GET http://localhost:5047/api/projectproposal
    - expect: Response status is 200 OK
    - expect: Response body is a JSON array
    - expect: The array contains at least the two proposals created above
    - expect: Each proposal in the array has fields: "id", "title", "requiredCommitmentPercentage", "createdAt", and "requiredSkills"
    - expect: The proposal with title "List Test A" is present in the array
    - expect: The proposal with title "List Test B" is present in the array
