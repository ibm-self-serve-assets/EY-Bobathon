# IBM Bob Hands-on Lab: .NET Framework 4.8 → .NET 8 Minimal API

**Duration:** ~40 minutes &nbsp;|&nbsp; **Level:** Intermediate–Advanced &nbsp;|&nbsp; **Prerequisites:** .NET 8 SDK, IBM Bob, basic C# / ASP.NET knowledge

A complete hands-on lab that demonstrates how **IBM Bob** powers the full software delivery lifecycle for a real-world .NET modernisation — using an EY-relevant **tax management API** as the subject application.

---

## What This Lab Is About

The lab starts with a working **legacy tax portal** built on .NET Framework 4.8 and ASP.NET Web API. Over five structured phases Bob guides you through analyzing, migrating, reviewing, testing, and documenting the application — transforming it into a modern **.NET 8 Minimal API** that runs cross-platform, ships with Swagger, a DI container, and a full integration test suite.

### The Application — LegacyTaxPortal

A RESTful tax management API that handles the full lifecycle of a tax filing for a simplified government portal. It covers five domain areas:

| Domain | Controller | Key Operations |
|---|---|---|
| **Dashboard** | `DashboardController` | Aggregate summary — total filings, pending reviews, high-risk count, revenue |
| **Taxpayers** | `TaxPayersController` | Register taxpayers, list all, retrieve by ID |
| **Tax Filings** | `TaxFilingsController` | Create, validate, list, get, delete filings; calculate tax; update review status; assign reviewer |
| **Tax Documents** | `TaxDocumentsController` | Attach and list supporting document metadata per filing |
| **Audit Events** | `AuditController` | Full compliance audit trail of all actions |

The application includes a built-in **tax calculation engine** (`TaxCalculationService`) with tiered marginal tax rates and a risk-banding model (High / Medium / Low) that drives review recommendations for compliance officers.

### All API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Dashboard aggregate metrics |
| GET | `/api/taxpayers` | List all taxpayers |
| GET | `/api/taxpayers/{id}` | Get taxpayer by ID |
| POST | `/api/taxpayers` | Register a new taxpayer |
| GET | `/api/taxfilings` | List all tax filings |
| GET | `/api/taxfilings/{id}` | Get tax filing by ID |
| POST | `/api/taxfilings` | Create a new tax filing |
| GET | `/api/taxfilings/{id}/calculation` | Run tax calculation for a filing |
| PUT | `/api/taxfilings/{id}/status` | Update review status |
| PUT | `/api/taxfilings/{id}/reviewer` | Assign a reviewer |
| DELETE | `/api/taxfilings/{id}` | Delete a tax filing |
| GET | `/api/taxfilings/{filingId}/documents` | List documents for a filing |
| POST | `/api/taxfilings/{filingId}/documents` | Attach a document to a filing |
| GET | `/api/audit` | List all audit events |

---

## The Migration Goal

| Aspect | Legacy (.NET Framework 4.8) | Modern (.NET 8 Minimal API) |
|---|---|---|
| Runtime | Windows-only, IIS-hosted | Cross-platform — Linux, macOS, Windows, Docker |
| API Style | `ApiController` + `IHttpActionResult` | Minimal API — `MapGroup` / `MapGet/Post/Put/Delete` |
| Startup | `Global.asax` + `WebApiConfig.cs` | Single `Program.cs` |
| Configuration | `Web.config` (XML) | `appsettings.json` |
| Dependency Injection | None — `new Service()` directly in controllers | Built-in DI container via `builder.Services` |
| API Documentation | None | Swagger / OpenAPI at `/swagger` |
| Automated Tests | None | xUnit integration test suite via `WebApplicationFactory` |
| Package Format | `packages.config` (non-SDK) | SDK-style `<PackageReference>` |

---

## The Five SDLC Phases

```
Phase 1 — ANALYZE    Prompt 01  Bob reads legacy code, maps risks, produces a migration blueprint
Phase 2 — BUILD      Prompt 02  Bob migrates all 5 controllers + 8 services to .NET 8 Minimal API
Phase 3 — REVIEW     Prompt 03  Bob runs a structured code review using the dotnet-code-review skill
Phase 4 — TEST       Prompt 04  Bob generates a full integration test suite with WebApplicationFactory
Phase 5 — DOCUMENT   Prompt 05  Bob compares both codebases and produces a client-ready migration report
```

---

## Lab Structure

```text
lab/
├── legacy-code/
│   └── LegacyTaxPortal.WebApi.Framework48/        ← .NET Framework 4.8 source (read-only)
│       ├── Controllers/                             ← 5 ApiController classes
│       ├── Models/                                  ← 4 domain entity models
│       ├── Services/                                ← 8 service classes (no DI)
│       ├── DTOs/                                    ← Request / response DTOs
│       ├── Global.asax                              ← Legacy startup
│       └── Web.config                              ← Legacy configuration
│
├── migration-code/                                  ← Bob creates the .NET 8 app here
│
├── migration-output/                                ← Bob-generated reports and artefacts
│
├── prompts/                                         ← Bob prompt pack — run these in order
│   ├── 01-analyze-legacy-framework48-webapi.md
│   ├── 02-full-app-migration-to-net8-minimal-api.md
│   ├── 03-code-review-migrated-api.md
│   ├── 04-generate-tests-after-migration.md
│   └── 05-generate-migration-report.md
│
├── .bob/skills/dotnet-code-review/                 ← Custom Bob skill for .NET code review
│   ├── SKILL.md
│   └── references/                                 ← security, performance, architecture, async, style, testing
│
├── HANDS_ON_LAB_GUIDE.md                           ← Full step-by-step instructor guide
└── README.md                                        ← This file
```

