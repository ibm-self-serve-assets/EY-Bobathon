Analyze the legacy `.NET Framework 4.8` ASP.NET Web API tax application from `@/legacy-code`.

Do not migrate or modify the application code in this phase.

Create an analysis report under: `migration-output`

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
5. Keep the report clear, structured, and suitable for a migration.
