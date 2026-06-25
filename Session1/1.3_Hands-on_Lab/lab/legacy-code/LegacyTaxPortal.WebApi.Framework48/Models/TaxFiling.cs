using System;

namespace LegacyTaxPortal.WebApi.Framework48.Models
{
    public class TaxFiling
    {
        public int Id { get; set; }
        public int TaxPayerId { get; set; }
        public string TaxPayerName { get; set; }
        public string TaxYear { get; set; }
        public string FilingType { get; set; }
        public decimal AnnualIncome { get; set; }
        public decimal DeductionAmount { get; set; }
        public string ReviewStatus { get; set; }
        public string AssignedReviewer { get; set; }
        public string RiskBand { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
