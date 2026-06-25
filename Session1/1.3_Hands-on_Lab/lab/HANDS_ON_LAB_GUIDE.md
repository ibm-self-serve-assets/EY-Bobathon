# Hands-On Lab: .NET Framework 4.8 to .NET 8 Migration

## 🎯 Lab Overview

**Duration**: 40 minutes
**Level**: Intermediate to Advanced
**Prerequisites**: .NET 8 SDK, Bob AI Assistant, Basic C# and ASP.NET knowledge

In this hands-on lab, you'll use **Bob AI** to migrate a real .NET Framework 4.8 ASP.NET Web API tax application to a modern .NET 8 Minimal API. You'll experience Bob's multi-file refactoring capabilities while modernizing a legacy enterprise application.

---

## 📋 What You'll Do

1. **Analyze the legacy application** with Bob (Plan Mode) to understand its architecture
2. **Perform full application migration** (Agent) with Bob's assistance
3. **Review the migrated code** (Bob Skill - dotnet-code-review Skill) to ensure quality
4. **Generate integration tests** (Agent) for the migrated API
5. **Generate migration documentation** (Agent Mode) for stakeholders

---

## 🚀 Part 1: Setup & Legacy Analysis (10 minutes)

### Step 1.1: Verify Prerequisites

**Check .NET 8 SDK installation:**

```bash
dotnet --version
```

You should see version 8.0.x or higher.

**If not installed:**

- Windows/macOS/Linux: Download from https://dotnet.microsoft.com/download/dotnet/8.0

### Step 1.2: Explore the Legacy Application Structure

Navigate to the lab directory:

```bash
cd Session1/1.3_Hands-on_Lab/lab
```

**Review the folder structure:**

```text
legacy-code/
  LegacyTaxPortal.WebApi.Framework48/    # .NET Framework 4.8 source
    Controllers/                          # 5 API controllers
    Models/                               # Domain models
    Services/                             # Business logic
    DTOs/                                 # Data transfer objects
    Web.config                            # Legacy configuration
    Global.asax                           # Application startup

migration-code/
  README.md                               # Bob will create the new app here

prompts/                                  # Bob prompt pack
  01-analyze-legacy-framework48-webapi.md      # Plan Mode
  02-full-app-migration-to-net8-minimal-api.md # Agent Mode
  03-code-review-migrated-api.md               # Agent Mode (dotnet-code-review Skill)
  04-generate-tests-after-migration.md         # Agent Mode
  05-generate-migration-report.md              # Agent Mode

migration-output/                         # Bob-generated reports
```

### Step 1.3: Use Bob to Analyze the Legacy Application

**Open Bob in Plan Mode (📝) and use the first prompt:**

```
@Session1/1.3_Hands-on_Lab/lab/prompts/01-analyze-legacy-framework48-webapi.md
```

**Or manually prompt Bob:**

```
Analyze the legacy `.NET Framework 4.8` ASP.NET Web API tax application from `@/legacy-code`.

Do not migrate or modify the application code in this phase.

Create or update an analysis report under: `migration-output`

The report should explain:

1. Current application architecture
2. API endpoints and route structure
3. Tax domain model and terminology
4. Tax calculation flow
5. Validation logic
6. Legacy framework patterns
7. Files likely to be impacted during migration to `.NET 8 Minimal API`
8. Migration risks and blockers
9. Recommended migration sequence

Report expectations:

1. Include file-level migration impact analysis.
2. Identify code that can likely be reused as-is versus code that likely needs refactoring.
3. Identify controller-to-endpoint mapping for the future `.NET 8 Minimal API` migration.
4. Highlight assumptions, risks, blockers, and missing information.
5. Keep the report clear, structured, and suitable for a migration workshop demo.
```

**Expected Output:**

Bob should provide:

- Overview of the 5 controllers (Dashboard, TaxPayers, TaxFilings, TaxDocuments, Audit)
- Explanation of tax domain concepts (taxpayer, filing, taxable income, deductions, review status)
- Legacy patterns that need modernization
- Migration complexity assessment
- Recommended migration order
- An analysis report saved under `migration-output/`

---

## 🏗️ Part 2: Full Application Migration (10 minutes)

### Step 2.1: Use Bob to Migrate All Controllers

**Switch to Bob's Agent Mode (💻) and use the second prompt:**

```
@Session1/1.3_Hands-on_Lab/lab/prompts/02-full-app-migration-to-net8-minimal-api.md
```

