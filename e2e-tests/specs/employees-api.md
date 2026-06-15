# SkillWeaver Employees API Test Plan

## Application Overview

SkillWeaver is a team assembly tool that matches employees to project requirements based on skills and capacity. This test plan covers the Employees API at http://localhost:5047/api/employee. The API exposes five operations: GET /api/employee (list all employees), POST /api/employee (create an employee), GET /api/employee/{id} (fetch a single employee by integer ID), PATCH /api/employee/{id}/capacity (update capacity percentage), and POST /api/employee/{id}/skills (assign a skill to an employee). Employees have the shape { id: number, firstName: string, lastName: string, email: string, department?: string, capacityPercentage: number, availableCapacity: number, skills: EmployeeSkill[] } where EmployeeSkill is { skillId: number, skillName: string, proficiencyLevel: string }. The database is pre-seeded on startup with 4 employees: Alice Chen (Engineering, 20% capacity, Angular Expert + .NET Intermediate), Bruno Martins (Engineering, 60% capacity, .NET Expert + PostgreSQL Expert + Docker Intermediate), Clara Nkosi (Architecture, 0% capacity, System Design Expert + .NET Intermediate + PostgreSQL Intermediate), and David Park (Frontend, 80% capacity, React Expert + Angular Beginner). Six skills are seeded: Angular, .NET, PostgreSQL, System Design, React, Docker. Proficiency values are: Beginner, Intermediate, Expert. The environment health check at GET http://localhost:5047/health must return 200 with { status: "ok" } before any employee test is run (verified by the seed test at e2e-tests/tests/seed.spec.ts).

## Test Scenarios

### 1. Employees API

**Seed:** `e2e-tests/tests/seed.spec.ts`

#### 1.1. GET /api/employee returns 200 with a non-empty array of employees

**File:** `e2e-tests/tests/api/employees-get-all.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee with no request body or query parameters
    - expect: The HTTP response status code is 200
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a JSON array
    - expect: The array contains at least 4 items (the seeded employees)
  2. Inspect each item in the response array for required fields
    - expect: Each item has a numeric id field greater than 0
    - expect: Each item has a non-empty string firstName field
    - expect: Each item has a non-empty string lastName field
    - expect: Each item has a non-empty string email field
    - expect: Each item has a numeric capacityPercentage field with a value between 0 and 100 inclusive
    - expect: Each item has a numeric availableCapacity field equal to 100 minus capacityPercentage
    - expect: Each item has a skills field that is an array (possibly empty)
  3. Verify the four seeded employees are present in the response array by checking firstName + lastName combinations
    - expect: An employee with firstName 'Alice' and lastName 'Chen' is present with department 'Engineering' and capacityPercentage 20
    - expect: An employee with firstName 'Bruno' and lastName 'Martins' is present with department 'Engineering' and capacityPercentage 60
    - expect: An employee with firstName 'Clara' and lastName 'Nkosi' is present with department 'Architecture' and capacityPercentage 0
    - expect: An employee with firstName 'David' and lastName 'Park' is present with department 'Frontend' and capacityPercentage 80
  4. Inspect the skills arrays of the seeded employees
    - expect: Alice Chen's skills array contains an entry with skillName 'Angular' and proficiencyLevel 'Expert'
    - expect: Alice Chen's skills array contains an entry with skillName '.NET' and proficiencyLevel 'Intermediate'
    - expect: Bruno Martins's skills array contains entries for '.NET' (Expert), 'PostgreSQL' (Expert), and 'Docker' (Intermediate)
    - expect: Clara Nkosi's skills array contains entries for 'System Design' (Expert), '.NET' (Intermediate), and 'PostgreSQL' (Intermediate)
    - expect: David Park's skills array contains entries for 'React' (Expert) and 'Angular' (Beginner)
    - expect: Each skill entry has a positive integer skillId, a non-empty string skillName, and a non-empty string proficiencyLevel

#### 1.2. POST /api/employee creates a new employee and returns 201 with the created resource

**File:** `e2e-tests/tests/api/employees-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/employee with Content-Type: application/json and body { "firstName": "Eva", "lastName": "Rodriguez", "email": "eva.rodriguez@skillweaver.dev", "department": "QA", "capacityPercentage": 30 }
    - expect: The HTTP response status code is 201
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a JSON object
    - expect: The response body has an id field that is a positive integer
    - expect: The response body firstName is 'Eva'
    - expect: The response body lastName is 'Rodriguez'
    - expect: The response body email is 'eva.rodriguez@skillweaver.dev'
    - expect: The response body department is 'QA'
    - expect: The response body capacityPercentage is 30
    - expect: The response body availableCapacity is 70
    - expect: The response body skills is an empty array
    - expect: The Location response header is present and contains /api/employee/{id} where {id} matches the returned id
  2. Record the id returned in the 201 response. Send GET http://localhost:5047/api/employee to fetch all employees
    - expect: The response status is 200
    - expect: The newly created employee with firstName 'Eva' and email 'eva.rodriguez@skillweaver.dev' is present in the returned array
    - expect: The array now contains at least 5 items (4 seeded + 1 created)

