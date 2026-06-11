# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillWeaver is a team assembly tool that matches employees to project requirements based on skills and capacity. The core business problem: given a project's required skills and proficiency thresholds, find which employees have the skills and available capacity to be assigned.

## Build & Run

```bash
# First-time setup
cp backend/SkillWeaver.API/appsettings.Development.json.example backend/SkillWeaver.API/appsettings.Development.json
# Fill in the Supabase connection string

# Apply migrations
cd backend/SkillWeaver.API
dotnet ef database update --project ../SkillWeaver.Infrastructure --startup-project .

# Run the API (http://localhost:5000, Swagger at /swagger)
dotnet run
```

Solution file: `backend/SkillWeaver/SkillWeaver.slnx`

## Architecture

Clean Architecture with strict inward dependency flow. The domain layer has zero dependencies; everything else depends only on layers further inward.

```
API → Application → Domain
Infrastructure → Domain (via Application interfaces)
```

**Domain** (`SkillWeaver.Domain`) — Pure entities and enums. No framework dependencies.
- `EmployeeEntity`, `SkillEntity`, `EmployeeSkillEntity`, `ProjectProposalEntity`, `ProjectRequiredSkillEntity`
- `ProficiencyLevel` enum (stored as string in DB)

**Application** (`SkillWeaver.Application`) — Business logic, DTOs, repository interfaces, AutoMapper profiles.
- `TeamAssemblyService` is the core algorithm: filters employees by skill coverage (must have ALL required skills at or above threshold proficiency) then by available capacity.
- `EmployeeService`, `SkillService`, `ProjectProposalService` handle CRUD.
- Repository interfaces live in `interfaces/`; implementations are in Infrastructure.

**Infrastructure** (`SkillWeaver.Infrastructure`) — EF Core 10 + Npgsql targeting PostgreSQL (Supabase).
- `SkillWeaverDbContext` with unique constraints: employee email, skill name, (EmployeeId, SkillId) composite.
- Single migration: `20260611133750_InitialCreate`.

**API** (`SkillWeaver.API`) — ASP.NET Core 10. Currently minimal — `Program.cs` wires up DI and DbContext. Controllers not yet implemented.

## Tech Stack

- .NET 10 / C# across all projects
- AutoMapper 16, FluentValidation 12
- EF Core 10 + Npgsql 10 for PostgreSQL
- `Nullable` reference types enabled everywhere
- Frontend (Angular 17+) and E2E (Playwright) directories exist but are not yet implemented

## Current State

The domain, application, and infrastructure layers are complete. What remains:
- API controllers to expose endpoints over HTTP
- Angular frontend (`frontend/`)
- Playwright E2E tests (`e2e/`)
- GitHub Actions CI/CD

## Database

Hosted on Supabase (PostgreSQL 15+). Connection string goes in `appsettings.Development.json` under `ConnectionStrings:DefaultConnection`. SSL mode is required. `AllowedOrigins` should include `http://localhost:4200` for local Angular dev.