---

## Running the Lab

### Prerequisites

```bash
# Verify .NET 8 SDK is installed
dotnet --version   # should be 8.0.x or higher
```

Download the .NET 8 SDK from https://dotnet.microsoft.com/download/dotnet/8.0 if needed.

---

### Phase 1 — Analyze (Bob: Plan Mode)

Open this `lab/` folder in IBM Bob, then run:

```
@prompts/01-analyze-legacy-framework48-webapi.md
```

Bob will produce a structured analysis report in `migration-output/` covering: architecture, all 14 endpoints, tax domain model, calculation flow, validation rules, legacy pattern inventory, file-by-file migration impact, risks, and recommended migration sequence.

---

### Phase 2 — Build (Bob: Agent Mode)

```
@prompts/02-full-app-migration-to-net8-minimal-api.md
```

Bob will create the full `.NET 8 Minimal API` project under `migration-code/ModernTaxPortal.MinimalApi.Net8` — migrating all 5 controllers and 8 services, wiring DI, adding Swagger, preserving all routes and business logic.

**After Bob finishes, run the app:**

```bash
cd migration-code/ModernTaxPortal.MinimalApi.Net8
dotnet restore
dotnet build
dotnet run
```

Open Swagger UI at:

```
http://localhost:5088/swagger
```

---

### Phase 3 — Review (Bob: Agent Mode + dotnet-code-review Skill)

```
@prompts/03-code-review-migrated-api.md
```

Bob activates the `dotnet-code-review` skill and performs a six-dimension code review (Security, Performance, Architecture, Async/Threading, Style, Testing). Output is saved to `migration-output/02-code-review-report.md` with a verdict, severity counts, and actionable findings.

---

### Phase 4 — Test (Bob: Agent Mode)

```
@prompts/04-generate-tests-after-migration.md
```

Bob creates an xUnit integration test project at `migration-code/ModernTaxPortal.MinimalApi.Net8.Tests/` covering all 9 test scenarios: dashboard, taxpayers, filings, tax calculation, status update, reviewer assignment, documents, audit events, and validation/404 edge cases.

**Run the tests:**

```bash
cd migration-code/ModernTaxPortal.MinimalApi.Net8.Tests
dotnet test
```

All tests should pass against the migrated API.

---

### Phase 5 — Document (Bob: Agent Mode)

```
@prompts/05-generate-migration-report.md
```

Bob compares both codebases and produces a client-ready HTML migration report in `migration-output/` including: executive summary, architecture comparison, file-by-file migration table, all endpoint mappings, legacy patterns replaced, tax logic preservation evidence, validation checklist, known risks, production hardening recommendations, and next steps.

---

## Migration Verification Checklist

```
[ ] .NET 8 project builds:      dotnet build  →  no errors
[ ] App runs:                   dotnet run    →  listening on http://localhost:5088
[ ] Swagger available:          http://localhost:5088/swagger
[ ] All 14 routes preserved     (same /api paths, same HTTP verbs)
[ ] Tax calculation logic        identical to legacy (rates, risk bands, recommendations)
[ ] Validation rules preserved  (filing type, income > 0, year format, etc.)
[ ] No manual new Service()     (all services injected via DI)
[ ] Integration tests pass:     dotnet test   →  all green
[ ] Analysis report generated:  migration-output/01-legacy-analysis-report.md
[ ] Code review report:         migration-output/02-code-review-report.md
[ ] Migration report generated: migration-output/migration-summary-*.html
```

---

## The Custom Bob Skill: dotnet-code-review

Located at `.bob/skills/dotnet-code-review/`, this skill encodes senior .NET engineer expertise so Phase 3 produces a structured, severity-graded code review — not generic AI feedback.

| Reference File | What It Teaches Bob |
|---|---|
| `references/security.md` | Injection, secrets, authz/authn, SSRF — .NET API specific |
| `references/performance.md` | EF Core patterns, sync-over-async, allocations, hot-path costs |
| `references/architecture.md` | SOLID, DI patterns, layering, domain modelling |
| `references/async-threading.md` | Deadlocks, `async void`, cancellation tokens, race conditions |
| `references/style-conventions.md` | C# naming, modern idioms, nullable reference types |
| `references/testing.md` | Coverage gaps, flakiness, mocking patterns, `WebApplicationFactory` usage |

Severity rubric: **Critical → High → Medium → Low → Nit**

---

## Troubleshooting

**`dotnet` command not found**
Install the .NET 8 SDK: https://dotnet.microsoft.com/download/dotnet/8.0

**Port 5088 already in use**
```bash
lsof -i :5088        # find the process
kill -9 <PID>        # kill it
# or change the port in migration-code/ModernTaxPortal.MinimalApi.Net8/Properties/launchSettings.json
```

**Build errors after migration**
```bash
dotnet clean && dotnet restore && dotnet build
```

**Legacy app won't run on macOS / Linux**
The `.NET Framework 4.8` project requires Windows + Visual Studio. Use it as read-only source code for Bob's analysis. The migrated `.NET 8` app runs on all platforms.

---

## Resources

- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [Minimal APIs in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [Migrating from ASP.NET to ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/migration/proper-to-2x/)
- [Dependency Injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
- [Integration Testing with WebApplicationFactory](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests)

---

> **For the full step-by-step instructor walkthrough**, see [`HANDS_ON_LAB_GUIDE.md`](HANDS_ON_LAB_GUIDE.md).