#### 1.3. POST /api/employee creates an employee without the optional department field

**File:** `e2e-tests/tests/api/employees-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/employee with Content-Type: application/json and body { "firstName": "Frank", "lastName": "Osei", "email": "frank.osei@skillweaver.dev", "capacityPercentage": 0 } (department field omitted)
    - expect: The HTTP response status code is 201
    - expect: The response body has a positive integer id
    - expect: The response body firstName is 'Frank'
    - expect: The response body lastName is 'Osei'
    - expect: The response body email is 'frank.osei@skillweaver.dev'
    - expect: The response body department field is null or absent
    - expect: The response body capacityPercentage is 0
    - expect: The response body availableCapacity is 100

#### 1.4. GET /api/employee/{id} returns the correct employee for a seeded ID

**File:** `e2e-tests/tests/api/employees-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee to retrieve all employees, and record the id of the employee whose email is 'alice.chen@skillweaver.dev'
    - expect: The response status is 200 and Alice Chen is present in the array with a valid positive integer id
  2. Send GET http://localhost:5047/api/employee/{id} using Alice Chen's id obtained in the previous step
    - expect: The HTTP response status code is 200
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a single JSON object (not an array)
    - expect: The response body id matches the id used in the request
    - expect: The response body firstName is 'Alice'
    - expect: The response body lastName is 'Chen'
    - expect: The response body email is 'alice.chen@skillweaver.dev'
    - expect: The response body department is 'Engineering'
    - expect: The response body capacityPercentage is 20
    - expect: The response body availableCapacity is 80
    - expect: The response body skills is an array containing exactly 2 entries: Angular (Expert) and .NET (Intermediate)

#### 1.5. GET /api/employee/{id} returns the correct employee after a POST

**File:** `e2e-tests/tests/api/employees-get-by-id.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/employee with body { "firstName": "Grace", "lastName": "Kim", "email": "grace.kim@skillweaver.dev", "department": "DevOps", "capacityPercentage": 50 } and record the id from the 201 response
    - expect: Status 201 is returned
    - expect: The id in the response body is a positive integer
  2. Send GET http://localhost:5047/api/employee/{id} using the id returned in the previous step
    - expect: The HTTP response status code is 200
    - expect: The response body id matches the id from the POST response
    - expect: The response body firstName is 'Grace'
    - expect: The response body lastName is 'Kim'
    - expect: The response body email is 'grace.kim@skillweaver.dev'
    - expect: The response body department is 'DevOps'
    - expect: The response body capacityPercentage is 50
    - expect: The response body availableCapacity is 50
    - expect: The response body skills is an empty array

#### 1.6. GET /api/employee/{id} returns 404 for a non-existent ID

**File:** `e2e-tests/tests/api/employees-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee/999999 (an ID that does not exist in the database)
    - expect: The HTTP response status code is 404
    - expect: The response does not contain an employee object with a valid id, firstName, and lastName

#### 1.7. PATCH /api/employee/{id}/capacity updates the employee's capacityPercentage and returns 200

