# Employee Management Journey

## Application Overview

SkillWeaver is an Angular 17+ SPA (http://localhost:4200) backed by an ASP.NET Core 10 API (http://localhost:5000). The employee management journey covers the /employees route, which fetches employee records from the API and renders them as .employee-card elements. Each card exposes the employee's full name via an h3 heading, their email as the first paragraph, their available capacity as "Available capacity: N%", and a skill count as "Skills: N". The shared Navbar component renders three routerLink anchors — Employees, Skills, and Proposals — and applies the CSS class "active" to the currently matched link. All tests use the EmployeesPage POM (tests/page-objects/pages/EmployeesPage.ts), the EmployeeCard POM (tests/page-objects/components/EmployeeCard.ts), and the Navbar POM (tests/page-objects/components/Navbar.ts). The browser environment is set up using the seed test at tests/seed.spec.ts.

## Test Scenarios

### 1. Employee Management Journey

**Seed:** `tests/seed.spec.ts`

#### 1.1. navigating directly to /employees renders the employee list page

**File:** `tests/employees/employee-list-navigation.spec.ts`

**Steps:**
  1. Construct a new EmployeesPage instance and call goto() to navigate to http://localhost:4200/employees
    - expect: The browser URL is http://localhost:4200/employees
    - expect: The page does not show an unhandled error
  2. Call waitForEmployees() on the EmployeesPage instance to wait until the loading indicator disappears
    - expect: The 'Loading employees...' paragraph is no longer visible in the DOM
  3. Call getEmployeeCount() on the EmployeesPage instance
    - expect: The returned count is greater than or equal to 1, confirming at least one .employee-card element is present

#### 1.2. each employee card displays the employee name and available capacity

**File:** `tests/employees/employee-card-content.spec.ts`

**Steps:**
  1. Construct a new EmployeesPage instance, call goto(), then call waitForEmployees()
    - expect: The employees list has finished loading and at least one card is visible
  2. Call getEmployeeCount() and assert the result is at least 1
    - expect: At least one employee card is present before proceeding
  3. Call getCard(0) to get an EmployeeCard for the first card, then call name().textContent() on it
    - expect: The returned text is a non-empty string, confirming a name heading (h3) is rendered inside the card
  4. On the same EmployeeCard, call availableCapacity().textContent()
    - expect: The returned text matches the pattern 'Available capacity: N%' where N is a non-negative integer, confirming the capacity paragraph is rendered

#### 1.3. every visible employee card has a non-empty name and a valid available capacity value

**File:** `tests/employees/employee-card-all-entries.spec.ts`

**Steps:**
  1. Construct a new EmployeesPage instance, call goto(), then call waitForEmployees()
    - expect: The employees list has finished loading
  2. Call getEmployeeCount() to get the total number of cards
    - expect: At least one card is present
  3. Loop from index 0 to count-1; for each index call getCard(index), then assert name().textContent() is not empty
    - expect: Every card's h3 heading contains a non-empty string representing the employee's full name
  4. For each card in the same loop call availableCapacity().textContent() and assert it matches /Available capacity: \d+%/
    - expect: Every card's available capacity paragraph follows the expected format with a numeric percentage

#### 1.4. clicking the Skills nav link from the employees page navigates to /skills

**File:** `tests/employees/navbar-skills-navigation.spec.ts`

**Steps:**
  1. Construct a new EmployeesPage instance and call goto(), then call waitForEmployees()
    - expect: The /employees page is loaded and the employee list is visible
  2. Access employeesPage.navbar.skillsLink and assert it is visible
    - expect: The 'Skills' anchor element rendered by the Navbar component is present in the DOM
  3. Call employeesPage.navbar.goToSkills() which clicks the Skills anchor
    - expect: A click event is dispatched on the Skills nav link
  4. Wait for the URL to change to http://localhost:4200/skills
    - expect: The browser URL is now http://localhost:4200/skills, confirming Angular Router navigated to the skills route
  5. Assert that the page no longer shows .employee-card elements
    - expect: The employee list is no longer rendered, confirming the route component changed

#### 1.5. the Employees nav link is marked active when on /employees

**File:** `tests/employees/navbar-active-link.spec.ts`

**Steps:**
  1. Construct a new EmployeesPage instance and call goto()
    - expect: Navigation to /employees completes successfully
  2. Call employeesPage.navbar.activeLink() which returns the text content of the nav anchor that has the 'active' CSS class
    - expect: The returned text is 'Employees', confirming routerLinkActive applied the active class to the correct anchor

#### 1.6. navigating to /employees via the Employees nav link from another route also renders the list

**File:** `tests/employees/navbar-employees-navigation.spec.ts`

**Steps:**
  1. Navigate directly to http://localhost:4200/skills to start on a different route
    - expect: The browser URL is http://localhost:4200/skills
  2. Construct a Navbar instance and call goToEmployees() which clicks the Employees anchor
    - expect: A click event is dispatched on the Employees nav link
  3. Wait for the URL to become http://localhost:4200/employees
    - expect: The browser URL is now http://localhost:4200/employees
  4. Construct an EmployeesPage instance and call waitForEmployees()
    - expect: The loading indicator disappears
  5. Call getEmployeeCount() and assert the result is at least 1
    - expect: At least one .employee-card element is rendered, confirming the list loaded correctly after in-app navigation

#### 1.7. employee list shows error message when the API is unreachable

**File:** `tests/employees/employee-list-api-error.spec.ts`

**Steps:**
  1. Intercept all GET requests to /api/employee by routing them to an abort response using page.route() before navigation
    - expect: The network intercept is registered
  2. Construct a new EmployeesPage instance and call goto()
    - expect: The browser navigates to /employees
  3. Call waitForEmployees() to wait for the loading state to clear
    - expect: The 'Loading employees...' paragraph disappears once the failed HTTP call completes
  4. Assert that employeesPage.errorMessage is visible and contains the text 'Failed to load employees'
    - expect: The .error paragraph is visible with the error message rendered by the Angular component's error signal
  5. Assert that employeesPage.employeeCards has count 0
    - expect: No .employee-card elements are rendered because the data fetch failed

#### 1.8. loading indicator is shown while employees are being fetched then disappears

**File:** `tests/employees/employee-list-loading-state.spec.ts`

**Steps:**
  1. Register a page.route() intercept for GET /api/employee that delays the response by 1000 ms before forwarding it
    - expect: The delay intercept is registered
  2. Construct a new EmployeesPage instance and call goto()
    - expect: Navigation to /employees begins
  3. Immediately assert that employeesPage.loadingIndicator is visible before the delayed response resolves
    - expect: The 'Loading employees...' paragraph is visible in the DOM during the loading phase
  4. Call waitForEmployees() to wait for the loading indicator to be hidden once the response arrives
    - expect: The 'Loading employees...' paragraph disappears after the response resolves
  5. Call getEmployeeCount() and assert the result is at least 1
    - expect: Employee cards appear after loading completes, confirming the transition from loading to populated state

#### 1.9. getCardByName returns the correct card for a named employee

**File:** `tests/employees/employee-card-by-name.spec.ts`

**Steps:**
  1. Construct a new EmployeesPage instance, call goto(), then call waitForEmployees()
    - expect: The employee list is loaded and at least one card is visible
  2. Call getCard(0) to get the first card, then read name().textContent() to capture the first employee's full name
    - expect: A non-empty name string is captured from the first card
  3. Call getCardByName(capturedName) on the EmployeesPage to look up the card by that name
    - expect: The method returns an EmployeeCard whose root locator matches the card with the given name
  4. Assert that the returned EmployeeCard's name().textContent() equals the originally captured name
    - expect: The name heading in the card returned by getCardByName matches the name used in the lookup, confirming the filter works correctly
