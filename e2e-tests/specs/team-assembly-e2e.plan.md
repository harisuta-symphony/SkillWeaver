# SkillWeaver — Full Team Assembly E2E Journey

## Application Overview

End-to-end test plan covering the golden-path manager journey through SkillWeaver's team assembly feature. The flow begins with API-level seeding (POST a skill and a qualified employee with that skill assigned), proceeds to the browser-based proposal creation form at /proposals, submits the form using the ProposalFormPage POM, and then asserts that the browser redirects to /proposals/{id}/team and that the seeded employee's name appears inside a .member-card element via the SuggestedTeamPage POM. API base: http://localhost:5047. Frontend base: http://localhost:4200. The seed test at tests/seed.spec.ts verifies API health before browser steps run.

## Test Scenarios

### 1. Full Team Assembly — Golden Path Journey

**Seed:** `tests/seed.spec.ts`

#### 1.1. Seed skill and qualified employee via API, then assemble a team through the UI

**File:** `tests/e2e/proposals/team-assembly-golden-path.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with JSON body { "name": "E2E_Skill_{timestamp}", "category": "Engineering" } and capture the returned id as skillId.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body name matches the sent name
  2. Send POST http://localhost:5047/api/employee with JSON body { "firstName": "E2E", "lastName": "Candidate", "email": "e2e.candidate+{timestamp}@skillweaver.dev", "department": "Engineering", "capacityPercentage": 20 } and capture the returned id as employeeId.
    - expect: Response status is 201
    - expect: Response body contains a numeric id greater than 0
    - expect: Response body availableCapacity equals 80, confirming 20% booked leaves 80% free
  3. Send POST http://localhost:5047/api/employee/{employeeId}/skills with JSON body { "skillId": {skillId}, "proficiency": "Intermediate" } to assign the seeded skill to the seeded employee at Intermediate proficiency.
    - expect: Response status is 200
    - expect: The seeded employee now holds the seeded skill at Intermediate proficiency
  4. Construct a ProposalFormPage instance (import from tests/page-objects/pages/ProposalFormPage) and call goto() to navigate the browser to http://localhost:4200/proposals.
    - expect: Browser URL is http://localhost:4200/proposals
    - expect: The page heading 'New Project Proposal' (h2) is visible
    - expect: No .error element is visible
  5. Call fillTitle('E2E Golden Path Project') on the ProposalFormPage instance, which types the text into the element identified by data-testid='proposal-title'.
    - expect: The proposal-title input contains the value 'E2E Golden Path Project'
  6. Call fillCommitment(30) on the ProposalFormPage instance, which types '30' into the element identified by data-testid='commitment-percentage'.
    - expect: The commitment-percentage input contains the value '30'
  7. Call addRequiredSkill('E2E_Skill_{timestamp}', 'Intermediate') on the ProposalFormPage instance. This selects the seeded skill name from the first combobox (skillSelect), selects 'Intermediate' from the second combobox (proficiencySelect), then clicks the 'Add Skill' button.
    - expect: The required-skills list (ul li) now contains at least one item
    - expect: The item text includes the seeded skill name and the proficiency 'Intermediate'
  8. Verify the submit button (data-testid='submit-proposal') is enabled before clicking, then call submit() on the ProposalFormPage instance.
    - expect: The submit button is not disabled prior to clicking
    - expect: Clicking the submit button triggers a POST to http://localhost:5047/api/projectproposal
  9. Wait for the browser to navigate away from /proposals. Capture the current URL after navigation completes.
    - expect: Browser URL matches the pattern /proposals/{numeric-id}/team, e.g. http://localhost:4200/proposals/42/team
    - expect: The URL path segment between /proposals/ and /team is a positive integer — this is the newly created proposal id
  10. Construct a SuggestedTeamPage instance (import from tests/page-objects/pages/SuggestedTeamPage) and call waitForResult() to wait until the 'Assembling team...' loading indicator disappears.
    - expect: The loading indicator ('Assembling team...') is no longer visible
    - expect: No .error element is visible
  11. Assert that at least one .member-card element is present in the DOM by calling getMemberCount() on the SuggestedTeamPage instance.
    - expect: getMemberCount() returns a value greater than or equal to 1
  12. Retrieve all member names via getMemberNames() on the SuggestedTeamPage instance. Assert that the array contains the string 'E2E Candidate' (the full name of the seeded employee).
    - expect: The returned names array contains 'E2E Candidate'
    - expect: The seeded employee's .member-card heading (h3) displays 'E2E Candidate'

#### 1.2. Proposal form blocks submission when the title is missing

**File:** `tests/e2e/proposals/team-assembly-golden-path.spec.ts`

**Steps:**
  1. Construct a ProposalFormPage instance and call goto() to navigate to http://localhost:4200/proposals.
    - expect: Browser URL is http://localhost:4200/proposals
    - expect: The proposal form is visible
  2. Call fillCommitment(30) to populate only the commitment field, leaving the title field empty.
    - expect: The commitment-percentage input contains '30'
    - expect: The proposal-title input is empty
  3. Check whether the submit button (data-testid='submit-proposal') is disabled by calling isSubmitDisabled().
    - expect: isSubmitDisabled() returns true — the form should not allow submission without a title
  4. Attempt to call submit() on the ProposalFormPage. If the button is enabled (edge case), the form should show a validation error.
    - expect: Either the submit button remains disabled, OR a visible .error or validation message appears
    - expect: The browser does NOT navigate away from /proposals

#### 1.3. Proposal form blocks submission when no required skill has been added

**File:** `tests/e2e/proposals/team-assembly-golden-path.spec.ts`

**Steps:**
  1. Construct a ProposalFormPage instance and call goto() to navigate to http://localhost:4200/proposals.
    - expect: Browser URL is http://localhost:4200/proposals
    - expect: The proposal form is visible
  2. Call fillTitle('No Skills Project') and fillCommitment(25) to populate the title and commitment fields only, without calling addRequiredSkill().
    - expect: The proposal-title input contains 'No Skills Project'
    - expect: The commitment-percentage input contains '25'
    - expect: The required-skills list (ul li) is empty — count is 0
  3. Check whether the submit button is disabled by calling isSubmitDisabled().
    - expect: isSubmitDisabled() returns true — the form should not allow submission without at least one required skill
    - expect: The browser does NOT navigate away from /proposals

#### 1.4. SuggestedTeamPage shows 'No employees match' when no candidate qualifies

**File:** `tests/e2e/proposals/team-assembly-golden-path.spec.ts`

**Steps:**
  1. Send POST http://localhost:5047/api/skill with body { "name": "ImpossibleSkill_{timestamp}", "category": "Research" } and capture skillId.
    - expect: Response status is 201
    - expect: skillId is a positive integer
  2. Send POST http://localhost:5047/api/projectproposal with body { "title": "Impossible E2E Project_{timestamp}", "requiredCommitmentPercentage": 99, "requiredSkills": [{ "skillId": {skillId}, "minimumProficiency": "Expert" }] }. No employee holds this skill, so the team will be empty.
    - expect: Response status is 201
    - expect: proposalId is a positive integer
  3. Navigate the browser directly to http://localhost:4200/proposals/{proposalId}/team. Construct a SuggestedTeamPage instance and call waitForResult().
    - expect: Browser URL is http://localhost:4200/proposals/{proposalId}/team
    - expect: The loading indicator disappears within the default timeout
  4. Assert that getMemberCount() returns 0 on the SuggestedTeamPage instance.
    - expect: getMemberCount() returns 0 — no .member-card elements are in the DOM
  5. Assert that the noResultsMessage locator (text 'No employees match') is visible on the SuggestedTeamPage instance.
    - expect: The text 'No employees match' is visible on the page
  6. Assert that the 'Create another proposal' link (createAnotherLink locator) is visible and navigates back to /proposals when clicked.
    - expect: createAnotherLink is visible
    - expect: Clicking it navigates the browser to http://localhost:4200/proposals