**File:** `e2e-tests/tests/api/employees-patch-capacity.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee to retrieve all employees and record the id of Clara Nkosi (email: clara.nkosi@skillweaver.dev) whose initial capacityPercentage is 0
    - expect: The response status is 200 and Clara Nkosi is present with capacityPercentage 0 and availableCapacity 100
  2. Send PATCH http://localhost:5047/api/employee/{id}/capacity with Content-Type: application/json and body { "capacityPercentage": 40 } using Clara Nkosi's id
    - expect: The HTTP response status code is 200
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a JSON object representing Clara Nkosi
    - expect: The response body capacityPercentage is 40
    - expect: The response body availableCapacity is 60
    - expect: Other fields (firstName, lastName, email, department, skills) remain unchanged
  3. Send GET http://localhost:5047/api/employee/{id} to confirm the update was persisted
    - expect: The response status is 200
    - expect: The response body capacityPercentage is 40
    - expect: The response body availableCapacity is 60

#### 1.8. PATCH /api/employee/{id}/capacity sets capacityPercentage to boundary values 0 and 100

**File:** `e2e-tests/tests/api/employees-patch-capacity.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee, record the id of Bruno Martins (email: bruno.martins@skillweaver.dev)
    - expect: The response status is 200 and Bruno Martins is present with a valid id
  2. Send PATCH http://localhost:5047/api/employee/{id}/capacity with body { "capacityPercentage": 0 }
    - expect: The HTTP response status code is 200
    - expect: The response body capacityPercentage is 0
    - expect: The response body availableCapacity is 100
  3. Send PATCH http://localhost:5047/api/employee/{id}/capacity with body { "capacityPercentage": 100 }
    - expect: The HTTP response status code is 200
    - expect: The response body capacityPercentage is 100
    - expect: The response body availableCapacity is 0

#### 1.9. PATCH /api/employee/{id}/capacity returns 404 for a non-existent employee ID

**File:** `e2e-tests/tests/api/employees-patch-capacity.spec.ts`

**Steps:**
  1. Send PATCH http://localhost:5047/api/employee/999999/capacity with Content-Type: application/json and body { "capacityPercentage": 50 }
    - expect: The HTTP response status code is 404
    - expect: No employee is updated in the database

#### 1.10. POST /api/employee/{id}/skills assigns a skill to an existing employee and returns 200

**File:** `e2e-tests/tests/api/employees-assign-skill.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee to retrieve all employees and record the id of David Park (email: david.park@skillweaver.dev). Send GET http://localhost:5047/api/skill to retrieve all skills and record the id of the skill named 'Docker'
    - expect: The response status is 200 for both requests
    - expect: David Park is present with a valid id and his current skills list does not include 'Docker'
    - expect: The skill named 'Docker' is present with a valid positive integer id
  2. Send POST http://localhost:5047/api/employee/{employeeId}/skills with Content-Type: application/json and body { "skillId": {dockerSkillId}, "proficiency": "Intermediate" }
    - expect: The HTTP response status code is 200
  3. Send GET http://localhost:5047/api/employee/{employeeId} to verify the skill was assigned
    - expect: The response status is 200
    - expect: The response body skills array now contains an entry with skillName 'Docker' and proficiencyLevel 'Intermediate'
    - expect: The number of skills has increased by 1 compared to before the assignment
    - expect: Existing skills (React Expert and Angular Beginner) are still present and unchanged

#### 1.11. POST /api/employee/{id}/skills assigns a skill with each valid proficiency level

**File:** `e2e-tests/tests/api/employees-assign-skill.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/employee to create a new employee with body { "firstName": "Henry", "lastName": "Webb", "email": "henry.webb@skillweaver.dev", "capacityPercentage": 10 }. Record the new employee's id. Send GET http://localhost:5047/api/skill and record the ids for Angular, React, and .NET
    - expect: The POST returns 201 with a valid employee id
    - expect: All three skill ids are available from the GET /api/skill response
  2. Send POST http://localhost:5047/api/employee/{id}/skills with body { "skillId": {angularId}, "proficiency": "Beginner" }
    - expect: The HTTP response status code is 200
  3. Send POST http://localhost:5047/api/employee/{id}/skills with body { "skillId": {reactId}, "proficiency": "Intermediate" }
    - expect: The HTTP response status code is 200
  4. Send POST http://localhost:5047/api/employee/{id}/skills with body { "skillId": {dotnetId}, "proficiency": "Expert" }
    - expect: The HTTP response status code is 200
  5. Send GET http://localhost:5047/api/employee/{id} to verify all three skills were assigned
    - expect: The response status is 200
    - expect: The skills array contains Angular with proficiencyLevel 'Beginner'
    - expect: The skills array contains React with proficiencyLevel 'Intermediate'
    - expect: The skills array contains .NET with proficiencyLevel 'Expert'
    - expect: The skills array has exactly 3 entries

#### 1.12. POST /api/employee/{id}/skills updates proficiency when the same skill is assigned again

