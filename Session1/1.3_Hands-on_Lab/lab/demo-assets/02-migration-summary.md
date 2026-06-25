# Migration Summary Report
# .NET Framework 4.8 → .NET 8 Minimal API

> **Build status:** ✅ `dotnet build` — 0 errors, 0 warnings
> **Source:** `legacy-code/LegacyTaxPortal.WebApi.Framework48`
> **Target:** `migration-code/ModernTaxPortal.MinimalApi.Net8`

---

## 1. Controllers Migrated

| Legacy Controller | Endpoint File | Actions Migrated |
|---|---|---|
| `DashboardController` | `Endpoints/DashboardEndpoints.cs` | 1 |
| `TaxPayersController` | `Endpoints/TaxPayerEndpoints.cs` | 3 |
| `TaxFilingsController` | `Endpoints/TaxFilingEndpoints.cs` | 7 |
| `TaxDocumentsController` | `Endpoints/TaxDocumentEndpoints.cs` | 2 |
| `AuditController` | `Endpoints/AuditEndpoints.cs` | 1 |
| **Total** | | **14 endpoints** |

---

## 2. Routes Created

| Method | Route | Endpoint Name |
|---|---|---|
| GET | `/api/taxpayers` | GetTaxPayers |
| GET | `/api/taxpayers/{id}` | GetTaxPayer |
| POST | `/api/taxpayers` | CreateTaxPayer |
| GET | `/api/taxfilings` | GetTaxFilings |
| GET | `/api/taxfilings/{id}` | GetTaxFiling |
| POST | `/api/taxfilings` | CreateTaxFiling |
| GET | `/api/taxfilings/{id}/calculation` | GetTaxCalculation |
| PUT | `/api/taxfilings/{id}/status` | UpdateReviewStatus |
| PUT | `/api/taxfilings/{id}/reviewer` | AssignReviewer |
| DELETE | `/api/taxfilings/{id}` | DeleteTaxFiling |
| GET | `/api/taxfilings/{filingId}/documents` | GetDocuments |
| POST | `/api/taxfilings/{filingId}/documents` | AddDocument |
| GET | `/api/audit` | GetAuditEvents |
| GET | `/api/dashboard/summary` | GetDashboardSummary |

All routes are **100% preserved** from the legacy application.

---

## 3. Legacy Patterns Replaced

| Legacy Pattern | Replaced With |
|---|---|
| `System.Web.HttpApplication` (Global.asax) | `Program.cs` / `WebApplication.CreateBuilder()` |
| `ApiController` base class | `app.Map*()` Minimal API route registration via `RouteGroupBuilder` |
| `IHttpActionResult` return types | `IResult` / `Results.Ok()`, `Results.NotFound()`, `Results.BadRequest()` |
| `HttpConfiguration` / `GlobalConfiguration` | `builder.Services.*` / `app.Use*()` |
| `config.MapHttpAttributeRoutes()` | `MapGroup()` + `app.Map*()` in endpoint extension methods |
| `config.Routes.MapHttpRoute()` | Removed — Minimal API uses explicit route registration |
| `[Route]` / `[HttpGet]` / `[HttpPost]` attributes | Route defined inline in `MapGet/Post/Put/Delete()` |
| `[FromBody]` attribute | Implicit JSON binding in Minimal API — no attribute needed |
| `new TaxFilingService()` (manual instantiation) | Constructor injection via built-in DI (`builder.Services.AddSingleton`) |
| `static InMemoryTaxRepository` | Instance class registered as `Singleton` in DI |
| `Web.config` / `appSettings` | `appsettings.json` + `appsettings.Development.json` |
| `packages.config` (pre-SDK NuGet) | `<PackageReference>` in SDK-style `.csproj` |
| `Microsoft.AspNet.WebApi` NuGet packages | `Microsoft.AspNetCore.OpenApi` + `Swashbuckle.AspNetCore` |

---

## 4. Project Structure

```
migration-code/ModernTaxPortal.MinimalApi.Net8/
├── Endpoints/
│   ├── AuditEndpoints.cs
│   ├── DashboardEndpoints.cs
│   ├── TaxDocumentEndpoints.cs
│   ├── TaxFilingEndpoints.cs
│   └── TaxPayerEndpoints.cs
├── DTOs/
│   ├── AssignReviewerRequest.cs
│   ├── CreateTaxDocumentRequest.cs
│   ├── DashboardSummary.cs
│   ├── ReviewStatusUpdateRequest.cs
│   └── TaxCalculationResult.cs
├── Models/
│   ├── AuditEvent.cs
│   ├── TaxDocument.cs
│   ├── TaxFiling.cs
│   └── TaxPayer.cs
├── Services/
│   ├── AuditService.cs
│   ├── DashboardService.cs
│   ├── InMemoryTaxRepository.cs
│   ├── TaxCalculationService.cs
│   ├── TaxDocumentService.cs
│   ├── TaxFilingService.cs
│   ├── TaxPayerService.cs
│   └── TaxValidationService.cs
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
└── ModernTaxPortal.MinimalApi.Net8.csproj
```

---

## 5. Run Steps

```bash
# Navigate to the migrated project
cd migration-code/ModernTaxPortal.MinimalApi.Net8

# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

The app will start and print its listening URL (typically `http://localhost:5000` or `https://localhost:7000`).

---

## 6. Swagger URL

Swagger UI is available in **Development mode** at:

```
http://localhost:<port>/swagger
```

The OpenAPI JSON spec is available at:

```
http://localhost:<port>/swagger/v1/swagger.json
```

> The port is assigned at runtime. Check the console output for the exact URL after `dotnet run`.

---

## 7. Assumptions

| # | Assumption |
|---|---|
| A1 | The in-memory repository is intentional for this demo. All seed data from the legacy app is preserved exactly. |
| A2 | All services are registered as `Singleton` to match the behaviour of the legacy static repository. |
| A3 | No authentication or authorisation has been added — the legacy app had none, and auth is out of scope for this migration. |
| A4 | `System.Text.Json` (the .NET 8 default) is used for serialisation. No `Newtonsoft.Json` dependency was added. |
| A5 | All business logic (tax calculation rates, risk band thresholds, validation rules) is preserved exactly as found in the legacy code. |
| A6 | `TaxValidationService` and `TaxCalculationService` are stateless; they are registered as `Singleton` for efficiency. |
