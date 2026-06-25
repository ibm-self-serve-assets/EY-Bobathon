using LegacyTaxPortal.WebApi.Framework48.DTOs;
using LegacyTaxPortal.WebApi.Framework48.Models;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class TaxCalculationService
    {
        public TaxCalculationResult Calculate(TaxFiling filing)
        {
            var taxableIncome = filing.AnnualIncome - filing.DeductionAmount;
            if (taxableIncome < 0) taxableIncome = 0;

            var estimatedTax = CalculateEstimatedTax(taxableIncome, filing.FilingType);
            var effectiveRate = filing.AnnualIncome == 0 ? 0 : estimatedTax / filing.AnnualIncome;
            var riskBand = CalculateRiskBand(filing, taxableIncome, effectiveRate);

            return new TaxCalculationResult
            {
                FilingId = filing.Id,
                TaxPayerName = filing.TaxPayerName,
                TaxYear = filing.TaxYear,
                AnnualIncome = filing.AnnualIncome,
                DeductionAmount = filing.DeductionAmount,
                TaxableIncome = taxableIncome,
                EstimatedTax = estimatedTax,
                EffectiveTaxRate = effectiveRate,
                RiskBand = riskBand,
                ReviewRecommendation = GetReviewRecommendation(riskBand)
            };
        }

        private decimal CalculateEstimatedTax(decimal taxableIncome, string filingType)
        {
            if (filingType == "Individual")
            {
                if (taxableIncome <= 100000m) return taxableIncome * 0.10m;
                if (taxableIncome <= 500000m) return taxableIncome * 0.20m;
                return taxableIncome * 0.30m;
            }

            if (filingType == "Partnership")
            {
                return taxableIncome * 0.24m;
            }

            return taxableIncome * 0.21m;
        }

        private string CalculateRiskBand(TaxFiling filing, decimal taxableIncome, decimal effectiveRate)
        {
            if (filing.DeductionAmount > filing.AnnualIncome * 0.30m) return "High";
            if (taxableIncome > 500000m || effectiveRate < 0.10m) return "Medium";
            return "Low";
        }

        private string GetReviewRecommendation(string riskBand)
        {
            if (riskBand == "High") return "Enhanced review required";
            if (riskBand == "Medium") return "Standard review required";
            return "Auto-approval candidate";
        }
    }
}
