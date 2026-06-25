using LegacyTaxPortal.WebApi.Framework48.DTOs;
using System.Linq;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class DashboardService
    {
        private readonly TaxCalculationService _calculationService = new TaxCalculationService();

        public DashboardSummary GetSummary()
        {
            var filings = InMemoryTaxRepository.Filings;
            return new DashboardSummary
            {
                TotalTaxPayers = InMemoryTaxRepository.TaxPayers.Count,
                TotalFilings = filings.Count,
                DraftFilings = filings.Count(f => f.ReviewStatus == "Draft"),
                UnderReviewFilings = filings.Count(f => f.ReviewStatus == "Under Review"),
                ApprovedFilings = filings.Count(f => f.ReviewStatus == "Approved"),
                HighRiskFilings = filings.Count(f => f.RiskBand == "High"),
                TotalEstimatedTax = filings.Sum(f => _calculationService.Calculate(f).EstimatedTax)
            };
        }
    }
}