**File:** `e2e-tests/tests/api/employees-assign-skill.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee to record Alice Chen's id (email: alice.chen@skillweaver.dev). Send GET http://localhost:5047/api/skill and record the id of the Angular skill. Note that Alice currently has Angular at proficiencyLevel 'Expert'
    - expect: Alice Chen is present in the response with Angular listed at 'Expert'
  2. Send POST http://localhost:5047/api/employee/{aliceId}/skills with body { "skillId": {angularId}, "proficiency": "Beginner" } to downgrade Alice's Angular proficiency
    - expect: The HTTP response status code is 200
  3. Send GET http://localhost:5047/api/employee/{aliceId} to verify the proficiency was updated
    - expect: The response status is 200
    - expect: The skills array contains exactly one entry for Angular
    - expect: The Angular entry has proficiencyLevel 'Beginner' (updated from 'Expert')
    - expect: Alice's total number of skills is the same as before (no duplicate entry was added)

#### 1.13. POST /api/employee/{id}/skills returns 400 for an invalid proficiency value

**File:** `e2e-tests/tests/api/employees-assign-skill.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee to record any seeded employee's id. Send GET http://localhost:5047/api/skill and record any skill id
    - expect: Both responses return 200 and contain valid data
  2. Send POST http://localhost:5047/api/employee/{id}/skills with body { "skillId": {skillId}, "proficiency": "Master" } (an invalid proficiency string not in the Beginner/Intermediate/Expert enum)
    - expect: The HTTP response status code is 400
    - expect: The response body contains an error message indicating the proficiency value is invalid or could not be assigned

#### 1.14. POST /api/employee/{id}/skills returns 400 for a non-existent skill ID

**File:** `e2e-tests/tests/api/employees-assign-skill.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee to record any seeded employee's id (for example Alice Chen)
    - expect: The response status is 200 and at least one employee with a valid id is present
  2. Send POST http://localhost:5047/api/employee/{id}/skills with body { "skillId": 999999, "proficiency": "Expert" } using a skill ID that does not exist
    - expect: The HTTP response status code is 400
    - expect: The response body contains an error message indicating the skill could not be assigned

#### 1.15. POST /api/employee/{id}/skills returns 400 for a non-existent employee ID

**File:** `e2e-tests/tests/api/employees-assign-skill.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/skill to record any seeded skill id (for example Angular)
    - expect: The response status is 200 and at least one skill with a valid id is present
  2. Send POST http://localhost:5047/api/employee/999999/skills with body { "skillId": {validSkillId}, "proficiency": "Expert" } using an employee ID that does not exist
    - expect: The HTTP response status code is 400 or 404
    - expect: The response body contains an error message indicating the employee or skill could not be found or the assignment failed

#### 1.16. POST /api/employee rejects a request with a missing required field

**File:** `e2e-tests/tests/api/employees-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/employee with Content-Type: application/json and body { "lastName": "Test", "email": "test@skillweaver.dev", "capacityPercentage": 10 } (firstName field omitted)
    - expect: The HTTP response status code is 400 or 422
    - expect: No new employee is created in the database
  2. Send POST http://localhost:5047/api/employee with Content-Type: application/json and body { "firstName": "Test", "lastName": "User", "capacityPercentage": 10 } (email field omitted)
    - expect: The HTTP response status code is 400, 422, or a database-level constraint error is returned
    - expect: No new employee is created

#### 1.17. GET /api/employee/{id} returns 404 for ID zero and negative IDs

**File:** `e2e-tests/tests/api/employees-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee/0
    - expect: The HTTP response status code is 404 or 400 — no employee object is returned
  2. Send GET http://localhost:5047/api/employee/-1
    - expect: The HTTP response status code is 404 or 400 — no employee object is returned

#### 1.18. GET /api/employee/{id} returns 400 for a non-integer ID

**File:** `e2e-tests/tests/api/employees-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/employee/abc (a non-numeric string in place of the integer ID)
    - expect: The HTTP response status code is 400
    - expect: The response body indicates a bad request or type-binding error

#### 1.19. POST /api/employee rejects a duplicate email address

**File:** `e2e-tests/tests/api/employees-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/employee with body { "firstName": "Duplicate", "lastName": "Alice", "email": "alice.chen@skillweaver.dev", "capacityPercentage": 0 } — an email address that already exists in the seeded data
    - expect: The HTTP response status code is not 201 (expected to be 400, 409, or 500 indicating a unique constraint violation)
    - expect: A second employee with email alice.chen@skillweaver.dev is NOT added to the database
  2. Send GET http://localhost:5047/api/employee and count how many employees have the email alice.chen@skillweaver.dev
    - expect: Exactly one employee with the email alice.chen@skillweaver.dev exists in the returned array
