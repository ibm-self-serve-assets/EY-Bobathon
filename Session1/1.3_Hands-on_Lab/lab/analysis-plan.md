# Legacy .NET Framework 4.8 → .NET 8 Minimal API — Analysis Plan

## Top-Level Overview

Produce a comprehensive, structured migration analysis report for the legacy `LegacyTaxPortal.WebApi.Framework48` ASP.NET Web API application.
The report will be written to `migration-output/legacy-analysis-report.md`.
No application code is modified in this phase — this is analysis only.

The report must cover all nine topics listed in the prompt (architecture, endpoints, domain model, calculation flow, validation, legacy patterns, file-level migration impact, risks/blockers, and migration sequence), plus the five report expectations (file-level impact, reuse vs refactor, controller-to-endpoint mapping, risks, and clear structure).

---

## Sub-Tasks

### Sub-Task 1 — Write Migration Analysis Report

**Status:** [ ] pending

**Intent**
Write the complete analysis report to `migration-output/legacy-analysis-report.md`.
The document is self-contained and becomes the primary deliverable for this engagement phase.

**Expected Outcomes**
- File `migration-output/legacy-analysis-report.md` exists and is fully populated.
- All nine required sections are present.
- All five report expectations are met.
- No application source files are modified.

**Todo List**
1. Create `migration-output/legacy-analysis-report.md`.
2. Write **Section 1 — Current Application Architecture**: layered design, namespace structure, startup pipeline (Global.asax → WebApiConfig), static in-memory repository, absence of DI.
3. Write **Section 2 — API Endpoints and Route Structure**: full 14-endpoint table with HTTP verb, route, controller, action, request body, and response type.
4. Write **Section 3 — Tax Domain Model and Terminology**: all four models (TaxPayer, TaxFiling, TaxDocument, AuditEvent), all five DTOs, data relationships, string-enum fields and their allowed values.
5. Write **Section 4 — Tax Calculation Flow**: step-by-step walkthrough of `TaxCalculationService.Calculate()`, tax bracket tables per filing type, risk-band logic, review recommendation mapping, worked example.
6. Write **Section 5 — Validation Logic**: rules in `TaxValidationService.ValidateFiling()`, valid review-status enumeration, inline controller null-checks, what is NOT validated.
7. Write **Section 6 — Legacy Framework Patterns**: `ApiController` inheritance, `IHttpActionResult` returns, `HttpConfiguration`-based route registration, `Global.asax` application lifecycle, `Newtonsoft.Json` serialisation, absence of middleware pipeline.
8. Write **Section 7 — File-Level Migration Impact Analysis**: table for every source file with: reuse-as-is / needs-refactoring / needs-replacement classification, primary reason, and migration effort (Low / Medium / High).
9. Write **Section 8 — Migration Risks and Blockers**: categorised as 🔴 Blocker, 🟡 High, 🟢 Low with description, current state, and recommended action for each.
10. Write **Section 9 — Recommended Migration Sequence**: ordered phases (Infrastructure → Models/Enums → Persistence → Services → API layer → Auth → Testing → Docs), with the rationale for sequencing.
11. Write **Section 10 — Controller-to-Minimal-API Endpoint Mapping**: table mapping each existing controller action to its proposed .NET 8 Minimal API `app.MapXxx(...)` signature.
12. Write **Section 11 — Assumptions and Missing Information**: document decisions that are deferred (database engine, auth provider, deployment target, async strategy, test framework).

**Relevant Context**
- Source: `legacy-code/LegacyTaxPortal.WebApi.Framework48/`
- Key files:
  - `App_Start/WebApiConfig.cs` — route config
  - `Global.asax.cs` — startup
  - `Controllers/*.cs` — 5 controllers, 14 endpoints
  - `Models/*.cs` — 4 domain models
  - `DTOs/*.cs` — 5 DTOs
  - `Services/*.cs` — 8 services including `TaxCalculationService`, `TaxValidationService`, `InMemoryTaxRepository`
  - `Web.config` — framework target, IIS settings
  - `packages.config` — NuGet dependencies (ASP.NET WebApi 5.2.9, Newtonsoft.Json 13.0.3)
- Output destination: `migration-output/legacy-analysis-report.md`
