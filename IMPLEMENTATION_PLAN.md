# SkillWeaver — Master Implementation Plan

> **Target:** 7 days | **Stack:** .NET 8 Clean Architecture · Angular 17+ (Standalone) · PostgreSQL · Playwright (TypeScript)
> **Goal:** Enterprise Team Assembly Engine — mathematically match employee skills and capacity to project demands, with full test automation and CI/CD.

---

## Quick Reference

| Layer | Tech | Key Libraries / Tools |
|---|---|---|
| API | .NET 8, ASP.NET Core, C# | Entity Framework Core, AutoMapper, FluentValidation, Swashbuckle |
| Database | PostgreSQL | EF Core Migrations, Npgsql |
| Frontend | Angular 17+, TypeScript | Angular Signals, Standalone Components, Angular HttpClient, Angular Router |
| Tests | Playwright, TypeScript | @playwright/test, playwright-cli (POMs), Playwright Agents |
| CI/CD | GitHub Actions | .yml workflow, dotnet CLI, npm CI, Playwright |

---

## Directory Blueprint

```
skillweaver/                              ← repo root
├── .gitignore
├── README.md
├── IMPLEMENTATION_PLAN.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   └── SkillWeaver/
│       ├── SkillWeaver.sln
│       ├── SkillWeaver.API/                    ← Presentation layer
│       │   ├── SkillWeaver.API.csproj
│       │   ├── Program.cs
│       │   ├── appsettings.json
│       │   ├── appsettings.Development.json
│       │   └── Controllers/
│       │       ├── EmployeeController.cs
│       │       ├── SkillController.cs
│       │       └── ProjectProposalController.cs
│       ├── SkillWeaver.Application/            ← Application layer
│       │   ├── SkillWeaver.Application.csproj
│       │   ├── services/
│       │   │   ├── EmployeeService.cs
│       │   │   ├── SkillService.cs
│       │   │   ├── ProjectProposalService.cs
│       │   │   └── TeamAssemblyService.cs
│       │   ├── dtos/
│       │   │   ├── EmployeeDto.cs
│       │   │   ├── SkillDto.cs
│       │   │   ├── ProjectProposalDto.cs
│       │   │   ├── CreateProjectProposalDto.cs
│       │   │   ├── SuggestedTeamDto.cs
│       │   │   └── TeamMemberDto.cs
│       │   └── interfaces/
│       │       ├── IEmployeeService.cs
│       │       ├── ISkillService.cs
│       │       ├── IProjectProposalService.cs
│       │       └── ITeamAssemblyService.cs
│       ├── SkillWeaver.Domain/                 ← Domain layer
│       │   ├── SkillWeaver.Domain.csproj
│       │   ├── Entities/
│       │   │   ├── EmployeeEntity.cs
│       │   │   ├── SkillEntity.cs
│       │   │   ├── EmployeeSkillEntity.cs      ← join: employee ↔ skill + proficiency
│       │   │   └── ProjectProposalEntity.cs
│       │   └── Enums/
│       │       └── ProficiencyLevel.cs
│       └── SkillWeaver.Infrastructure/         ← Infrastructure layer
│           ├── SkillWeaver.Infrastructure.csproj
│           ├── Data/
│           │   ├── SkillWeaverDbContext.cs
│           │   └── Migrations/
│           └── Repositories/
│               ├── EmployeeRepository.cs
│               ├── SkillRepository.cs
│               └── ProjectProposalRepository.cs
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── src/
│       ├── main.ts
│       ├── app/
│       │   ├── app.config.ts                   ← standalone app config (no AppModule)
│       │   ├── app.routes.ts                   ← route definitions
│       │   ├── app.component.ts
│       │   ├── core/
│       │   │   ├── services/
│       │   │   │   ├── employee.service.ts
│       │   │   │   ├── skill.service.ts
│       │   │   │   └── project-proposal.service.ts
│       │   │   └── models/
│       │   │       ├── employee.model.ts
│       │   │       ├── skill.model.ts
│       │   │       └── project-proposal.model.ts
│       │   ├── shared/
│       │   │   └── components/
│       │   │       └── navbar/
│       │   │           ├── navbar.component.ts
│       │   │           └── navbar.component.html
│       │   └── features/
│       │       ├── employees/
│       │       │   ├── employee-list/
│       │       │   │   ├── employee-list.component.ts
│       │       │   │   └── employee-list.component.html
│       │       │   └── employee-form/
│       │       │       ├── employee-form.component.ts
│       │       │       └── employee-form.component.html
│       │       ├── skills/
│       │       │   └── skill-list/
│       │       │       ├── skill-list.component.ts
│       │       │       └── skill-list.component.html
│       │       └── proposals/
│       │           ├── proposal-form/
│       │           │   ├── proposal-form.component.ts
│       │           │   └── proposal-form.component.html
│       │           └── suggested-team/
│       │               ├── suggested-team.component.ts
│       │               └── suggested-team.component.html
│       └── environments/
│           ├── environment.ts
│           └── environment.development.ts
└── e2e-tests/
    ├── playwright.config.ts
    ├── package.json
    ├── tsconfig.json
    └── tests/
        ├── global.setup.ts
        ├── api/
        │   ├── employees.api.spec.ts
        │   ├── skills.api.spec.ts
        │   └── proposals.api.spec.ts
        ├── integration/
        │   ├── team-assembly.integration.spec.ts
        │   └── employee-skills.integration.spec.ts
        ├── e2e/
        │   ├── employee-management.journey.spec.ts
        │   └── team-assembly.journey.spec.ts
        ├── fixtures/
        │   └── test.fixtures.ts
        ├── utils/
        │   ├── apiHelpers.ts
        │   └── testData.ts
        └── page-objects/
            ├── pages/
            │   ├── EmployeesPage.ts
            │   ├── SkillsPage.ts
            │   ├── ProposalFormPage.ts
            │   └── SuggestedTeamPage.ts
            └── components/
                ├── Navbar.ts
                └── EmployeeCard.ts
```

---

## Progress Tracker

```
Phase 0  — Monorepo Setup                    [ 0 / 5  ]
Phase 1  — Domain Layer                      [ 0 / 7  ]
Phase 2  — Application Layer                 [ 0 / 10 ]
Phase 3  — Infrastructure Layer              [ 0 / 8  ]
Phase 4  — API Layer (Controllers)           [ 0 / 8  ]
Phase 5  — Angular Scaffolding               [ 0 / 10 ]
Phase 6  — Angular Features                  [ 0 / 12 ]
Phase 7  — Playwright Setup & POMs           [ 0 / 10 ]
Phase 8  — API & Integration Tests           [ 0 / 10 ]
Phase 9  — E2E Journey Tests                 [ 0 / 8  ]
Phase 10 — CI/CD (GitHub Actions)            [ 0 / 5  ]
```

---

## Phase 0 — Monorepo & Environment Setup
**Estimated time:** 1–2 hours | **Day 1**

---

### Task 0.1 — Initialize Git repository

**Goal:** Create a versioned root for the entire monorepo.

**Steps:**
1. `mkdir skillweaver && cd skillweaver`
2. `git init`
3. `git branch -M main`

**Done when:** `git status` shows an empty repo on branch `main`.

---

### Task 0.2 — Create monorepo directory skeleton

**Goal:** Establish top-level folders so all relative paths are consistent from Day 1.

**Steps:**
```bash
mkdir -p backend frontend e2e-tests .github/workflows
```

**Done when:** All four directories exist at repo root.

---

### Task 0.3 — Create root `.gitignore`

**Goal:** Prevent secrets, build artifacts, and IDE files from being committed.

**File:** `.gitignore` (repo root)

```
# .NET
backend/**/bin/
backend/**/obj/
backend/**/*.user
backend/**/*.env
backend/**/appsettings.Development.json

# Node / Angular
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.angular/

# Playwright
e2e-tests/node_modules/
e2e-tests/playwright-report/
e2e-tests/test-results/
e2e-tests/.auth/
e2e-tests/.env

# OS
.DS_Store
Thumbs.db

# IDEs
.idea/
.vscode/
```

**Done when:** File exists; `git status` shows it as untracked (not ignored).

---

### Task 0.4 — Create root `README.md`

**Goal:** Single entry-point document for the project.

**Sections to include:**
- Project name and one-line description
- Tech stack table (Backend / Frontend / Tests)
- Quick-start commands for each workspace (fill in details as you build)
- Architecture overview — one paragraph explaining Clean Architecture layers
- Link to each sub-workspace README

**Done when:** `README.md` exists and renders correctly on GitHub.

---

### Task 0.5 — Create `.env` files

**Goal:** Provide local config values without committing secrets.

