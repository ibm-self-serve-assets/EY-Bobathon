using LegacyTaxPortal.WebApi.Framework48.Models;
using System;
using System.Collections.Generic;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public static class InMemoryTaxRepository
    {
        public static readonly List<TaxPayer> TaxPayers = new List<TaxPayer>
        {
            new TaxPayer { Id = 1, TaxPayerName = "Acme Consulting LLC", TaxIdentifier = "EIN-10-1001", EntityType = "Corporate", Country = "USA", State = "NY", IsActive = true },
            new TaxPayer { Id = 2, TaxPayerName = "Northwind Advisory Services", TaxIdentifier = "EIN-10-1002", EntityType = "Partnership", Country = "USA", State = "TX", IsActive = true },
            new TaxPayer { Id = 3, TaxPayerName = "Priya Mehta", TaxIdentifier = "PAN-PRM-2025", EntityType = "Individual", Country = "India", State = "GJ", IsActive = true }
        };

        public static readonly List<TaxFiling> Filings = new List<TaxFiling>
        {
            new TaxFiling { Id = 1, TaxPayerId = 1, TaxPayerName = "Acme Consulting LLC", TaxYear = "2025", FilingType = "Corporate", AnnualIncome = 250000m, DeductionAmount = 40000m, ReviewStatus = "Draft", AssignedReviewer = "Unassigned", RiskBand = "Medium", CreatedDate = new DateTime(2026, 1, 10) },
            new TaxFiling { Id = 2, TaxPayerId = 2, TaxPayerName = "Northwind Advisory Services", TaxYear = "2025", FilingType = "Partnership", AnnualIncome = 780000m, DeductionAmount = 120000m, ReviewStatus = "Under Review", AssignedReviewer = "Alicia Brown", RiskBand = "High", CreatedDate = new DateTime(2026, 1, 12) },
            new TaxFiling { Id = 3, TaxPayerId = 3, TaxPayerName = "Priya Mehta", TaxYear = "2025", FilingType = "Individual", AnnualIncome = 90000m, DeductionAmount = 15000m, ReviewStatus = "Approved", AssignedReviewer = "Rahul Shah", RiskBand = "Low", CreatedDate = new DateTime(2026, 1, 15) }
        };

        public static readonly List<TaxDocument> Documents = new List<TaxDocument>
        {
            new TaxDocument { Id = 1, FilingId = 1, DocumentName = "income-statement.pdf", DocumentType = "Income Statement", UploadedBy = "system", UploadedDate = new DateTime(2026, 1, 10) },
            new TaxDocument { Id = 2, FilingId = 1, DocumentName = "deductions.xlsx", DocumentType = "Deduction Worksheet", UploadedBy = "system", UploadedDate = new DateTime(2026, 1, 11) }
        };

        public static readonly List<AuditEvent> AuditEvents = new List<AuditEvent>
        {
            new AuditEvent { Id = 1, EntityName = "TaxFiling", EntityId = 1, EventType = "Created", Message = "Tax filing created", PerformedBy = "system", EventDate = new DateTime(2026, 1, 10) },
            new AuditEvent { Id = 2, EntityName = "TaxFiling", EntityId = 2, EventType = "ReviewStarted", Message = "Review started", PerformedBy = "Alicia Brown", EventDate = new DateTime(2026, 1, 13) }
        };
    }
}