**Or manually prompt Bob:**

```
Migrate the full `.NET Framework 4.8` ASP.NET Web API tax application into a modern `.NET 8 Minimal API`.

Source: `legacy-code/LegacyTaxPortal.WebApi.Framework48`
Target: `migration-code/ModernTaxPortal.MinimalApi.Net8`

Scope:

Migrate all legacy Web API controllers:

1. `DashboardController`
2. `TaxPayersController`
3. `TaxFilingsController`
4. `TaxDocumentsController`
5. `AuditController`

Migration requirements:

1. Analyze the existing controllers, models, services, routes, validation, and business logic.
2. Convert Web API controllers into `.NET 8` Minimal API endpoints or route groups.
3. Preserve all existing `/api` routes, response behavior, validation, and business logic.
4. Preserve functionality for dashboard summary, taxpayers, tax filings, tax calculation, review/status updates, document metadata, and audit events.
5. Replace legacy patterns such as `ApiController`, `IHttpActionResult`, `System.Web.Http`, `WebApiConfig.cs`, and `Global.asax` with modern `Program.cs` setup.
6. Use dependency injection for services.
7. Use typed request/response DTOs or records where useful.
8. Add Swagger/OpenAPI support.
9. Add `appsettings.json` only if needed.
10. Keep the migrated code simple, readable, and suitable for a migration workshop demo.

Important:

Make sure `TaxFilingsController` routes are fully preserved, including list, get-by-id, create, tax calculation, status update, reviewer assignment, and delete.

Expected result:

1. The target project should build using `dotnet restore` and `dotnet build`.
2. The app should run using `dotnet run`.
3. Swagger should be available in Development mode.
4. After migration, summarize controllers migrated, routes created, legacy patterns replaced, assumptions, run steps, and Swagger URL.

```

**What Bob Will Do:**

1. Create a new .NET 8 Minimal API project structure under `migration-code/ModernTaxPortal.MinimalApi.Net8`
2. Migrate all 5 controllers to Minimal API endpoints organized into logical route groups
3. Set up complete dependency injection
4. Configure Swagger/OpenAPI for all endpoints
5. Preserve all business logic, validation, and tax calculations

### Step 2.2: Review Bob's Migration

**Bob should create:**

```text
migration-code/
  ModernTaxPortal.MinimalApi.Net8/
    Program.cs                    # Minimal API endpoints + startup
    ModernTaxPortal.MinimalApi.Net8.csproj
    Models/                       # Migrated domain models
    Services/                     # Migrated services with DI
    DTOs/                         # Migrated DTOs
    appsettings.json              # Modern configuration
```

**Key changes to observe:**

- `ApiController` → Minimal API route groups
- `IHttpActionResult` → `Results.Ok()`, `Results.NotFound()`, etc.
- Manual service creation → Dependency injection
- `Web.config` → `appsettings.json`
- `Global.asax` → `Program.cs` startup

### Step 2.3: Run the Migrated Application

**Navigate to the migrated project:**

```bash
cd migration-code/ModernTaxPortal.MinimalApi.Net8
```

**Restore and build:**

```bash
dotnet restore
dotnet build
```

**Run the application:**

```bash
dotnet run
```

**Expected output:**

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5088
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### Step 2.4: Test the Migrated API

**Open Swagger UI in your browser:**

```
http://localhost:5088/swagger
```

**Test key endpoints:**

1. **GET /api/dashboard/summary** — Should return dashboard statistics
2. **GET /api/taxpayers** — Should return list of taxpayers
3. **POST /api/taxfilings** — Create a new tax filing
4. **GET /api/taxfilings/{id}/calculation** — Calculate tax for a filing
5. **GET /api/audit** — View audit events

**Verify:**

- All endpoints respond correctly
- Tax calculations match legacy behavior
- Validation rules are preserved
- Response formats are consistent

---

## 🔍 Part 3: Code Review with Bob (7 minutes)

### Step 3.1: Use Bob to Review the Migrated API

**Continue in Bob's Agent Mode (💻) and use the third prompt:**

```
@Session1/1.3_Hands-on_Lab/lab/prompts/03-code-review-migrated-api.md
```

> 💡 This prompt uses the **`dotnet-code-review` skill** — a structured, multi-dimensional review process covering security, performance, architecture, async/threading, style, and testing. Bob will automatically load the skill and apply its six-dimension checklist to the migrated code.