**File:** `backend/SkillWeaver/SkillWeaver.API/appsettings.Development.json` (gitignored)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=skillweaver;Username=postgres;Password=postgres"
  },
  "AllowedOrigins": ["http://localhost:4200"]
}
```

Also create `appsettings.Development.json.example` with the same keys but placeholder values — this one IS committed.

**Done when:** Both files exist; `.json` (real) is gitignored; `.example` is tracked.

---

## Phase 1 — Domain Layer
**Estimated time:** 2–3 hours | **Day 1**

> **Clean Architecture rule:** The Domain layer has zero dependencies on any other layer or NuGet package. It contains only plain C# classes and enums.

---

### Task 1.1 — Create .NET solution and projects

**Goal:** Scaffold the four-project Clean Architecture solution.

**Steps:**
```bash
cd backend
dotnet new sln -n SkillWeaver
dotnet new classlib -n SkillWeaver.Domain
dotnet new classlib -n SkillWeaver.Application
dotnet new classlib -n SkillWeaver.Infrastructure
dotnet new webapi  -n SkillWeaver.API

dotnet sln add SkillWeaver.Domain/SkillWeaver.Domain.csproj
dotnet sln add SkillWeaver.Application/SkillWeaver.Application.csproj
dotnet sln add SkillWeaver.Infrastructure/SkillWeaver.Infrastructure.csproj
dotnet sln add SkillWeaver.API/SkillWeaver.API.csproj

# Wire up project references (Clean Architecture dependency flow)
dotnet add SkillWeaver.Application/SkillWeaver.Application.csproj reference SkillWeaver.Domain/SkillWeaver.Domain.csproj
dotnet add SkillWeaver.Infrastructure/SkillWeaver.Infrastructure.csproj reference SkillWeaver.Application/SkillWeaver.Application.csproj
dotnet add SkillWeaver.Infrastructure/SkillWeaver.Infrastructure.csproj reference SkillWeaver.Domain/SkillWeaver.Domain.csproj
dotnet add SkillWeaver.API/SkillWeaver.API.csproj reference SkillWeaver.Application/SkillWeaver.Application.csproj
dotnet add SkillWeaver.API/SkillWeaver.API.csproj reference SkillWeaver.Infrastructure/SkillWeaver.Infrastructure.csproj
```

**Done when:** `dotnet build SkillWeaver.sln` succeeds with zero errors.

---

### Task 1.2 — Create `ProficiencyLevel` enum

**Goal:** Define the proficiency scale used to grade employee skills and set project requirements.

**File:** `SkillWeaver.Domain/Enums/ProficiencyLevel.cs`

```csharp
namespace SkillWeaver.Domain.Enums;

public enum ProficiencyLevel
{
    Beginner = 1,
    Intermediate = 2,
    Expert = 3
}
```

> Integer values matter — the Team Assembly algorithm uses `>=` comparisons (e.g. an Expert satisfies an Intermediate requirement).

**Done when:** Enum compiles; `ProficiencyLevel.Expert > ProficiencyLevel.Beginner` is `true`.

---

### Task 1.3 — Create `SkillEntity`

**Goal:** Define the lookup table of available skills in the system.

**File:** `SkillWeaver.Domain/Entities/SkillEntity.cs`

**Properties to define:**
- `Id` — `int`, primary key
- `Name` — `string`, required (e.g. "Angular", ".NET", "PostgreSQL")
- `Category` — `string`, nullable (e.g. "Frontend", "Backend", "Database")
- Navigation: `EmployeeSkills` → `ICollection<EmployeeSkillEntity>`

**Done when:** Class compiles; no external dependencies.

---

### Task 1.4 — Create `EmployeeEntity`

**Goal:** Define an employee with their profile and capacity.

**File:** `SkillWeaver.Domain/Entities/EmployeeEntity.cs`

**Properties to define:**
- `Id` — `int`, primary key
- `FirstName` — `string`, required
- `LastName` — `string`, required
- `Email` — `string`, required, unique
- `Department` — `string`, nullable
- `CapacityPercentage` — `int` (0–100). This represents how much of their time is already booked. E.g. `80` means 80% booked → 20% free.
- Navigation: `EmployeeSkills` → `ICollection<EmployeeSkillEntity>`

> **Domain note:** Available capacity = `100 - CapacityPercentage`. The algorithm filters employees whose available capacity is ≥ the project's required commitment.

**Done when:** Class compiles; no external dependencies.

---

### Task 1.5 — Create `EmployeeSkillEntity`

**Goal:** Join table linking employees to skills, with a proficiency level for each pairing.

**File:** `SkillWeaver.Domain/Entities/EmployeeSkillEntity.cs`

**Properties to define:**
- `Id` — `int`, primary key
- `EmployeeId` — `int`, foreign key
- `SkillId` — `int`, foreign key
- `ProficiencyLevel` — `ProficiencyLevel` enum
- Navigation: `Employee` → `EmployeeEntity`
- Navigation: `Skill` → `SkillEntity`

**Done when:** Class compiles; references `ProficiencyLevel` enum correctly.

---

### Task 1.6 — Create `ProjectProposalEntity`

**Goal:** Define the project a manager submits for team assembly.

**File:** `SkillWeaver.Domain/Entities/ProjectProposalEntity.cs`

**Properties to define:**
- `Id` — `int`, primary key
- `Title` — `string`, required
- `Description` — `string`, nullable
- `RequiredCommitmentPercentage` — `int` (e.g. `30` means the project needs 30% of each team member's time)
- `CreatedAt` — `DateTime`
- `RequiredSkills` — `ICollection<ProjectRequiredSkillEntity>` (see below)

Also create the embedded value object **`ProjectRequiredSkillEntity`** in the same file or a new file:

**File:** `SkillWeaver.Domain/Entities/ProjectRequiredSkillEntity.cs`

- `Id` — `int`, primary key
- `ProjectProposalId` — `int`, foreign key
- `SkillId` — `int`, foreign key
- `MinimumProficiency` — `ProficiencyLevel` enum
- Navigation: `Skill` → `SkillEntity`

**Done when:** Both classes compile; `ProjectProposalEntity` can hold a list of required skills.

---

### Task 1.7 — Verify Domain layer builds clean

**Steps:**
```bash
dotnet build SkillWeaver.Domain/SkillWeaver.Domain.csproj
```

**Done when:** Zero errors, zero warnings. Domain has no NuGet dependencies in its `.csproj`.

---

## Phase 2 — Application Layer
**Estimated time:** 3–4 hours | **Day 2**

> **Clean Architecture rule:** The Application layer defines *what* the system does — business logic and orchestration. It depends only on Domain. It knows nothing about databases, HTTP, or Angular.
>
> **Folder rule:** Everything in Application lives in exactly three folders: `services/`, `dtos/`, `interfaces/`.

---

### Task 2.1 — Install Application layer NuGet packages

**Steps:**
```bash
cd SkillWeaver.Application
dotnet add package AutoMapper
dotnet add package FluentValidation
```

**Done when:** Packages appear in `SkillWeaver.Application.csproj`.

---

### Task 2.2 — Create DTOs

**Goal:** Define the data shapes that cross layer boundaries. Controllers and Angular consume DTOs, never entities.

**File:** `SkillWeaver.Application/dtos/SkillDto.cs`
```csharp
namespace SkillWeaver.Application.dtos;

public class SkillDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
}
```

**File:** `SkillWeaver.Application/dtos/EmployeeDto.cs`
```csharp
namespace SkillWeaver.Application.dtos;

public class EmployeeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int CapacityPercentage { get; set; }
    public int AvailableCapacity => 100 - CapacityPercentage;
    public List<EmployeeSkillDto> Skills { get; set; } = new();
}

public class EmployeeSkillDto
{
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string ProficiencyLevel { get; set; } = string.Empty;
}

public class CreateEmployeeDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int CapacityPercentage { get; set; }
}
```

**File:** `SkillWeaver.Application/dtos/ProjectProposalDto.cs`
```csharp
namespace SkillWeaver.Application.dtos;

public class ProjectProposalDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int RequiredCommitmentPercentage { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<RequiredSkillDto> RequiredSkills { get; set; } = new();
}

public class RequiredSkillDto
{
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string MinimumProficiency { get; set; } = string.Empty;
}

public class CreateProjectProposalDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int RequiredCommitmentPercentage { get; set; }
    public List<CreateRequiredSkillDto> RequiredSkills { get; set; } = new();
}

public class CreateRequiredSkillDto
{
    public int SkillId { get; set; }
    public string MinimumProficiency { get; set; } = string.Empty;
}
```

**File:** `SkillWeaver.Application/dtos/SuggestedTeamDto.cs`
```csharp
namespace SkillWeaver.Application.dtos;

public class SuggestedTeamDto
{
    public int ProjectProposalId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public List<TeamMemberDto> SuggestedMembers { get; set; } = new();
    public int TotalCandidates { get; set; }
}

