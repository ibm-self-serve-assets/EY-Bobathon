Generate a full migration report for the `.NET Framework 4.8` ASP.NET Web API to `.NET 8 Minimal API` migration.

Use both codebases:

- Legacy source: `legacy-code/LegacyTaxPortal.WebApi.Framework48`
- Migrated source: `migration-code/ModernTaxPortal.MinimalApi.Net8`

Create or update the migration report under:`migration-output`

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
- Include validation evidence such as build status, route coverage, Swagger availability, and test status where available.
- Keep the report clear, client-ready, concise, and suitable for a migration workshop demo.