**What the prompt does:**

```
Review this .NET code located @Session1/1.3_Hands-on_Lab/lab/migration-code/ModernTaxPortal.MinimalApi.Net8
Create or update the code review report under: `migration-output`
```

**Expected Output:**

Bob should provide:

- Comprehensive code review findings saved to `migration-output/`
- A **verdict** (`Approve` / `Approve with comments` / `Changes requested` / `Block — critical issues`)
- Severity ratings (`Critical · High · Medium · Low · Nit`) with counts
- Findings grouped by severity, each with: location, category, issue explanation, and a concrete fix
- Production readiness assessment across all six dimensions

---

## 🧪 Part 4: Generate Integration Tests (7 minutes)

### Step 4.1: Use Bob to Generate Tests

**Continue in Bob's Agent Mode (💻) and use the fourth prompt:**

```
@Session1/1.3_Hands-on_Lab/lab/prompts/04-generate-tests-after-migration.md
```

**Or manually prompt Bob:**

```
Generate integration tests for the migrated `.NET 8 Minimal API` from: `@/migration-code/ModernTaxPortal.MinimalApi.Net8`

Test objective:

Verify that migrated API routes work correctly and preserve expected response behavior.

Cover:

1. Dashboard summary
2. Taxpayer list and get-by-id
3. Tax filing list and get-by-id
4. Tax calculation for a known sample tax filing
5. Status update
6. Reviewer assignment
7. Document metadata upload
8. Audit events
9. Validation errors and not-found responses

Guidance:

- Create a test project if one does not already exist.
- Prefer integration tests using `WebApplicationFactory` or an equivalent ASP.NET Core testing approach.
- Verify route, status code, and response body shape.
- Use predictable sample data from the migrated application where available.
- If required sample data is missing, create simple test data needed for the tests.

After generating tests, summarize files created, scenarios covered, assumptions, and how to run using `dotnet test`.

```

**What Bob Will Do:**

1. Create an integration test project alongside the migrated API
2. Generate tests for all key endpoints
3. Verify route mappings and HTTP status codes
4. Test response body shapes
5. Include validation error scenarios

### Step 4.2: Run the Generated Tests

**Navigate to the test project:**

```bash
cd migration-code/ModernTaxPortal.MinimalApi.Net8.Tests
```

**Run the tests:**

```bash
dotnet test
```

**Verify:**

- All tests pass
- Coverage includes critical endpoints
- Validation scenarios are tested

---

## 📊 Part 5: Generate Migration Documentation (5 minutes)

### Step 5.1: Use Bob to Create Migration Report

**Continue in Bob's Agent Mode (💻) and use the fifth prompt:**

```
@Session1/1.3_Hands-on_Lab/lab/prompts/05-generate-migration-report.md
```

**Or manually prompt Bob:**

```
Generate a full migration report for the .NET Framework 4.8 ASP.NET Web API
to .NET 8 Minimal API migration.

Use both codebases:

- Legacy source:   legacy-code/LegacyTaxPortal.WebApi.Framework48
- Migrated source: migration-code/ModernTaxPortal.MinimalApi.Net8

Create or update the migration report under: migration-output

The report should include:

1. Executive summary
2. Legacy application architecture
3. Modern application architecture
4. File-by-file migration summary
5. API endpoint mapping
6. Legacy patterns replaced
7. Tax domain logic preserved
8. Validation checklist and results
9. Known risks
10. Production hardening recommendations
11. Next steps

Report expectations:

- Compare the legacy and migrated implementations.
- Confirm which controllers, services, routes, and models were migrated.
- Highlight any behavior that was changed, simplified, or assumed.
- Include validation evidence such as build status, route coverage,
  Swagger availability, and test status where available.
- Keep the report clear, client-ready, concise, and suitable for a migration workshop demo.
```

**Expected Output:**

Bob should create a comprehensive migration report in `migration-output/` including:

- Executive summary for stakeholders
- Technical architecture comparison
- Complete endpoint mapping (legacy → modern)
- Migration validation results
- Production deployment recommendations

### Step 5.2: Review the Migration Report

**Check the generated report:**

```bash
ls -la migration-output/
```

**The report should include:**

- Migration summary
- API endpoint compatibility matrix
- Performance comparison notes
- Security improvements
- Deployment checklist

---

## ✅ Migration Verification Checklist

Use this checklist to verify your migration is complete:

```
Migration Verification Checklist:

[ ] Project Structure
    - .NET 8 project created successfully
    - All dependencies restored
    - Application builds without errors

[ ] API Endpoints
    - All 5 controllers migrated
    - All routes preserved under /api
    - Swagger documentation available at /swagger

[ ] Business Logic
    - Tax calculation logic preserved
    - Validation rules maintained
    - Audit logging functional

[ ] Dependency Injection
    - All services registered in Program.cs
    - No manual service instantiation
    - Proper service lifetimes configured

[ ] Configuration
    - appsettings.json created
    - Legacy Web.config patterns replaced
    - Environment-specific settings supported

[ ] Testing
    - Application runs successfully
    - All endpoints respond correctly
    - Tax calculations match legacy behavior
    - Integration tests generated and passing

[ ] Documentation
    - Analysis report generated (migration-output/)
    - Code review report generated (migration-output/)
    - Migration report generated (migration-output/)
    - API documentation available in Swagger
```

---

## 🎯 What You Learned

**How You Used Bob:**

1. **Bob Analyzed Legacy Code (Plan Mode)**
   - Bob understood .NET Framework 4.8 patterns
   - Bob identified tax domain concepts and terminology
   - Bob assessed migration complexity and risks
   - Bob produced a structured analysis report

2. **Bob Performed Full Multi-File Migration (Agent Mode)**
   - Bob migrated 5 controllers simultaneously
   - Bob maintained context across models, services, and DTOs
   - Bob preserved business logic and validation rules
   - Bob converted `WebApiConfig.cs` / `Global.asax` into `Program.cs`

3. **Bob Modernized Architecture (Agent Mode)**
   - Bob converted Web API controllers to Minimal API route groups
   - Bob implemented built-in dependency injection
   - Bob added Swagger/OpenAPI documentation

4. **Bob Ensured Quality (Agent Mode — dotnet-code-review Skill)**
   - Bob performed code review as a senior .NET architect
   - Bob identified potential issues and risks with severity ratings
   - Bob provided actionable recommendations

5. **Bob Generated Tests (Agent Mode)**
   - Bob created integration tests covering all major endpoints
   - Bob verified route mappings, status codes, and response shapes
   - Bob covered validation error scenarios

6. **Bob Generated Documentation (Agent Mode)**
   - Bob created a client-ready migration report
   - Bob documented full endpoint mappings (legacy → modern)
   - Bob provided production hardening recommendations

**Key Migration Patterns:**

| Legacy (.NET Framework 4.8)     | Modern (.NET 8 Minimal API)            |
|---------------------------------|----------------------------------------|
| `ApiController`                 | Minimal API route groups               |
| `IHttpActionResult`             | `Results.Ok()`, `Results.NotFound()`, etc. |
| `Web.config`                    | `appsettings.json`                     |
| `Global.asax`                   | `Program.cs`                           |
| Manual `new ServiceName()`      | Built-in DI container                  |
| `WebApiConfig.cs`               | `Program.cs` route registration        |

---

## 📚 Resources

- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [Minimal APIs Overview](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [Migrating from ASP.NET to ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/migration/proper-to-2x/)
- [Dependency Injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)

---

## 🆘 Troubleshooting

**"dotnet command not found":**

```bash
# Install .NET 8 SDK from:
# https://dotnet.microsoft.com/download/dotnet/8.0
```

**Port 5088 already in use:**

```bash
# Find and kill the process
lsof -i :5088
kill -9 <PID>

# Or change the port in Properties/launchSettings.json
```

**Build errors after migration:**

```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

**Legacy app won't run (Windows only):**

- The legacy .NET Framework 4.8 app requires Windows + Visual Studio
- On macOS/Linux, use it as source code only for Bob analysis
- The migrated .NET 8 app runs on all platforms

**Need help:** Use Bob's Ask mode or check with your instructor

---

## ✨ Congratulations!

You've completed the .NET Framework to .NET 8 Migration Lab! You now have practical experience using Bob AI to:

- Analyze and understand legacy enterprise applications
- Perform complex multi-file migrations in a single pass
- Modernize architecture patterns end-to-end
- Ensure quality through automated code review
- Generate tests and stakeholder-ready documentation

**Next Steps:**

- Apply these migration techniques to your own legacy projects
- Explore Bob's capabilities for other modernization scenarios
- Share your migration experience with your team
- Continue learning about .NET 8 features and best practices

---