public class TeamMemberDto
{
    public int EmployeeId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public int AvailableCapacity { get; set; }
    public List<EmployeeSkillDto> MatchedSkills { get; set; } = new();
}
```

**Done when:** All DTO files compile; no circular references.

---

### Task 2.3 — Create interfaces

**Goal:** Define contracts that the Infrastructure layer must implement. The Application layer depends on abstractions, never on concrete database classes.

**File:** `SkillWeaver.Application/interfaces/ISkillService.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface ISkillService
{
    Task<IEnumerable<SkillDto>> GetAllSkillsAsync();
    Task<SkillDto?> GetSkillByIdAsync(int id);
    Task<SkillDto> CreateSkillAsync(SkillDto dto);
}
```

**File:** `SkillWeaver.Application/interfaces/IEmployeeService.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
    Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto);
    Task<EmployeeDto?> UpdateEmployeeCapacityAsync(int id, int newCapacity);
    Task<bool> AssignSkillAsync(int employeeId, int skillId, string proficiency);
}
```

**File:** `SkillWeaver.Application/interfaces/IProjectProposalService.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface IProjectProposalService
{
    Task<IEnumerable<ProjectProposalDto>> GetAllProposalsAsync();
    Task<ProjectProposalDto?> GetProposalByIdAsync(int id);
    Task<ProjectProposalDto> CreateProposalAsync(CreateProjectProposalDto dto);
}
```

**File:** `SkillWeaver.Application/interfaces/ITeamAssemblyService.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Application.dtos;

public interface ITeamAssemblyService
{
    /// <summary>
    /// Core algorithm: given a Project Proposal ID, find all employees who
    /// satisfy every required skill at the minimum proficiency AND have
    /// sufficient available capacity.
    /// </summary>
    Task<SuggestedTeamDto> AssembleTeamAsync(int projectProposalId);
}
```

**Done when:** All four interface files compile; no implementations yet.

---

### Task 2.4 — Implement `SkillService`

**File:** `SkillWeaver.Application/services/SkillService.cs`

Implement `ISkillService`. Constructor takes `ISkillRepository` (define this interface below). Methods: call repository, map entities to DTOs manually or via AutoMapper.

> Since Infrastructure hasn't been built yet, use a repository interface as a placeholder. Define it alongside the service:

**File:** `SkillWeaver.Application/interfaces/ISkillRepository.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;

public interface ISkillRepository
{
    Task<IEnumerable<SkillEntity>> GetAllAsync();
    Task<SkillEntity?> GetByIdAsync(int id);
    Task<SkillEntity> AddAsync(SkillEntity entity);
}
```

**Done when:** `SkillService.cs` compiles; constructor injection of `ISkillRepository` works.

---

### Task 2.5 — Implement `EmployeeService`

**File:** `SkillWeaver.Application/services/EmployeeService.cs`

Define `IEmployeeRepository` first:

**File:** `SkillWeaver.Application/interfaces/IEmployeeRepository.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;

public interface IEmployeeRepository
{
    Task<IEnumerable<EmployeeEntity>> GetAllWithSkillsAsync();
    Task<EmployeeEntity?> GetByIdWithSkillsAsync(int id);
    Task<EmployeeEntity> AddAsync(EmployeeEntity entity);
    Task UpdateAsync(EmployeeEntity entity);
    Task<bool> AssignSkillAsync(int employeeId, int skillId, Domain.Enums.ProficiencyLevel level);
}
```

Implement `EmployeeService` using this interface.

**Done when:** `EmployeeService.cs` compiles with all interface methods satisfied.

---

### Task 2.6 — Implement `ProjectProposalService`

**File:** `SkillWeaver.Application/services/ProjectProposalService.cs`

Define `IProjectProposalRepository`:

**File:** `SkillWeaver.Application/interfaces/IProjectProposalRepository.cs`
```csharp
namespace SkillWeaver.Application.interfaces;
using SkillWeaver.Domain.Entities;

public interface IProjectProposalRepository
{
    Task<IEnumerable<ProjectProposalEntity>> GetAllWithSkillsAsync();
    Task<ProjectProposalEntity?> GetByIdWithSkillsAsync(int id);
    Task<ProjectProposalEntity> AddAsync(ProjectProposalEntity entity);
}
```

**Done when:** `ProjectProposalService.cs` compiles; `CreateProposalAsync` maps `CreateProjectProposalDto` → `ProjectProposalEntity`.

---

### Task 2.7 — Implement `TeamAssemblyService` (Core Algorithm)

**Goal:** This is the heart of SkillWeaver. Implement the matching algorithm.

**File:** `SkillWeaver.Application/services/TeamAssemblyService.cs`

**Algorithm logic to implement:**

```csharp
public async Task<SuggestedTeamDto> AssembleTeamAsync(int projectProposalId)
{
    // 1. Load the project proposal with its required skills
    var proposal = await _proposalRepository.GetByIdWithSkillsAsync(projectProposalId);
    if (proposal == null) throw new KeyNotFoundException(...);

    // 2. Load all employees with their skills
    var allEmployees = await _employeeRepository.GetAllWithSkillsAsync();

    // 3. Filter: employee must satisfy ALL required skills
    var candidates = allEmployees.Where(employee =>
        proposal.RequiredSkills.All(required =>
            employee.EmployeeSkills.Any(empSkill =>
                empSkill.SkillId == required.SkillId &&
                empSkill.ProficiencyLevel >= required.MinimumProficiency
            )
        )
    );

    // 4. Filter: employee must have enough available capacity
    candidates = candidates.Where(e =>
        (100 - e.CapacityPercentage) >= proposal.RequiredCommitmentPercentage
    );

    // 5. Map to SuggestedTeamDto and return
    ...
}
```

**Done when:** `TeamAssemblyService.cs` compiles; the algorithm steps are clearly commented.

---

### Task 2.8 — Implement `ProjectProposalService`

**File:** `SkillWeaver.Application/services/ProjectProposalService.cs`

Implement `IProjectProposalService`. Wire `CreateProposalAsync` to map the DTO into a `ProjectProposalEntity` (including its `RequiredSkills` collection) and call the repository.

**Done when:** File compiles; returns `ProjectProposalDto` from `CreateProposalAsync`.

---

### Task 2.9 — Verify Application layer builds clean

```bash
dotnet build SkillWeaver.Application/SkillWeaver.Application.csproj
```

**Done when:** Zero errors. No reference to `Microsoft.EntityFrameworkCore` or anything HTTP-related in this project.

---

## Phase 3 — Infrastructure Layer
**Estimated time:** 3–4 hours | **Day 2–3**

> **Clean Architecture rule:** Infrastructure implements the contracts defined in Application. EF Core, PostgreSQL, and migrations live here — never in Application or Domain.

---

### Task 3.1 — Install Infrastructure NuGet packages

```bash
cd SkillWeaver.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
```

**Done when:** Packages in `.csproj`; `dotnet build` succeeds.

---

### Task 3.2 — Create `SkillWeaverDbContext`

**File:** `SkillWeaver.Infrastructure/Data/SkillWeaverDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using SkillWeaver.Domain.Entities;

namespace SkillWeaver.Infrastructure.Data;

public class SkillWeaverDbContext : DbContext
{
    public SkillWeaverDbContext(DbContextOptions<SkillWeaverDbContext> options) : base(options) { }

    public DbSet<EmployeeEntity> Employees => Set<EmployeeEntity>();
    public DbSet<SkillEntity> Skills => Set<SkillEntity>();
    public DbSet<EmployeeSkillEntity> EmployeeSkills => Set<EmployeeSkillEntity>();
    public DbSet<ProjectProposalEntity> ProjectProposals => Set<ProjectProposalEntity>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Unique email constraint
        builder.Entity<EmployeeEntity>().HasIndex(e => e.Email).IsUnique();

        // Unique skill name
        builder.Entity<SkillEntity>().HasIndex(s => s.Name).IsUnique();

        // EmployeeSkill composite unique constraint
        builder.Entity<EmployeeSkillEntity>()
            .HasIndex(es => new { es.EmployeeId, es.SkillId })
            .IsUnique();

        // Store enum as string for readability
        builder.Entity<EmployeeSkillEntity>()
            .Property(es => es.ProficiencyLevel)
            .HasConversion<string>();

