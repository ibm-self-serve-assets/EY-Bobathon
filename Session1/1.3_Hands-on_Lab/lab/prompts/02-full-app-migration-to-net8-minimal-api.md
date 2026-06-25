Migrate the full `.NET Framework 4.8` ASP.NET Web API tax application into a modern `.NET 8 Minimal API`.

Source: `@legacy-code/LegacyTaxPortal.WebApi.Framework48`
Target: `@migration-code/ModernTaxPortal.MinimalApi.Net8`

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
