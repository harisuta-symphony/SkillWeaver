# SkillWeaver

> Enterprise Team Assembly Engine — mathematically match employee skills and capacity to project demands.

---

## Tech Stack

| Layer | Technology | Key Libraries |
|---|---|---|
| Backend API | .NET 8, ASP.NET Core, C# | Entity Framework Core, AutoMapper, FluentValidation, Swagger |
| Database | PostgreSQL | EF Core Migrations, Npgsql |
| Frontend | Angular 17+, TypeScript | Angular Signals, Standalone Components, HttpClient, Router |
| Tests | Playwright, TypeScript | @playwright/test, Page Object Models |
| CI/CD | GitHub Actions | dotnet CLI, npm CI, Playwright |

---

## Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/)

### Backend

```bash
cd backend/SkillWeaver/SkillWeaver.API
# Copy and fill in connection string
cp appsettings.Development.json.example appsettings.Development.json
# Apply migrations and start
dotnet ef database update --project ../SkillWeaver.Infrastructure --startup-project .
dotnet run
# API available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

### Frontend

```bash
cd frontend
npm install
ng serve
# App available at http://localhost:4200
```

### E2E Tests

```bash
cd e2e-tests
npm install
npx playwright install chromium
npm test               # all tests, headless
npm run test:api       # API tests only
npm run test:e2e       # browser journey tests only
npm run report         # open HTML report
```

---

## Architecture

SkillWeaver follows **Clean Architecture** with four layers. Dependencies always point inward — outer layers know about inner layers, never the reverse.

- **Domain** — plain C# entities and enums; no dependencies on anything.
- **Application** — business logic and the Team Assembly algorithm; depends only on Domain; defines repository interfaces that Infrastructure must implement.
- **Infrastructure** — EF Core, PostgreSQL, and repository implementations; depends on Application and Domain.
- **API** — ASP.NET Core controllers; thin layer that receives HTTP requests, delegates to Application services, and returns responses.

```
API  →  Application  →  Domain
         ↑
   Infrastructure
```

---

## Sub-workspace READMEs

- [Backend](backend/SkillWeaver/README.md)
- [Frontend](frontend/README.md)
- [E2E Tests](e2e-tests/README.md)