        builder.Entity<ProjectProposalEntity>()
            .Property(p => p.CreatedAt)
            .HasDefaultValueSql("NOW()");
    }
}
```

**Done when:** DbContext compiles; all five DbSets are registered.

---

### Task 3.3 — Implement `SkillRepository`

**File:** `SkillWeaver.Infrastructure/Repositories/SkillRepository.cs`

Implement `ISkillRepository` using `SkillWeaverDbContext`. Use async EF Core methods (`ToListAsync`, `FindAsync`, `AddAsync`, `SaveChangesAsync`).

**Done when:** All three interface methods implemented.

---

### Task 3.4 — Implement `EmployeeRepository`

**File:** `SkillWeaver.Infrastructure/Repositories/EmployeeRepository.cs`

Implement `IEmployeeRepository`. For `GetAllWithSkillsAsync` and `GetByIdWithSkillsAsync`, use `.Include(e => e.EmployeeSkills).ThenInclude(es => es.Skill)` to eagerly load skills.

**Done when:** All repository methods implemented; `Include` chains are correct.

---

### Task 3.5 — Implement `ProjectProposalRepository`

**File:** `SkillWeaver.Infrastructure/Repositories/ProjectProposalRepository.cs`

Implement `IProjectProposalRepository`. Use `.Include(p => p.RequiredSkills).ThenInclude(rs => rs.Skill)` to load the full proposal graph needed by the Team Assembly algorithm.

**Done when:** All methods implemented; `GetByIdWithSkillsAsync` returns fully hydrated proposal.

---

### Task 3.6 — Create initial EF Core migration

**Steps:**
```bash
cd backend/SkillWeaver
dotnet ef migrations add InitialCreate --project SkillWeaver.Infrastructure --startup-project SkillWeaver.API
dotnet ef database update --project SkillWeaver.Infrastructure --startup-project SkillWeaver.API
```

> You'll need to register `SkillWeaverDbContext` in `SkillWeaver.API/Program.cs` first (a minimal version is fine — see Phase 4 Task 4.1).

**Done when:** Migration file generated; all tables created in PostgreSQL. Verify with `\dt` in `psql`.

---

### Task 3.7 — Add seed data (optional but recommended)

**Goal:** Populate the database with sample skills and employees so the Angular UI is not empty during development.

Create a static seeder class:

**File:** `SkillWeaver.Infrastructure/Data/DatabaseSeeder.cs`

Seed:
- 6 skills: `Angular`, `.NET`, `PostgreSQL`, `System Design`, `React`, `Docker`
- 4 employees with varied capacities and assigned skills

Call seeder in `Program.cs` on startup (development only).

**Done when:** Running the API populates the database; `GET /api/employees` returns 4 employees.

---

### Task 3.8 — Verify Infrastructure layer builds clean

```bash
dotnet build SkillWeaver.Infrastructure/SkillWeaver.Infrastructure.csproj
```

**Done when:** Zero errors.

---

## Phase 4 — API Layer (Controllers & Wiring)
**Estimated time:** 2–3 hours | **Day 3**

> **Clean Architecture rule:** Controllers are thin. They receive HTTP requests, call an Application service, and return HTTP responses. No business logic here.

---

### Task 4.1 — Configure `Program.cs`

**Goal:** Register all services, DbContext, CORS, and Swagger.

**File:** `SkillWeaver.API/Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<SkillWeaverDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Application services (DI wiring — interface → implementation)
builder.Services.AddScoped<ISkillRepository, SkillRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IProjectProposalRepository, ProjectProposalRepository>();
builder.Services.AddScoped<ISkillService, SkillService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IProjectProposalService, ProjectProposalService>();
builder.Services.AddScoped<ITeamAssemblyService, TeamAssemblyService>();

// CORS for Angular dev server
builder.Services.AddCors(options =>
    options.AddPolicy("AngularDev", policy =>
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!)
              .AllowAnyMethod()
              .AllowAnyHeader()));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AngularDev");
app.MapControllers();
app.Run();
```

**Done when:** `dotnet run` starts the API; `GET /swagger` opens Swagger UI.

---

### Task 4.2 — Implement `SkillController`

**File:** `SkillWeaver.API/Controllers/SkillController.cs`

```csharp
[ApiController]
[Route("api/[controller]")]
public class SkillController : ControllerBase
{
    private readonly ISkillService _skillService;
    public SkillController(ISkillService skillService) { _skillService = skillService; }

    [HttpGet]           // GET /api/skill
    [HttpGet("{id}")]   // GET /api/skill/5
    [HttpPost]          // POST /api/skill
}
```

**Done when:** All three endpoints return correct status codes; test via Swagger.

---

### Task 4.3 — Implement `EmployeeController`

**File:** `SkillWeaver.API/Controllers/EmployeeController.cs`

**Endpoints:**
- `GET /api/employee` — list all employees
- `GET /api/employee/{id}` — get single employee with skills
- `POST /api/employee` — create employee
- `PATCH /api/employee/{id}/capacity` — update capacity (`{ "capacityPercentage": 60 }`)
- `POST /api/employee/{id}/skills` — assign a skill (`{ "skillId": 1, "proficiency": "Expert" }`)

**Done when:** All five endpoints respond correctly via Swagger.

---

### Task 4.4 — Implement `ProjectProposalController`

**File:** `SkillWeaver.API/Controllers/ProjectProposalController.cs`

**Endpoints:**
- `GET /api/projectproposal` — list all proposals
- `GET /api/projectproposal/{id}` — get single proposal
- `POST /api/projectproposal` — create proposal (with `RequiredSkills`)
- `GET /api/projectproposal/{id}/assemble-team` — **THE KEY ENDPOINT** — calls `TeamAssemblyService.AssembleTeamAsync(id)` and returns `SuggestedTeamDto`

**Done when:** `GET /api/projectproposal/{id}/assemble-team` returns a `SuggestedTeamDto`; test with a real proposal in the database.

---

### Task 4.5 — Add `GET /health` endpoint

```csharp
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));
```

**Done when:** `GET /health` returns `200 OK`.

---

### Task 4.6 — Manual API smoke test

Using Swagger UI or curl, run through the full happy path:
1. `GET /api/skill` — see seeded skills
2. `GET /api/employee` — see seeded employees
3. `POST /api/projectproposal` — create a proposal requiring Angular/Intermediate and .NET/Expert with 25% commitment
4. `GET /api/projectproposal/{id}/assemble-team` — verify only qualified, available employees appear

**Done when:** All four steps produce correct, expected data.

---

### Task 4.7 — Add FluentValidation for `CreateProjectProposalDto`

Install in API project: `dotnet add package FluentValidation.AspNetCore`

Create a validator that ensures:
- `Title` is not empty
- `RequiredCommitmentPercentage` is between 1 and 100
- `RequiredSkills` list has at least one item

**Done when:** `POST /api/projectproposal` with an empty title returns `400` with a validation error message.

---

### Task 4.8 — Verify full solution builds

```bash
dotnet build backend/SkillWeaver/SkillWeaver.sln
```

**Done when:** Zero errors across all four projects.

---

## Phase 5 — Angular Frontend Scaffolding
**Estimated time:** 2–3 hours | **Day 4**

> **Angular beginner guide — read this before coding.**
>
> Angular is a TypeScript framework for building single-page applications. Here is what you need to understand to work with this project:
>
> **Standalone components (Angular 17+):** In older Angular, every component had to be declared inside an `NgModule`. In modern Angular, components are "standalone" — they are self-contained and declare their own imports. This is the approach used here. You will see `standalone: true` in every component decorator.
>
> **Signals:** Angular Signals are a reactive primitive (like React's `useState` but better integrated). A signal holds a value and automatically notifies the template when it changes. You create one with `signal(initialValue)` and read it in templates as `mySignal()` (called like a function). You update it with `mySignal.set(newValue)`.
>
> **New control flow syntax (`@if`, `@for`):** Angular 17 replaced `*ngIf` and `*ngFor` directives with cleaner built-in syntax directly in templates. You will use `@if (condition) { ... }` and `@for (item of items; track item.id) { ... }`.
>
> **`app.config.ts` (no AppModule):** Modern Angular apps configure routing, HTTP, and other providers in `app.config.ts` instead of `AppModule`. This is what the `bootstrapApplication` function reads.
>
> **`app.routes.ts`:** All URL routes are defined here. Each route maps a URL path to a component.
>
> **Services and `HttpClient`:** Services are TypeScript classes decorated with `@Injectable`. They call the .NET API using Angular's `HttpClient`. You inject them into components using the `inject()` function (the modern approach) or constructor injection.
>
> **Folder structure used here:**
> - `core/services/` — services that call the API
> - `core/models/` — TypeScript interfaces matching your C# DTOs
> - `shared/components/` — reusable UI components (Navbar, etc.)
> - `features/` — one folder per domain feature (employees, skills, proposals)

---

### Task 5.1 — Scaffold Angular application

**Steps:**
```bash
cd skillweaver
npm install -g @angular/cli
ng new frontend --standalone --routing --style=css --skip-git
cd frontend
```

> When prompted: choose CSS for styles, yes for routing.

**Done when:** `ng serve` starts the dev server at `http://localhost:4200`.

