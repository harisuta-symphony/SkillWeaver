# SkillWeaver Team Assembly Integration Test Plan

## Application Overview

Integration tests for the SkillWeaver Team Assembly algorithm exposed at GET /api/projectproposal/{id}/assemble-team. The algorithm filters employees in two sequential passes: first it discards any employee who does not hold ALL required skills at or above the minimum ProficiencyLevel enum value (Beginner=1, Intermediate=2, Expert=3); then it discards any employee whose available capacity (100 - capacityPercentage) is less than the proposal's requiredCommitmentPercentage. Each test creates its own isolated skill, employee, and proposal via POST requests so that tests are fully independent and do not rely on seeded data. The base URL is http://localhost:5047. Key naming conventions confirmed from the source: employee creation uses firstName/lastName/email/department/capacityPercentage; skill assignment uses POST /api/employee/{id}/skills with body { skillId, proficiency }; proposal creation uses requiredCommitmentPercentage and requiredSkills[].minimumProficiency; the assemble-team response shape is { projectProposalId, projectTitle, suggestedMembers: [{ employeeId, fullName, email, department, availableCapacity, matchedSkills }], totalCandidates }.

## Test Scenarios

### 1. Team Assembly — Core Algorithm Scenarios

**Seed:** `e2e-tests/tests/seed.spec.ts`

#### 1.1. Scenario 1 — Qualified employee appears in suggestedMembers

**File:** `e2e-tests/tests/api/team-assembly.spec.ts`

**Steps:**
  1. POST http://localhost:5047/api/skill with body { "name": "Rust_QualifiedTest_{timestamp}", "category": "Backend" } and capture the returned id as skillId. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body name matches the sent name
  2. POST http://localhost:5047/api/employee with body { "firstName": "Qualified", "lastName": "Tester", "email": "qualified.tester+{timestamp}@skillweaver.dev", "department": "Engineering", "capacityPercentage": 20 } and capture the returned id as employeeId. capacityPercentage of 20 means availableCapacity is 80. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body availableCapacity equals 80
  3. POST http://localhost:5047/api/employee/{employeeId}/skills with body { "skillId": {skillId}, "proficiency": "Intermediate" } to assign the skill at Intermediate proficiency. Expect HTTP 200.
    - expect: Response status is 200
  4. POST http://localhost:5047/api/projectproposal with body { "title": "QualifiedProject_{timestamp}", "description": "Scenario 1 test", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": {skillId}, "minimumProficiency": "Intermediate" }] } and capture the returned id as proposalId. The required commitment (50%) is less than or equal to the employee's available capacity (80%), so the employee qualifies on both checks. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body requiredCommitmentPercentage is 50
  5. GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team and inspect the response body.
    - expect: Response status is 200
    - expect: Response body is a JSON object
    - expect: Response body projectProposalId equals proposalId
    - expect: Response body projectTitle equals "QualifiedProject_{timestamp}"
    - expect: Response body suggestedMembers is an array
    - expect: Response body suggestedMembers contains exactly one entry whose email equals "qualified.tester+{timestamp}@skillweaver.dev"
    - expect: That member's employeeId equals employeeId
    - expect: That member's availableCapacity equals 80
    - expect: That member's matchedSkills array contains one entry with skillId equal to {skillId} and proficiencyLevel equal to "Intermediate"
    - expect: Response body totalCandidates equals 1

#### 1.2. Scenario 2 — Overbooked employee is excluded from suggestedMembers

**File:** `e2e-tests/tests/api/team-assembly.spec.ts`

**Steps:**
  1. POST http://localhost:5047/api/skill with body { "name": "Go_OverbookedTest_{timestamp}", "category": "Backend" } and capture the returned id as skillId. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
  2. POST http://localhost:5047/api/employee with body { "firstName": "Overbooked", "lastName": "Tester", "email": "overbooked.tester+{timestamp}@skillweaver.dev", "department": "Engineering", "capacityPercentage": 70 } and capture the returned id as employeeId. capacityPercentage of 70 means availableCapacity is 30. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body availableCapacity equals 30
  3. POST http://localhost:5047/api/employee/{employeeId}/skills with body { "skillId": {skillId}, "proficiency": "Expert" } to assign the skill at Expert proficiency so the employee passes the skill check. Expect HTTP 200.
    - expect: Response status is 200
  4. POST http://localhost:5047/api/projectproposal with body { "title": "OverbookedProject_{timestamp}", "description": "Scenario 2 test", "requiredCommitmentPercentage": 50, "requiredSkills": [{ "skillId": {skillId}, "minimumProficiency": "Beginner" }] } and capture the returned id as proposalId. The required commitment (50%) is greater than the employee's available capacity (30%), so the employee fails the capacity check despite having the required skill. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body requiredCommitmentPercentage is 50
  5. GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team and inspect the response body.
    - expect: Response status is 200
    - expect: Response body is a JSON object
    - expect: Response body projectProposalId equals proposalId
    - expect: Response body suggestedMembers is an array
    - expect: Response body suggestedMembers does NOT contain any entry whose email equals "overbooked.tester+{timestamp}@skillweaver.dev"
    - expect: Response body totalCandidates does NOT include the overbooked employee (the employee with email overbooked.tester+{timestamp}@skillweaver.dev must be absent)

#### 1.3. Scenario 3 — Below-threshold proficiency employee is excluded from suggestedMembers

**File:** `e2e-tests/tests/api/team-assembly.spec.ts`

**Steps:**
  1. POST http://localhost:5047/api/skill with body { "name": "Kotlin_ProficiencyTest_{timestamp}", "category": "Backend" } and capture the returned id as skillId. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
  2. POST http://localhost:5047/api/employee with body { "firstName": "Undertrained", "lastName": "Tester", "email": "undertrained.tester+{timestamp}@skillweaver.dev", "department": "Engineering", "capacityPercentage": 0 } and capture the returned id as employeeId. capacityPercentage of 0 means availableCapacity is 100, so the employee has more than enough capacity and will not be excluded on capacity grounds. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body availableCapacity equals 100
  3. POST http://localhost:5047/api/employee/{employeeId}/skills with body { "skillId": {skillId}, "proficiency": "Beginner" } to assign the skill at Beginner proficiency. Expect HTTP 200.
    - expect: Response status is 200
  4. POST http://localhost:5047/api/projectproposal with body { "title": "ProficiencyGateProject_{timestamp}", "description": "Scenario 3 test", "requiredCommitmentPercentage": 10, "requiredSkills": [{ "skillId": {skillId}, "minimumProficiency": "Expert" }] } and capture the returned id as proposalId. The minimum proficiency required is Expert (enum value 3), but the employee only holds Beginner (enum value 1). The algorithm evaluates empSkill.ProficiencyLevel >= required.MinimumProficiency, which fails (1 >= 3 is false), so the employee is excluded. The required commitment (10%) is well below available capacity (100%), confirming the only exclusion reason is insufficient proficiency. Expect HTTP 201.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body requiredCommitmentPercentage is 10
  5. GET http://localhost:5047/api/projectproposal/{proposalId}/assemble-team and inspect the response body.
    - expect: Response status is 200
    - expect: Response body is a JSON object
    - expect: Response body projectProposalId equals proposalId
    - expect: Response body suggestedMembers is an array
    - expect: Response body suggestedMembers does NOT contain any entry whose email equals "undertrained.tester+{timestamp}@skillweaver.dev"
    - expect: Response body totalCandidates does NOT include the below-threshold employee (the employee with email undertrained.tester+{timestamp}@skillweaver.dev must be absent)
