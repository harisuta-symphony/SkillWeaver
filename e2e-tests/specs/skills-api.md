# SkillWeaver Skills API Test Plan

## Application Overview

SkillWeaver is a team assembly tool that matches employees to project requirements based on skills and capacity. This test plan covers the Skills API at http://localhost:5047/api/skill. The API exposes three operations: GET /api/skill (list all skills), POST /api/skill (create a skill), and GET /api/skill/{id} (fetch a single skill by its integer ID). Skills have the shape { id: number, name: string, category?: string }. The database is pre-seeded on startup with 6 skills: Angular (Frontend), .NET (Backend), PostgreSQL (Database), System Design (Architecture), React (Frontend), and Docker (DevOps). Skill names must be unique — enforced at the database level with a unique index. The environment health check is at GET http://localhost:5047/health and must return 200 with { status: "ok" } before any skill test is run (verified by the seed test at e2e-tests/tests/seed.spec.ts).

## Test Scenarios

### 1. Skills API

**Seed:** `e2e-tests/tests/seed.spec.ts`

#### 1.1. GET /api/skill returns 200 with a non-empty array of skills

**File:** `e2e-tests/tests/api/skills-get-all.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/skill with no request body or query parameters
    - expect: The HTTP response status code is 200
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a JSON array
    - expect: The array contains at least 6 items (the seeded skills)
    - expect: Each item in the array has a numeric id field greater than 0
    - expect: Each item has a non-empty string name field
    - expect: Each item has a category field that is either a non-empty string or null/absent
  2. Verify the seeded skills are present in the response array by checking for the names Angular, .NET, PostgreSQL, System Design, React, and Docker
    - expect: All six seeded skill names appear in the response array exactly once
    - expect: Angular has category Frontend
    - expect: .NET has category Backend
    - expect: PostgreSQL has category Database
    - expect: System Design has category Architecture
    - expect: React has category Frontend
    - expect: Docker has category DevOps

#### 1.2. POST /api/skill creates a new skill and returns 201 with the created resource

**File:** `e2e-tests/tests/api/skills-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with Content-Type: application/json and body { "name": "TypeScript", "category": "Frontend" }
    - expect: The HTTP response status code is 201
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a JSON object
    - expect: The response body has an id field that is a positive integer
    - expect: The response body has name equal to TypeScript
    - expect: The response body has category equal to Frontend
    - expect: The Location response header is present and contains /api/skill/{id} where {id} matches the returned id
  2. Record the id returned in the 201 response. Send GET http://localhost:5047/api/skill to fetch all skills
    - expect: The response status is 200
    - expect: The newly created skill with name TypeScript is present in the returned array
    - expect: The array now contains at least 7 items (6 seeded + 1 created)

#### 1.3. POST /api/skill creates a skill without an optional category

**File:** `e2e-tests/tests/api/skills-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with Content-Type: application/json and body { "name": "GraphQL" } (category field omitted)
    - expect: The HTTP response status code is 201
    - expect: The response body has a positive integer id
    - expect: The response body has name equal to GraphQL
    - expect: The response body category field is null or absent

#### 1.4. GET /api/skill/{id} returns the correct skill for a seeded ID

**File:** `e2e-tests/tests/api/skills-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/skill to retrieve all skills, and record the id of the skill whose name is Angular
    - expect: The response status is 200 and Angular is present in the array with a valid id
  2. Send GET http://localhost:5047/api/skill/{id} using the Angular skill id obtained in the previous step
    - expect: The HTTP response status code is 200
    - expect: The response Content-Type header includes application/json
    - expect: The response body is a single JSON object (not an array)
    - expect: The response body id matches the id used in the request
    - expect: The response body name is Angular
    - expect: The response body category is Frontend

#### 1.5. GET /api/skill/{id} returns the correct skill after a POST

**File:** `e2e-tests/tests/api/skills-get-by-id.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with body { "name": "Kubernetes", "category": "DevOps" } and record the id from the 201 response
    - expect: Status 201 is returned
    - expect: The id in the response body is a positive integer
  2. Send GET http://localhost:5047/api/skill/{id} using the id returned in the previous step
    - expect: The HTTP response status code is 200
    - expect: The response body id matches the id from the POST response
    - expect: The response body name is Kubernetes
    - expect: The response body category is DevOps

#### 1.6. GET /api/skill/{id} returns 404 for a non-existent ID

**File:** `e2e-tests/tests/api/skills-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/skill/999999 (an ID that does not exist in the database)
    - expect: The HTTP response status code is 404
    - expect: The response does not contain a skill object with a valid id and name

#### 1.7. POST /api/skill rejects a duplicate skill name

**File:** `e2e-tests/tests/api/skills-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with body { "name": "Angular", "category": "Frontend" } — a name that already exists in the seeded data
    - expect: The HTTP response status code is not 201 (expected to be 400, 409, or 500 indicating a constraint violation)
    - expect: A second Angular skill is NOT added to the database
  2. Send GET http://localhost:5047/api/skill and count how many skills have the name Angular
    - expect: Exactly one skill with the name Angular exists in the returned array

#### 1.8. POST /api/skill rejects a request with a missing name field

**File:** `e2e-tests/tests/api/skills-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with Content-Type: application/json and body { "category": "Frontend" } (name field omitted)
    - expect: The HTTP response status code is 400 or 422
    - expect: The response body contains an error message or validation problem details indicating that name is required

#### 1.9. POST /api/skill rejects a request with an empty name

**File:** `e2e-tests/tests/api/skills-post.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with Content-Type: application/json and body { "name": "", "category": "Backend" } (name is an empty string)
    - expect: The HTTP response status code is 400 or 422, or a database-level error is returned
    - expect: No skill with an empty name is persisted

#### 1.10. GET /api/skill/{id} returns 404 for ID zero and negative IDs

**File:** `e2e-tests/tests/api/skills-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/skill/0
    - expect: The HTTP response status code is 404 or 400 — no skill is returned
  2. Send GET http://localhost:5047/api/skill/-1
    - expect: The HTTP response status code is 404 or 400 — no skill is returned

#### 1.11. GET /api/skill/{id} returns 400 for a non-integer ID

**File:** `e2e-tests/tests/api/skills-get-by-id.spec.ts`

**Steps:**
  1. Send GET http://localhost:5047/api/skill/abc (a non-numeric string in place of the integer ID)
    - expect: The HTTP response status code is 400
    - expect: The response body indicates a bad request or type-binding error