---

### Task 5.2 — Install frontend dependencies

```bash
cd frontend
npm install
```

No extra UI library is required — we will use plain CSS for simplicity. If you want a component library, `ng add @angular/material` is the idiomatic Angular choice (optional).

**Done when:** `npm install` completes with no peer-dependency errors.

---

### Task 5.3 — Configure `environment.ts`

**File:** `src/environments/environment.development.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5047/api'
};
```

**File:** `src/environments/environment.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'  // relative — proxied in production
};
```

**Done when:** Both files exist; no TypeScript errors.

---

### Task 5.4 — Configure `app.config.ts`

**Goal:** Register `HttpClient` and the router — this is the Angular equivalent of `Program.cs`.

**File:** `src/app/app.config.ts`
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

> **What this means:** `provideRouter(routes)` enables navigation between pages. `provideHttpClient()` makes `HttpClient` available to inject in any service. Without registering these here, they don't exist in the app.

**Done when:** `ng build` succeeds; no "NullInjectorError" for HttpClient.

---

### Task 5.5 — Define TypeScript models

**Goal:** Mirror the C# DTOs as TypeScript interfaces so the compiler catches mismatches.

**File:** `src/app/core/models/skill.model.ts`
```typescript
export interface Skill {
  id: number;
  name: string;
  category?: string;
}
```

**File:** `src/app/core/models/employee.model.ts`
```typescript
import { Skill } from './skill.model';

export interface EmployeeSkill {
  skillId: number;
  skillName: string;
  proficiencyLevel: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  capacityPercentage: number;
  availableCapacity: number;
  skills: EmployeeSkill[];
}

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  capacityPercentage: number;
}
```

**File:** `src/app/core/models/project-proposal.model.ts`
```typescript
export interface RequiredSkill {
  skillId: number;
  skillName: string;
  minimumProficiency: string;
}

export interface ProjectProposal {
  id: number;
  title: string;
  description?: string;
  requiredCommitmentPercentage: number;
  createdAt: string;
  requiredSkills: RequiredSkill[];
}

export interface CreateProjectProposal {
  title: string;
  description?: string;
  requiredCommitmentPercentage: number;
  requiredSkills: { skillId: number; minimumProficiency: string }[];
}

export interface TeamMember {
  employeeId: number;
  fullName: string;
  email: string;
  department?: string;
  availableCapacity: number;
  matchedSkills: { skillId: number; skillName: string; proficiencyLevel: string }[];
}

export interface SuggestedTeam {
  projectProposalId: number;
  projectTitle: string;
  suggestedMembers: TeamMember[];
  totalCandidates: number;
}
```

**Done when:** All model files compile (`npx tsc --noEmit`); no red underlines in IDE.

---

### Task 5.6 — Create API services

**Goal:** Services are the Angular equivalent of repository classes — they talk to the backend.

**File:** `src/app/core/services/skill.service.ts`
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/skill`;

  getAll(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }
}
```

> **What `inject(HttpClient)` does:** This is the modern Angular way of dependency injection. It's equivalent to writing `constructor(private http: HttpClient) {}` but cleaner. The `inject()` function works in the constructor context of any Injectable class.

Create similarly: `employee.service.ts` (methods: `getAll`, `getById`, `create`, `updateCapacity`, `assignSkill`) and `project-proposal.service.ts` (methods: `getAll`, `create`, `assembleTeam(id)`).

**Done when:** All three service files compile; each has the correct return types matching the models.

---

### Task 5.7 — Create `NavbarComponent`

**File:** `src/app/shared/components/navbar/navbar.component.ts`

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {}
```

**File:** `src/app/shared/components/navbar/navbar.component.html`
```html
<nav>
  <a routerLink="/employees" routerLinkActive="active">Employees</a>
  <a routerLink="/skills" routerLinkActive="active">Skills</a>
  <a routerLink="/proposals" routerLinkActive="active">Proposals</a>
</nav>
```

> **`routerLink`:** Navigates to a route without a full page reload. **`routerLinkActive`:** Adds a CSS class when the current URL matches this link — used to highlight the active nav item.

**Done when:** Navbar renders; clicking links changes the URL.

---

### Task 5.8 — Configure `app.routes.ts`

**File:** `src/app/app.routes.ts`
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'employees',
    loadComponent: () => import('./features/employees/employee-list/employee-list.component')
      .then(m => m.EmployeeListComponent)
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/skills/skill-list/skill-list.component')
      .then(m => m.SkillListComponent)
  },
  {
    path: 'proposals',
    loadComponent: () => import('./features/proposals/proposal-form/proposal-form.component')
      .then(m => m.ProposalFormComponent)
  },
  {
    path: 'proposals/:id/team',
    loadComponent: () => import('./features/proposals/suggested-team/suggested-team.component')
      .then(m => m.SuggestedTeamComponent)
  }
];
```

> **`loadComponent` (lazy loading):** This loads the component code only when the user navigates to that route — it improves initial load time. The `import()` call returns a promise that resolves to the component module.

**Done when:** Navigating to `/employees`, `/skills`, `/proposals` loads the correct components (stubs are fine).

---

### Task 5.9 — Update `AppComponent`

**File:** `src/app/app.component.ts`
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
```

> **`<router-outlet>`:** This is a placeholder in the template where routed components render. When you navigate to `/employees`, Angular renders `EmployeeListComponent` inside this outlet.

**Done when:** App loads with Navbar visible; routing works for all four paths.

---

### Task 5.10 — Verify Angular build

```bash
ng build --configuration development
```

**Done when:** Build succeeds with zero errors; no TypeScript compilation errors.

---

## Phase 6 — Angular Features
**Estimated time:** 3–4 hours | **Day 4–5**

---

### Task 6.1 — Implement `EmployeeListComponent`

**File:** `src/app/features/employees/employee-list/employee-list.component.ts`

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.employeeService.getAll().subscribe({
      next: (data) => { this.employees.set(data); this.isLoading.set(false); },
      error: (err) => { this.error.set('Failed to load employees'); this.isLoading.set(false); }
    });
  }
}
```

**File:** `src/app/features/employees/employee-list/employee-list.component.html`
```html
@if (isLoading()) {
  <p>Loading employees...</p>
}
@if (error()) {
  <p class="error">{{ error() }}</p>
}
@for (employee of employees(); track employee.id) {
  <div class="employee-card">
    <h3>{{ employee.firstName }} {{ employee.lastName }}</h3>
    <p>{{ employee.email }}</p>
    <p>Available capacity: {{ employee.availableCapacity }}%</p>
    <p>Skills: {{ employee.skills.length }}</p>
  </div>
}
```

> **Why signals here?** `signal()` creates reactive state. When `employees.set(data)` is called, Angular automatically re-renders only the parts of the template that depend on `employees()`. This is more efficient than the older `ChangeDetectionStrategy.OnPush` approach.

**Done when:** `/employees` page shows employee cards populated from the API.

---

### Task 6.2 — Implement `SkillListComponent`

Similar pattern to `EmployeeListComponent`. Display a simple table or card grid of all skills from `GET /api/skill`.

**Done when:** `/skills` shows all seeded skills.

---

### Task 6.3 — Implement `ProposalFormComponent`

**Goal:** A form that lets a manager create a Project Proposal with required skills.

**File:** `src/app/features/proposals/proposal-form/proposal-form.component.ts`

Key logic:
- On init, load all available skills via `SkillService.getAll()` to populate the skill selector
- Maintain a `requiredSkills` signal (array of `{ skillId, minimumProficiency }`)
- Add/remove skills to the list before submitting
- On submit, call `ProjectProposalService.create(dto)`, then navigate to `/proposals/{id}/team`

Use Angular's reactive forms approach (`FormBuilder`, `FormGroup`) or template-driven forms — both are acceptable. Template-driven (`ngModel`) is simpler for beginners.

**Done when:** Submitting the form creates a proposal in the database and navigates to the team assembly result page.

---

### Task 6.4 — Implement `SuggestedTeamComponent`

**Goal:** Display the team assembly result for a given proposal.

**File:** `src/app/features/proposals/suggested-team/suggested-team.component.ts`

Key logic:
- Read the proposal ID from the URL using `ActivatedRoute` and `inject(ActivatedRoute)`
- Call `ProjectProposalService.assembleTeam(id)` on init
- Display each `TeamMember` with their matched skills and available capacity

