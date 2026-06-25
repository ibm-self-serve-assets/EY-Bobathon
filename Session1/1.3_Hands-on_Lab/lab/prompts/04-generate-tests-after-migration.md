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
