# Legacy .NET Framework 4.8 Tax Portal — Migration Analysis Report

> **Scope:** Analysis only. No application code has been modified.
> **Target:** Migration to .NET 8 Minimal API
> **Source:** `legacy-code/LegacyTaxPortal.WebApi.Framework48/`

---

## Table of Contents

1. [Current Application Architecture](#1-current-application-architecture)
2. [API Endpoints and Route Structure](#2-api-endpoints-and-route-structure)
3. [Tax Domain Model and Terminology](#3-tax-domain-model-and-terminology)
4. [Tax Calculation Flow](#4-tax-calculation-flow)
5. [Validation Logic](#5-validation-logic)
6. [Legacy Framework Patterns](#6-legacy-framework-patterns)
7. [File-Level Migration Impact Analysis](#7-file-level-migration-impact-analysis)
8. [Migration Risks and Blockers](#8-migration-risks-and-blockers)
9. [Recommended Migration Sequence](#9-recommended-migration-sequence)
10. [Controller-to-Endpoint Mapping](#10-controller-to-endpoint-mapping)
11. [Assumptions and Missing Information](#11-assumptions-and-missing-information)

---

## 1. Current Application Architecture

The application is a single-project **ASP.NET Web API** hosted on **IIS via System.Web**, targeting **.NET Framework 4.8**.

```
LegacyTaxPortal.WebApi.Framework48/
├── App_Start/
│   └── WebApiConfig.cs          ← Route registration
├── Controllers/                 ← HTTP request handlers (ApiController)
│   ├── AuditController.cs
│   ├── DashboardController.cs
│   ├── TaxDocumentsController.cs
│   ├── TaxFilingsController.cs
│   └── TaxPayersController.cs
├── DTOs/                        ← Request/Response shapes
│   ├── AssignReviewerRequest.cs
│   ├── CreateTaxDocumentRequest.cs
│   ├── DashboardSummary.cs
│   ├── ReviewStatusUpdateRequest.cs
│   └── TaxCalculationResult.cs
├── Models/                      ← Domain entities
│   ├── AuditEvent.cs
│   ├── TaxDocument.cs
│   ├── TaxFiling.cs
│   └── TaxPayer.cs
├── Services/                    ← Business logic
│   ├── AuditService.cs
│   ├── DashboardService.cs
│   ├── InMemoryTaxRepository.cs ← Static in-memory data store
│   ├── TaxCalculationService.cs
│   ├── TaxDocumentService.cs
│   ├── TaxFilingService.cs
│   ├── TaxPayerService.cs
│   └── TaxValidationService.cs
├── Global.asax / Global.asax.cs ← Application lifecycle entry point
├── Web.config                   ← IIS/ASP.NET configuration
└── packages.config              ← NuGet package manifest (pre-SDK style)
```

**Architecture style:** Layered, single-assembly, no dependency injection container. All services are instantiated directly via `new` inside controllers and other services.

**Data layer:** A single static class `InMemoryTaxRepository` holds three shared mutable `List<T>` collections (`TaxPayers`, `Filings`, `Documents`, `AuditEvents`). There is no database, no ORM, and no persistence across process restarts.

**Dependencies:**
| Package | Version | Role |
|---|---|---|
| `Microsoft.AspNet.WebApi` | 5.2.9 | HTTP framework |
| `Microsoft.AspNet.WebApi.Core` | 5.2.9 | Core WebApi types |
| `Microsoft.AspNet.WebApi.WebHost` | 5.2.9 | IIS/System.Web hosting |
| `Newtonsoft.Json` | 13.0.3 | JSON serialisation |

---

## 2. API Endpoints and Route Structure

Routing uses **attribute routing** (`config.MapHttpAttributeRoutes()`) combined with a conventional fallback route `api/{controller}/{id}`. All routes use the `api/` prefix.

| Method | Route | Controller | Action | Description |
|---|---|---|---|---|
| GET | `api/taxpayers` | TaxPayersController | GetTaxPayers | List all taxpayers |
| GET | `api/taxpayers/{id}` | TaxPayersController | GetTaxPayer | Get single taxpayer |
| POST | `api/taxpayers` | TaxPayersController | CreateTaxPayer | Create taxpayer |
| GET | `api/taxfilings` | TaxFilingsController | GetTaxFilings | List all filings |
| GET | `api/taxfilings/{id}` | TaxFilingsController | GetTaxFiling | Get single filing |
| POST | `api/taxfilings` | TaxFilingsController | CreateTaxFiling | Create filing (with validation) |
| GET | `api/taxfilings/{id}/calculation` | TaxFilingsController | GetTaxCalculation | Run tax calculation |
| PUT | `api/taxfilings/{id}/status` | TaxFilingsController | UpdateReviewStatus | Update review status |
| PUT | `api/taxfilings/{id}/reviewer` | TaxFilingsController | AssignReviewer | Assign a reviewer |
| DELETE | `api/taxfilings/{id}` | TaxFilingsController | DeleteTaxFiling | Delete a filing |
| GET | `api/taxfilings/{filingId}/documents` | TaxDocumentsController | GetDocuments | List documents for a filing |
| POST | `api/taxfilings/{filingId}/documents` | TaxDocumentsController | AddDocument | Upload a document to a filing |
| GET | `api/audit` | AuditController | GetAuditEvents | List all audit events |
| GET | `api/dashboard/summary` | DashboardController | GetSummary | Get dashboard statistics |

**Observation:** No versioning, no authentication/authorisation middleware, no content negotiation beyond JSON (Newtonsoft.Json is the default formatter).

---

## 3. Tax Domain Model and Terminology

### Core Entities

**TaxPayer** — Represents a registered tax entity.
| Field | Type | Notes |
|---|---|---|
| Id | int | Auto-assigned integer key |
| TaxPayerName | string | Display name |
| TaxIdentifier | string | EIN (USA) or PAN (India) — no format validation |
| EntityType | string | `"Individual"`, `"Corporate"`, `"Partnership"` |
| Country | string | Free text |
| State | string | Free text |
| IsActive | bool | Always set to `true` on create |

**TaxFiling** — A tax return submission linked to a TaxPayer.
| Field | Type | Notes |
|---|---|---|
| Id | int | Auto-assigned |
| TaxPayerId | int | Foreign key to TaxPayer (not enforced) |
| TaxPayerName | string | Denormalised name (duplicated from TaxPayer) |
| TaxYear | string | e.g. `"2025"` — free text, not a date |
| FilingType | string | `"Individual"`, `"Corporate"`, `"Partnership"` |
| AnnualIncome | decimal | Gross income before deductions |
| DeductionAmount | decimal | Total deductions claimed |
| ReviewStatus | string | `"Draft"`, `"Under Review"`, `"Approved"`, `"Rejected"` |
| AssignedReviewer | string | Name of assigned reviewer, defaults to `"Unassigned"` |
| RiskBand | string | `"Low"`, `"Medium"`, `"High"` |
| CreatedDate | DateTime | Set to `DateTime.UtcNow` on create |

**TaxDocument** — A supporting document attached to a filing.
| Field | Type | Notes |
|---|---|---|
| Id | int | Auto-assigned |
| FilingId | int | Foreign key to TaxFiling |
| DocumentName | string | Filename |
| DocumentType | string | Category (e.g., `"Income Statement"`) |
| UploadedBy | string | Username string |
| UploadedDate | DateTime | Set to `DateTime.UtcNow` on create |

**AuditEvent** — Immutable record of a domain action.
| Field | Type | Notes |
|---|---|---|
| Id | int | Auto-assigned |
| EntityName | string | e.g., `"TaxFiling"`, `"TaxDocument"` |
| EntityId | int | ID of the affected entity |
| EventType | string | e.g., `"Created"`, `"StatusUpdated"`, `"Deleted"` |
| Message | string | Human-readable description |
| PerformedBy | string | Username, defaults to `"system"` |
| EventDate | DateTime | Set to `DateTime.UtcNow` |

### Key Domain Terms
| Term | Meaning |
|---|---|
| **RiskBand** | Risk classification computed from deduction ratio and taxable income |
| **ReviewStatus** | Lifecycle state of a filing |
| **TaxableIncome** | `AnnualIncome - DeductionAmount` (floor at 0) |
| **EffectiveTaxRate** | `EstimatedTax / AnnualIncome` |
| **ReviewRecommendation** | Plain-text recommendation derived from RiskBand |

---

## 4. Tax Calculation Flow

The calculation is performed by `TaxCalculationService.Calculate(TaxFiling)` and exposed via `GET api/taxfilings/{id}/calculation`.

```
TaxFiling
    │
    ▼
TaxableIncome = AnnualIncome - DeductionAmount  (min 0)
    │
    ▼
EstimatedTax = CalculateEstimatedTax(TaxableIncome, FilingType)
    │   Individual:  ≤ 100,000 → 10%
    │               ≤ 500,000 → 20%
    │               > 500,000 → 30%
    │   Partnership:             24%
    │   Corporate (default):     21%
    │
    ▼
EffectiveTaxRate = EstimatedTax / AnnualIncome  (0 if AnnualIncome = 0)
    │
    ▼
RiskBand = CalculateRiskBand(Filing, TaxableIncome, EffectiveTaxRate)
    │   DeductionAmount > AnnualIncome × 30% → "High"
    │   TaxableIncome > 500,000 OR EffectiveTaxRate < 10% → "Medium"
    │   Otherwise → "Low"
    │
    ▼
ReviewRecommendation
    │   "High"   → "Enhanced review required"
    │   "Medium" → "Standard review required"
    │   "Low"    → "Auto-approval candidate"
    │
    ▼
TaxCalculationResult (DTO returned to caller)
```

**Important:** The calculation is **stateless and on-demand** — it does not persist the computed `RiskBand` back to the filing. The `RiskBand` stored on `TaxFiling` is a separate field set at creation time or by the caller, not the calculated one.

**The `DashboardService` calls `TaxCalculationService.Calculate()` for every filing** when computing `TotalEstimatedTax`, which means the calculation runs N times per dashboard request — a performance concern at scale.

---

## 5. Validation Logic

Validation is implemented in `TaxValidationService` and called from `TaxFilingService.Validate()`.

### Filing Validation Rules (`ValidateFiling`)
| Rule | Error Message |
|---|---|
| `filing == null` | "Tax filing payload is required." |
| `TaxPayerName` is null/empty | "Taxpayer name is required." |
| `TaxYear` is null/empty | "Tax year is required." |
| `AnnualIncome < 0` | "Annual income cannot be negative." |
| `DeductionAmount < 0` | "Deduction amount cannot be negative." |
| `DeductionAmount > AnnualIncome` | "Deduction amount cannot exceed annual income." |
| `FilingType` is null/empty | "Filing type is required." |

### Review Status Validation (`IsValidReviewStatus`)
Accepts only: `"Draft"`, `"Under Review"`, `"Approved"`, `"Rejected"`.

### Validation Gaps (Missing Rules)
- No validation that `TaxPayerId` references an existing `TaxPayer`.
- No validation of `TaxYear` format (e.g., 4-digit year).
- No validation of `FilingType` against allowed values.
- No null check on `ReviewStatusUpdateRequest` body in `UpdateStatus` controller action (handled at service level but returns generic `BadRequest`).
- `TaxPayersController.CreateTaxPayer` does **no validation** beyond a null check.
- No duplicate detection (same taxpayer + same tax year can be filed multiple times).

---

## 6. Legacy Framework Patterns

| Pattern | Location | Migration Impact |
|---|---|---|
| `System.Web.HttpApplication` (Global.asax) | `Global.asax.cs` | **Replace** with `Program.cs` / `WebApplication.CreateBuilder()` |
| `ApiController` base class | All controllers | **Replace** with Minimal API `app.MapGet/Post/Put/Delete()` |
| `IHttpActionResult` return type | All controller actions | **Replace** with `IResult` / `Results.*` |
| `HttpConfiguration` / `GlobalConfiguration` | `WebApiConfig.cs`, `Global.asax.cs` | **Replace** with `builder.Services` / `app.Use*()` |
| `config.MapHttpAttributeRoutes()` | `WebApiConfig.cs` | **Remove** — replaced by Minimal API route registration |
| `config.Routes.MapHttpRoute()` | `WebApiConfig.cs` | **Remove** — conventional routing not used in Minimal API |
| `[Route]` / `[HttpGet]` / `[HttpPost]` attributes | All controllers | **Remove** — routes defined inline in Minimal API |
| `[FromBody]` attribute | TaxFilingsController, TaxDocumentsController | **Remove** — implicit in Minimal API POST/PUT handlers |
| `new TaxFilingService()` (manual instantiation) | All controllers and services | **Replace** with constructor injection via built-in DI |
| `new AuditService()` inside TaxDocumentService / TaxFilingService | Services | **Replace** with DI injection |
| `Web.config` / `appSettings` | `Web.config` | **Replace** with `appsettings.json` |
| `packages.config` (pre-SDK NuGet) | `packages.config` | **Replace** with `<PackageReference>` in SDK-style `.csproj` |
| `static` shared mutable state (repository) | `InMemoryTaxRepository.cs` | **Risk** — static state carries across requests; must register as Singleton in DI |
| Newtonsoft.Json as default serializer | `packages.config` | .NET 8 uses `System.Text.Json` by default; opt-in needed or swap serialiser |
| No async/await | All services and controllers | All I/O is synchronous; should become `async Task<IResult>` in Minimal API |

---

## 7. File-Level Migration Impact Analysis

### Legend
- 🟢 **Reuse as-is** — File can be copied with no or trivial changes (namespace update only)
- 🟡 **Minor refactor** — Structural changes needed but logic is preserved
- 🔴 **Rewrite / Replace** — File is framework-specific and has no direct equivalent

| File | Impact | Action Required |
|---|---|---|
| `Global.asax.cs` | 🔴 Replace | Delete; replaced by `Program.cs` |
| `Global.asax` | 🔴 Replace | Delete; IIS lifecycle hook not used in .NET 8 |
| `Web.config` | 🔴 Replace | Delete; replaced by `appsettings.json` |
| `packages.config` | 🔴 Replace | Delete; use `<PackageReference>` in new SDK `.csproj` |
| `LegacyTaxPortal.WebApi.Framework48.csproj` | 🔴 Replace | Create new SDK-style `.csproj` targeting `net8.0` |
| `App_Start/WebApiConfig.cs` | 🔴 Replace | Delete; route config moves into `Program.cs` |
| `Controllers/TaxPayersController.cs` | 🔴 Rewrite | Remove `ApiController`; convert actions to Minimal API endpoints |
| `Controllers/TaxFilingsController.cs` | 🔴 Rewrite | Remove `ApiController`; convert 7 actions to Minimal API endpoints |
| `Controllers/TaxDocumentsController.cs` | 🔴 Rewrite | Remove `ApiController`; convert 2 actions to Minimal API endpoints |
| `Controllers/AuditController.cs` | 🔴 Rewrite | Remove `ApiController`; convert 1 action to Minimal API endpoint |
| `Controllers/DashboardController.cs` | 🔴 Rewrite | Remove `ApiController`; convert 1 action to Minimal API endpoint |
| `Services/TaxCalculationService.cs` | 🟢 Reuse | Pure calculation logic; no framework dependency. Namespace update only. |
| `Services/TaxValidationService.cs` | 🟢 Reuse | Pure validation logic; no framework dependency. Namespace update only. |
| `Services/InMemoryTaxRepository.cs` | 🟡 Minor refactor | Remove `static`; register as Singleton via DI |
| `Services/TaxPayerService.cs` | 🟡 Minor refactor | Remove `new InMemoryTaxRepository()`; inject via DI |
| `Services/TaxFilingService.cs` | 🟡 Minor refactor | Remove `new TaxValidationService()`/`new AuditService()`; inject via DI |
| `Services/TaxDocumentService.cs` | 🟡 Minor refactor | Remove `new AuditService()`; inject via DI |
| `Services/AuditService.cs` | 🟡 Minor refactor | Remove static repository dependency; inject via DI |
| `Services/DashboardService.cs` | 🟡 Minor refactor | Remove `new TaxCalculationService()`; inject via DI |
| `Models/TaxPayer.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `Models/TaxFiling.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `Models/TaxDocument.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `Models/AuditEvent.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `DTOs/AssignReviewerRequest.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `DTOs/CreateTaxDocumentRequest.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `DTOs/DashboardSummary.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `DTOs/ReviewStatusUpdateRequest.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |
| `DTOs/TaxCalculationResult.cs` | 🟢 Reuse | Pure POCO. Namespace update only. |

**Summary:** 9 files reuse as-is (Models + DTOs + pure services), 6 files need minor DI refactoring (Services), 5 files need full rewrite (Controllers), 5 files are deleted/replaced (project infrastructure).

---

## 8. Migration Risks and Blockers

### 🔴 Blockers

| # | Risk | Detail |
|---|---|---|
| B1 | **System.Web dependency** | The entire hosting model (`System.Web.HttpApplication`, `IIS/System.Web` pipeline) is incompatible with .NET 8. It cannot be referenced. All controllers and hosting infrastructure must be rewritten. |
| B2 | **Static mutable shared state** | `InMemoryTaxRepository` uses `static readonly List<T>` fields. In .NET 8 with DI, this must be refactored into a Singleton-registered class; if left static it will silently work but is untestable and not thread-safe. |
| B3 | **No DI container** | All service dependencies are newed up manually. This means unit testing is impractical and the migration to DI is a prerequisite for clean .NET 8 code. |

### 🟡 Risks

| # | Risk | Detail |
|---|---|---|
| R1 | **Newtonsoft.Json vs System.Text.Json** | .NET 8 defaults to `System.Text.Json`. `Newtonsoft.Json` can be added back via `AddNewtonsoftJson()`, but property naming conventions, null handling, and circular reference behaviour differ. |
| R2 | **Synchronous I/O** | All service methods and controller actions are synchronous. Minimal API pattern strongly favours `async Task<IResult>`. Mixing sync and async can cause thread-pool starvation under load. |
| R3 | **N+1 calculation in DashboardService** | `DashboardService.GetSummary()` calls `Calculate()` for every filing. Acceptable with in-memory data; becomes a performance issue if the data layer is ever replaced with a real database. |
| R4 | **No authentication / authorisation** | There is no auth middleware. The migration report should flag this as a gap for production readiness — Minimal API makes adding `RequireAuthorization()` straightforward but the policy design must be defined first. |
| R5 | **Denormalised TaxPayerName on TaxFiling** | `TaxFiling.TaxPayerName` duplicates `TaxPayer.TaxPayerName`. If a taxpayer is renamed, filings become stale. No FK enforcement exists. |
| R6 | **String-typed enums** | `ReviewStatus`, `FilingType`, `EntityType`, `RiskBand`, `EventType` are all free-text strings. There is no compile-time safety. These are candidates for C# `enum` types but changing them is a breaking change on the API response shape. |
| R7 | **Thread safety of static lists** | `List<T>` is not thread-safe. Concurrent POST requests can corrupt the in-memory lists. In .NET 8, if the repository remains singleton, `ConcurrentBag` or a lock is required. |
| R8 | **No error handling middleware** | Unhandled exceptions return raw 500 responses with stack traces in debug mode. .NET 8 should add `app.UseExceptionHandler()` or a `Results.Problem()` wrapper. |

---

## 9. Recommended Migration Sequence

The following sequence minimises risk by migrating infrastructure first, then business logic, then endpoints.

### Phase 1 — Project Bootstrap
1. Create a new SDK-style `.csproj` targeting `net8.0`.
2. Create `Program.cs` with `WebApplication.CreateBuilder()`.
3. Replace `Web.config` with `appsettings.json`.
4. Add required NuGet packages (`Microsoft.AspNetCore.OpenApi`, optionally `Swashbuckle.AspNetCore`).

### Phase 2 — Models and DTOs (Reuse)
5. Copy all files from `Models/` and `DTOs/` with namespace updated to the new project.
6. No logic changes required.

### Phase 3 — Service Layer Refactor (DI)
7. Convert `InMemoryTaxRepository` from `static` to an instance class; register as `Singleton` in DI.
8. Inject `InMemoryTaxRepository` into all services via constructor injection.
9. Inject `TaxValidationService` and `AuditService` into the services that depend on them.
10. Register all services in `Program.cs` (`builder.Services.AddSingleton / AddScoped`).
11. `TaxCalculationService` and `TaxValidationService` require no changes beyond namespace.

### Phase 4 — Minimal API Endpoints
12. Replace each controller action with a `app.Map*()` call in `Program.cs` or dedicated `endpoint extension` files (one per domain area: `TaxPayerEndpoints`, `TaxFilingEndpoints`, etc.).
13. Replace `IHttpActionResult` returns with `Results.Ok()`, `Results.NotFound()`, `Results.BadRequest()`.
14. Remove `[FromBody]` attributes — implicit in Minimal API.

### Phase 5 — Serialisation and Error Handling
15. Decide: keep `System.Text.Json` (recommended) or add `AddNewtonsoftJson()`.
16. Add global exception handling middleware.
17. Add `app.UseExceptionHandler("/error")` or `Results.Problem()` pattern.

### Phase 6 — Validation and API Hardening
18. Consider adding `FluentValidation` or `DataAnnotations` for request validation in Minimal API.
19. Add `[Required]` / validation filters or `IValidator<T>` per request DTO.
20. Consider introducing strongly-typed enums or constants for `ReviewStatus`, `FilingType`, `RiskBand`.

### Phase 7 — OpenAPI / Swagger
21. Add `AddOpenApi()` and configure Swagger UI for endpoint documentation.
22. Add `.WithName()` and `.WithSummary()` to each endpoint for documentation.

---

## 10. Controller-to-Endpoint Mapping

This table shows the direct mapping from legacy controller actions to .NET 8 Minimal API equivalents.

| Legacy Controller Action | HTTP | Route | Minimal API Mapping |
|---|---|---|---|
| `TaxPayersController.GetTaxPayers` | GET | `/api/taxpayers` | `app.MapGet("/api/taxpayers", ...)` |
| `TaxPayersController.GetTaxPayer` | GET | `/api/taxpayers/{id}` | `app.MapGet("/api/taxpayers/{id}", ...)` |
| `TaxPayersController.CreateTaxPayer` | POST | `/api/taxpayers` | `app.MapPost("/api/taxpayers", ...)` |
| `TaxFilingsController.GetTaxFilings` | GET | `/api/taxfilings` | `app.MapGet("/api/taxfilings", ...)` |
| `TaxFilingsController.GetTaxFiling` | GET | `/api/taxfilings/{id}` | `app.MapGet("/api/taxfilings/{id}", ...)` |
| `TaxFilingsController.CreateTaxFiling` | POST | `/api/taxfilings` | `app.MapPost("/api/taxfilings", ...)` |
| `TaxFilingsController.GetTaxCalculation` | GET | `/api/taxfilings/{id}/calculation` | `app.MapGet("/api/taxfilings/{id}/calculation", ...)` |
| `TaxFilingsController.UpdateReviewStatus` | PUT | `/api/taxfilings/{id}/status` | `app.MapPut("/api/taxfilings/{id}/status", ...)` |
| `TaxFilingsController.AssignReviewer` | PUT | `/api/taxfilings/{id}/reviewer` | `app.MapPut("/api/taxfilings/{id}/reviewer", ...)` |
| `TaxFilingsController.DeleteTaxFiling` | DELETE | `/api/taxfilings/{id}` | `app.MapDelete("/api/taxfilings/{id}", ...)` |
| `TaxDocumentsController.GetDocuments` | GET | `/api/taxfilings/{filingId}/documents` | `app.MapGet("/api/taxfilings/{filingId}/documents", ...)` |
| `TaxDocumentsController.AddDocument` | POST | `/api/taxfilings/{filingId}/documents` | `app.MapPost("/api/taxfilings/{filingId}/documents", ...)` |
| `AuditController.GetAuditEvents` | GET | `/api/audit` | `app.MapGet("/api/audit", ...)` |
| `DashboardController.GetSummary` | GET | `/api/dashboard/summary` | `app.MapGet("/api/dashboard/summary", ...)` |

**Total: 14 endpoints across 5 controllers → 14 Minimal API route registrations.**

Recommended grouping for Minimal API using `RouteGroupBuilder`:
```
/api/taxpayers          → TaxPayerEndpoints.MapRoutes(app)
/api/taxfilings         → TaxFilingEndpoints.MapRoutes(app)
/api/taxfilings/.../documents → TaxDocumentEndpoints.MapRoutes(app)
/api/audit              → AuditEndpoints.MapRoutes(app)
/api/dashboard          → DashboardEndpoints.MapRoutes(app)
```

---

## 11. Assumptions and Missing Information

| # | Item | Detail |
|---|---|---|
| A1 | **No unit tests** | No test project was found in the repository. This means there is no automated safety net for the migration. It is strongly recommended to add characterisation tests before migrating. |
| A2 | **No authentication** | There is no auth layer. The analysis assumes auth will be added as a separate concern post-migration. |
| A3 | **In-memory data is intentional** | The static repository appears to be a deliberate demo/workshop choice, not a gap. A real migration would replace this with EF Core or another data layer. |
| A4 | **TaxPayerId is not enforced** | Filings reference a `TaxPayerId` but no validation confirms the taxpayer exists. This is a data integrity gap that exists in the legacy code and would carry over. |
| A5 | **FilingType and EntityType are not validated** | No allowed-value check on `TaxFiling.FilingType`. The calculation engine uses `"Individual"`, `"Partnership"`, and falls back to a corporate rate. Unknown filing types silently apply the corporate rate. |
| A6 | **No CORS, no HTTPS configuration** | `Web.config` has no HTTPS or CORS settings. In .NET 8, these must be explicitly configured. |
| A7 | **No logging** | No `ILogger` or logging framework is used anywhere. .NET 8 has built-in structured logging via `ILogger<T>` which should be injected into services during migration. |
| A8 | **Thread safety is not tested** | The static `List<T>` is not thread-safe. This has not been verified as a bug because the application is a demo, but it is a real risk in a production context. |