**File:** `src/app/features/proposals/suggested-team/suggested-team.component.html`
```html
@if (suggestedTeam()) {
  <h2>Suggested Team for {{ suggestedTeam()!.projectTitle }}</h2>
  <p>{{ suggestedTeam()!.totalCandidates }} candidates found</p>

  @for (member of suggestedTeam()!.suggestedMembers; track member.employeeId) {
    <div class="member-card">
      <h3>{{ member.fullName }}</h3>
      <p>Available: {{ member.availableCapacity }}%</p>
      @for (skill of member.matchedSkills; track skill.skillId) {
        <span>{{ skill.skillName }} ({{ skill.proficiencyLevel }})</span>
      }
    </div>
  }
}
```

**Done when:** Navigating to `/proposals/{id}/team` shows the correct team assembly result.

---

### Task 6.5 — Add basic CSS styling

Create `src/styles.css` with minimal, clean styles:
- Card grid layout for employee and team member cards
- Capacity bar (a colored `<div>` whose width is `{availableCapacity}%`)
- Navbar link styling with active state

**Done when:** UI is presentable for demoing; no layout breaks.

---

### Task 6.6 — End-to-end manual test of the full user journey

Run both servers:
```bash
# Terminal 1 — backend
cd backend/SkillWeaver/SkillWeaver.API && dotnet run

# Terminal 2 — frontend
cd frontend && ng serve
```

Walk through the complete flow:
1. Open `http://localhost:4200` → redirected to `/employees`
2. View employee list with capacity percentages
3. Navigate to Skills → see skill list
4. Navigate to Proposals → create a new proposal with 2 required skills and 30% commitment
5. Observe redirect to `/proposals/{id}/team`
6. Verify only employees with matching skills AND ≥ 70% free capacity appear

**Done when:** All 6 steps complete without errors in browser console.

---

## Phase 7 — Playwright Setup & Page Object Models
**Estimated time:** 2–3 hours | **Day 5–6**

> **How Playwright works in this project:**
> Playwright is a browser automation and API testing framework. We initialize it as a completely separate project in `e2e-tests/`. It has its own `package.json`, its own config, and its own test runner.
>
> **Three agent types used:**
> - **Planner agent:** Given a feature description, produces a `spec.md` file outlining what to test and how.
> - **Generator agent:** Reads a `spec.md` and generates the actual TypeScript test code.
> - **Healer agent:** When a test fails (e.g. a locator broke because the HTML changed), the Healer diagnoses and fixes it automatically.
>
> **`@playwright/cli`** (`playwright-cli`) is used to inspect live pages and build Page Object Models. It is NOT the same as `playwright codegen` (which records mouse clicks and generates test scripts). Instead, `playwright-cli` runs a persistent browser daemon and after each command outputs a **snapshot YAML file** — an accessibility tree of the current page with short element refs (e.g. `e21`). Claude Code reads this snapshot to understand the real element structure (roles, labels, test IDs) and writes stable POM locators from it. This approach is token-efficient because the snapshot is compact and structured, unlike a full DOM dump.
>
> **Workflow:** `playwright-cli open <url>` → `playwright-cli snapshot` → read `.playwright-cli/*.yml` → extract element info → write POM class.

---

### Task 7.1 — Initialize Playwright project

```bash
cd e2e-tests
npm init playwright@latest
```

