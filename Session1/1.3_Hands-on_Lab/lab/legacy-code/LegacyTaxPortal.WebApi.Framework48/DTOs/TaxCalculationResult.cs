namespace LegacyTaxPortal.WebApi.Framework48.DTOs
{
    public class TaxCalculationResult
    {
        public int FilingId { get; set; }
        public string TaxPayerName { get; set; }
        public string TaxYear { get; set; }
        public decimal AnnualIncome { get; set; }
        public decimal DeductionAmount { get; set; }
        public decimal TaxableIncome { get; set; }
        public decimal EstimatedTax { get; set; }
        public decimal EffectiveTaxRate { get; set; }
        public string RiskBand { get; set; }
        public string ReviewRecommendation { get; set; }
    }
}