When prompted:
- Language: TypeScript
- Test directory: `tests`
- GitHub Actions workflow: No (we'll create it manually)
- Install browsers: Yes

**Done when:** `npx playwright test` runs and shows zero tests (no spec files yet).

---

### Task 7.2 — Configure `playwright.config.ts`

**File:** `e2e-tests/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
```

**File:** `e2e-tests/.env` (gitignored)
```
BASE_URL=http://localhost:4200
API_URL=http://localhost:5047
```

**Done when:** `npx playwright test` runs with zero errors (zero tests is fine).

---

### Task 7.3 — Create test utilities and fixtures

**File:** `e2e-tests/tests/utils/apiHelpers.ts`
```typescript
import { APIRequestContext } from '@playwright/test';

export async function createTestEmployee(request: APIRequestContext, data: object) {
  const res = await request.post('http://localhost:5047/api/employee', { data });
  return res.json();
}

export async function createTestProposal(request: APIRequestContext, data: object) {
  const res = await request.post('http://localhost:5047/api/projectproposal', { data });
  return res.json();
}

export async function createTestSkill(request: APIRequestContext, data: object) {
  const res = await request.post('http://localhost:5047/api/skill', { data });
  return res.json();
}
```

**File:** `e2e-tests/tests/utils/testData.ts`
```typescript
export const testEmployee = {
  firstName: 'Test',
  lastName: 'User',
  email: `testuser_${Date.now()}@skillweaver.test`,
  department: 'Engineering',
  capacityPercentage: 40  // 60% available
};

export const testSkill = {
  name: `TestSkill_${Date.now()}`,
  category: 'Testing'
};

export const testProposal = (skillId: number) => ({
  title: `Test Project ${Date.now()}`,
  description: 'Automated test proposal',
  requiredCommitmentPercentage: 30,
  requiredSkills: [{ skillId, minimumProficiency: 'Beginner' }]
});
```

**Done when:** Both utility files compile; no TypeScript errors.

---

### Task 7.4 — Build POMs with `@playwright/cli` snapshots

Use `@playwright/cli` to inspect the live app and extract real element structure for each POM.

**Step 1 — Install `@playwright/cli` globally (once):**
```bash
npm install -g @playwright/cli
```

**Step 2 — Start both servers** (backend on :5047, frontend on :4200).

**Step 3 — For each page, open it and take a snapshot:**
```bash
playwright-cli open http://localhost:4200/employees
playwright-cli snapshot
# Read the generated .playwright-cli/*.yml — it contains the accessibility tree
# with element roles, labels, and short refs (e.g. ref=e12)

playwright-cli open http://localhost:4200/skills
playwright-cli snapshot

playwright-cli open http://localhost:4200/proposals
playwright-cli snapshot
```

**Step 4 — Hand the snapshot to Claude Code.**
Claude reads the YAML, identifies element roles/labels/`data-testid` attributes, and writes each POM class with locators derived from the real accessibility tree — not guessed CSS selectors.

**Step 5 — Claude writes the POM files.** Each POM exposes typed locators and helper methods. Example output for `/employees`:

**File:** `e2e-tests/tests/page-objects/pages/EmployeesPage.ts`
```typescript
import { Page, Locator } from '@playwright/test';

export class EmployeesPage {
  readonly page: Page;
  readonly employeeCards: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeCards = page.locator('.employee-card');
    this.heading = page.locator('h2').first();
  }

  async goto() {
    await this.page.goto('/employees');
  }

  async getEmployeeCount(): Promise<number> {
    return this.employeeCards.count();
  }
}
```

> **Why this beats codegen:** `playwright-cli snapshot` gives the accessibility tree — semantic roles and labels — without recording any interactions. The resulting POM locators target roles and `data-testid` attributes rather than brittle CSS paths, so they survive HTML restructuring.

Create similarly: `SkillsPage.ts`, `ProposalFormPage.ts`, `SuggestedTeamPage.ts`, `Navbar.ts`.

**Done when:** All POM files compile; locators are derived from real snapshot output, not guessed.

---

### Task 7.5 — Add `package.json` scripts

**File:** `e2e-tests/package.json` — add to `scripts`:
```json
{
  "scripts": {
    "test": "playwright test",
    "test:api": "playwright test tests/api/",
    "test:integration": "playwright test tests/integration/",
    "test:e2e": "playwright test tests/e2e/",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report"
  }
}
```

**Done when:** `npm run test:api` runs (zero tests is fine); `npm run report` opens HTML report.

---

## Phase 8 — API & Integration Tests
**Estimated time:** 3–4 hours | **Day 6**

> **Playwright Agents workflow — how it works:**
>
> Playwright ships three AI agents that cover the full test lifecycle. Run them via your AI tool (Claude Code in this project). Initialize once, then use the three-agent loop for every test area:
>
> **Step 0 — Initialize agents (once per project):**
> ```bash
> cd e2e-tests
> npx playwright init-agents --loop=claude
> ```
> This writes agent definitions into `.github/` — regenerate whenever Playwright updates.
>
> **The three-agent loop (repeat for each test area):**
>
> 1. **🎭 Planner** — Tell it what to test in plain English. It explores the API (using the seed test for context), then writes a structured Markdown plan to `e2e-tests/specs/`. You trigger it by describing the scenario: _"Generate a plan for testing the Skills API: list all skills, create a skill, retrieve by ID."_
>
> 2. **🎭 Generator** — Point it at the plan file. It reads `specs/<plan>.md`, verifies each assertion against the live API, and writes the final test file to `tests/`. You trigger it by referencing the spec: _"Generate tests from specs/skills-api.md"._
>
> 3. **🎭 Healer** — When a test fails (e.g. after an API contract change), tell it the failing test name. It replays the steps, inspects what changed, patches locators/assertions, and re-runs until passing.
>
> **File layout produced by agents:**
> ```
> .github/                        ← agent definitions (from init-agents, at repo root)
> e2e-tests/
>   specs/                        ← Planner output (Markdown plans)
>     skills-api.md
>     employees-api.md
>     proposals-api.md
>     team-assembly.md
>     employee-skills.md
>   tests/
>     seed.spec.ts                ← YOU write this (API bootstrap)
>     api/                        ← Generator output
>       skills.api.spec.ts
>       employees.api.spec.ts
>       proposals.api.spec.ts
>     integration/                ← Generator output
>       team-assembly.integration.spec.ts
>       employee-skills.integration.spec.ts
> ```
>
> For API tests, Playwright's `request` fixture is used — no browser is launched.

---

### Task 8.0 — Initialize Playwright agents

**Goal:** Write agent definitions into the root `.github/` directory so Claude Code (invoked from repo root) can find and invoke the Planner, Generator, and Healer agents.

**Steps:**
```bash
# Run from repo root — NOT from e2e-tests/
# This puts agent definitions in /.github/ where Claude Code can discover them
npx playwright init-agents --loop=claude
```

> **Why root, not `e2e-tests/`:** Claude Code is launched from the repo root, so it discovers agent definitions from the root `.github/` folder. Running `init-agents` inside `e2e-tests/` would place definitions there, where Claude won't find them.

**Done when:** Agent definition files appear in `.claude/agents/` at the repo root (`playwright-test-planner.md`, `playwright-test-generator.md`, `playwright-test-healer.md`). A `seed.spec.ts` is also created at repo root — it will be moved in Task 8.1.

> **Note:** `--loop=claude` places definitions in `.claude/agents/`, not `.github/`. That is correct — Claude Code discovers agents from `.claude/agents/`.

---

### Task 8.1 — Move and fill in the seed test

**Goal:** The Planner agent uses the seed test to understand how the API is initialized, what fixtures are available, and what request context to use. Without it the Planner has no execution template.

**Step 1 — Move it into the correct location:**
```bash
mv seed.spec.ts e2e-tests/tests/seed.spec.ts
```

**Step 2 — Replace its contents:**

**File:** `e2e-tests/tests/seed.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

const API = process.env['API_URL'] ?? 'http://localhost:5047';

test('seed — API is reachable', async ({ request }) => {
  const res = await request.get(`${API}/health`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
});
```

> **Why this matters:** The Planner runs the seed test first to verify the environment is ready, then uses it as a template for the tests it plans. The `API_URL` env var lets CI override the default without touching test code.

**Done when:** `npx playwright test tests/seed.spec.ts` passes.

---

### Task 8.2 — Plan and generate Skills API tests

**Planner prompt (give this to the Planner agent):**
> "Generate a test plan for the SkillWeaver Skills API at `http://localhost:5047/api/skill`. Cover: GET all skills returns a non-empty array with 200; POST creates a skill and returns 201 with an `id`; GET by ID returns the correct skill. Use the seed test for environment setup."

**Planner output:** `e2e-tests/specs/skills-api.md`

**Generator prompt (give this to the Generator agent):**
> "Generate tests from `specs/skills-api.md`."

**Generator output:** `e2e-tests/tests/api/skills.api.spec.ts`

**Done when:** All three skills API tests pass (`npm run test:api`).

---

### Task 8.3 — Plan and generate Employees API tests

**Planner prompt:**
> "Generate a test plan for the SkillWeaver Employees API at `http://localhost:5047/api/employee`. Cover: GET all returns array; POST creates with 201; GET by ID returns correct employee; PATCH `/capacity` updates the employee's `capacityPercentage`; POST `/{id}/skills` assigns a skill. Use the seed test for environment setup."

**Planner output:** `e2e-tests/specs/employees-api.md`

**Generator prompt:**
> "Generate tests from `specs/employees-api.md`."

**Generator output:** `e2e-tests/tests/api/employees.api.spec.ts`

**Done when:** All five employee API tests pass.

---

### Task 8.4 — Plan and generate Project Proposals API tests

**Planner prompt:**
> "Generate a test plan for the SkillWeaver Project Proposals API at `http://localhost:5047/api/projectproposal`. Cover: POST creates a proposal with required skills and returns 201; GET by ID returns the full proposal including its skills list; POST with an empty title returns 400 (FluentValidation); GET `/{id}/assemble-team` returns a `SuggestedTeamDto` object with `suggestedMembers` array. Use the seed test for environment setup."

**Planner output:** `e2e-tests/specs/proposals-api.md`

**Generator prompt:**
> "Generate tests from `specs/proposals-api.md`."

**Generator output:** `e2e-tests/tests/api/proposals.api.spec.ts`

**Done when:** All four proposal API tests pass.

---

### Task 8.5 — Plan and generate Team Assembly integration tests

**Goal:** Test the core matching algorithm against the real database — no mocks.

**Planner prompt:**
> "Generate an integration test plan for the SkillWeaver Team Assembly algorithm. Three scenarios:
> 1. A qualified employee (has the required skill at or above minimum proficiency AND has enough available capacity) must appear in `suggestedMembers`.
> 2. An overbooked employee (available capacity < required commitment) must NOT appear.
> 3. An employee whose skill proficiency is below the minimum must NOT appear.
> Each scenario should create its own isolated skill, employee, and proposal via the API to avoid test pollution. Use `http://localhost:5047` as the base URL."

**Planner output:** `e2e-tests/specs/team-assembly.md`

**Generator prompt:**
> "Generate tests from `specs/team-assembly.md`."

**Generator output:** `e2e-tests/tests/integration/team-assembly.integration.spec.ts`

**Done when:** All three integration tests pass; both exclusion cases are verified negative.

---

### Task 8.6 — Plan and generate Employee-Skill integration tests

**Planner prompt:**
> "Generate an integration test plan for employee-skill assignment edge cases in SkillWeaver. Cover: assigning the same skill twice to the same employee does not create duplicate rows (second call either succeeds idempotently or returns a conflict); a freshly created employee with no skills assigned returns an empty `skills` array; updating an employee's capacity via PATCH and then re-fetching with GET reflects the new `availableCapacity`. Use `http://localhost:5047` as the base URL."

**Planner output:** `e2e-tests/specs/employee-skills.md`

**Generator prompt:**
> "Generate tests from `specs/employee-skills.md`."

**Generator output:** `e2e-tests/tests/integration/employee-skills.integration.spec.ts`

**Done when:** All three edge-case tests pass.

---

### Task 8.7 — Heal any failing tests

If any generated test fails after initial generation (selector mismatch, wrong status code assumption, timing issue), invoke the Healer:

**Healer prompt:**
> "Heal the failing test `<test name from the failure output>`."

The Healer replays the failing steps against the live API, inspects the actual response shape, patches the assertion or request body, and re-runs until the test passes.

**Done when:** `npm test` shows zero failures across two consecutive runs.

---

## Phase 9 — E2E Journey Tests
**Estimated time:** 2–3 hours | **Day 6–7**

> **E2E tests use the same Planner → Generator → Healer loop as Phase 8**, but now both `page` (browser) and `request` (API) fixtures are in play. The Planner needs the POMs from Phase 7 as context — reference them in your prompt so it can use their locators. The Generator verifies assertions live in a real browser against the running Angular app.
>
> **Key difference from API tests:** The Planner explores the live UI (not just HTTP responses), so both servers must be running (`dotnet run` + `ng serve`) before invoking it.

---

### Task 9.1 — Plan and generate employee management journey

**Both servers must be running** before invoking the Planner.

**Planner prompt:**
> "Generate an E2E test plan for the employee management journey in SkillWeaver (Angular app at `http://localhost:4200`). Use the `EmployeesPage` POM from `tests/page-objects/pages/EmployeesPage.ts` and the `Navbar` POM from `tests/page-objects/components/Navbar.ts`. Cover: navigating to `/employees` shows a list of employee cards with at least one entry; each card displays the employee's name and available capacity; clicking the Skills nav link navigates to `/skills`. Use the seed test for browser environment setup."
**Planner output:** `e2e-tests/specs/employee-journey.md`

**Generator prompt:**
> "Generate tests from `specs/employee-journey.md`."

**Generator output:** `e2e-tests/tests/e2e/employee-management.journey.spec.ts`

**Done when:** Both journey tests pass in Chromium.

---

### Task 9.2 — Plan and generate the golden-path team assembly journey

**Planner prompt:**
> "Generate an E2E test plan for the full team assembly journey in SkillWeaver. This is the golden path a manager follows:
> 1. Seed a skill and a qualified employee via the API (`http://localhost:5047`) before the browser steps.
> 2. Navigate to `/proposals` and fill in the proposal form (`data-testid='proposal-title'`, `data-testid='commitment-percentage'`), select the seeded skill and a proficiency, and submit.
> 3. Assert the browser redirects to `/proposals/{id}/team`.
> 4. Assert the seeded employee's name appears in a `.member-card` element.
> Use the `ProposalFormPage` POM and `SuggestedTeamPage` POM. Use the seed test for setup."

**Planner output:** `e2e-tests/specs/team-assembly-journey.md`

**Generator prompt:**
> "Generate tests from `specs/team-assembly-journey.md`."

**Generator output:** `e2e-tests/tests/e2e/team-assembly.journey.spec.ts`

> **Prerequisite:** Add `data-testid` attributes to the proposal form HTML elements in Angular before running the Generator — otherwise it will produce brittle CSS selectors. Minimum required: `data-testid="proposal-title"`, `data-testid="commitment-percentage"`, `data-testid="submit-proposal"`.

**Done when:** The golden path E2E test passes end-to-end in a real browser.

---

### Task 9.3 — Run full test suite and heal failures

```bash
cd e2e-tests
npm test
```

Review the HTML report (`npm run report`). For any failing test, invoke the Healer:

**Healer prompt:**
> "Heal the failing test `<paste test name from failure output>`."

The Healer replays the failing steps in a live browser, inspects the current DOM/API response, patches the broken locator or assertion, and re-runs until passing. If the functionality itself is broken (not just the test), it marks the test as skipped with a clear comment.

**Done when:** All tests pass consistently across two consecutive `npm test` runs.

---

## Phase 10 — CI/CD (GitHub Actions)
**Estimated time:** 1–2 hours | **Day 7**

---

### Task 10.1 — Create `ci.yml`

**File:** `.github/workflows/ci.yml`

```yaml
name: SkillWeaver CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    name: .NET Build & Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: skillweaver_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - name: Restore dependencies
        run: dotnet restore backend/SkillWeaver/SkillWeaver.sln
      - name: Build
        run: dotnet build backend/SkillWeaver/SkillWeaver.sln --no-restore --configuration Release
      - name: Apply migrations & run API (background)
        run: |
          cd backend/SkillWeaver/SkillWeaver.API
          cat > appsettings.Development.json << 'EOF'
          {
            "ConnectionStrings": {
              "DefaultConnection": "Host=localhost;Port=5432;Database=skillweaver_test;Username=postgres;Password=postgres"
            },
            "AllowedOrigins": ["http://localhost:4200"]
          }
          EOF
          dotnet ef database update --project ../SkillWeaver.Infrastructure --startup-project .
          dotnet run --no-build &
          sleep 8

  frontend:
    name: Angular Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install & build
        run: |
          cd frontend
          npm ci
          npx ng build --configuration production

  e2e:
    name: Playwright Tests
    runs-on: ubuntu-latest
    needs: [backend, frontend]
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: skillweaver_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Start backend
        run: |
          cd backend/SkillWeaver/SkillWeaver.API
          cat > appsettings.Development.json << 'EOF'
          {
            "ConnectionStrings": {
              "DefaultConnection": "Host=localhost;Port=5432;Database=skillweaver_test;Username=postgres;Password=postgres"
            },
            "AllowedOrigins": ["http://localhost:4200"]
          }
          EOF
          dotnet ef database update --project ../SkillWeaver.Infrastructure --startup-project .
          dotnet run &
          sleep 8
      - name: Start frontend
        run: |
          cd frontend
          npm ci
          npx ng serve --configuration development &
          sleep 15
      - name: Install Playwright browsers
        run: |
          cd e2e-tests
          npm ci
          npx playwright install --with-deps chromium
      - name: Run Playwright tests
        run: |
          cd e2e-tests
          npm test
        env:
          BASE_URL: http://localhost:4200
          API_URL: http://localhost:5047
          CI: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: e2e-tests/playwright-report/
          retention-days: 14
```

**Done when:** File exists and is committed to `.github/workflows/ci.yml`.

---

### Task 10.2 — Push to GitHub and verify CI

**Steps:**
1. Create a GitHub repository: `https://github.com/new`
2. Push the full codebase:
```bash
git remote add origin https://github.com/{your-username}/skillweaver.git
git add .
git commit -m "feat: complete SkillWeaver implementation"
git push -u origin main
```
3. Navigate to the **Actions** tab on GitHub
4. Watch the `SkillWeaver CI` workflow run

**Done when:** All three jobs (backend, frontend, e2e) show green checkmarks ✅.

---

### Task 10.3 — Fix any CI failures

Common issues and fixes:
- **EF migration fails on CI:** Ensure the `dotnet ef` tool is installed (`dotnet tool install -g dotnet-ef`)
- **Angular serve not ready in time:** Increase the `sleep 15` to `sleep 25`
- **Playwright tests time out:** Increase `timeout` in `playwright.config.ts` to `60000`
- **CORS error in tests:** Verify `AllowedOrigins` includes `http://localhost:4200`

**Done when:** Two consecutive CI runs pass with zero failures.

---

### Task 10.4 — Document test metrics

Create `e2e-tests/README.md` with:
- Total test count by category (API / Integration / E2E)
- How to run tests locally
- How to regenerate POMs after a UI change: `playwright-cli open http://localhost:4200/{page}` then `playwright-cli snapshot` — hand the snapshot YAML to Claude Code to rewrite affected locators
- How to invoke the Healer agent after a failure
- How to view the HTML report: `npm run report`

**Done when:** A new developer can read this file and run the full suite independently.

---

### Task 10.5 — Final commit and tag

```bash
git add .
git commit -m "chore: complete CI pipeline, all tests passing"
git tag v1.0.0
git push origin main --tags
```

**Done when:** Clean commit on `main` tagged `v1.0.0`; GitHub Actions shows green on the tagged commit.

---

## Appendix A — Environment Variables Reference

| Variable | File | Required | Description |
|---|---|---|---|
| `ConnectionStrings__DefaultConnection` | `appsettings.Development.json` | Yes | PostgreSQL connection string |
| `AllowedOrigins` | `appsettings.Development.json` | Yes | Angular dev server origin (`http://localhost:4200`) |
| `BASE_URL` | `e2e-tests/.env` | No | Frontend URL, defaults to `http://localhost:4200` |
| `API_URL` | `e2e-tests/.env` | No | Backend URL, defaults to `http://localhost:5047` |

---

## Appendix B — Key Commands Reference

```bash
# Backend
cd backend/SkillWeaver/SkillWeaver.API
dotnet run                              # start API on :5047
dotnet build ../SkillWeaver.sln         # build entire solution

# EF Core Migrations
dotnet ef migrations add {Name} --project ../SkillWeaver.Infrastructure --startup-project .
dotnet ef database update --project ../SkillWeaver.Infrastructure --startup-project .
dotnet ef database drop --project ../SkillWeaver.Infrastructure --startup-project .

# Frontend
cd frontend
ng serve                                # dev server on :4200
ng build --configuration production     # production build
npx tsc --noEmit                        # type-check only

# E2E Tests
cd e2e-tests
npm test                                # all tests, headless
npm run test:api                        # API-only
npm run test:integration                # integration only
npm run test:e2e                        # E2E journeys only
npm run test:headed                     # watch browser live
npm run test:ui                         # Playwright UI mode
npm run report                          # open HTML report

# POM inspection (playwright-cli)
playwright-cli open http://localhost:4200/{page}
playwright-cli snapshot   # outputs accessibility tree to .playwright-cli/*.yml
```

---

## Appendix C — Clean Architecture Dependency Flow

```
SkillWeaver.API
    ↓ depends on
SkillWeaver.Application   (services/, dtos/, interfaces/)
    ↓ depends on
SkillWeaver.Domain        (Entities/, Enums/)

SkillWeaver.Infrastructure
    ↓ depends on
SkillWeaver.Application   (implements interfaces/)
SkillWeaver.Domain        (maps entities)
```

> **The golden rule:** Arrows point inward. Outer layers know about inner layers. Inner layers know nothing about outer layers. Domain knows nothing about anyone.

---

## Appendix D — Naming Convention Cheat Sheet

| Type | Pattern | Example |
|---|---|---|
| Entity | `{Name}Entity.cs` | `EmployeeEntity.cs` |
| Service | `{Name}Service.cs` | `TeamAssemblyService.cs` |
| Repository | `{Name}Repository.cs` | `EmployeeRepository.cs` |
| Controller | `{Name}Controller.cs` | `ProjectProposalController.cs` |
| DTO | `{Name}Dto.cs` | `SuggestedTeamDto.cs` |
| Interface | `I{Name}Service.cs` / `I{Name}Repository.cs` | `ITeamAssemblyService.cs` |
| Enum | `{Name}.cs` (in `Enums/`) | `ProficiencyLevel.cs` |

---

*End of SkillWeaver Master Implementation Plan — v1.0*
