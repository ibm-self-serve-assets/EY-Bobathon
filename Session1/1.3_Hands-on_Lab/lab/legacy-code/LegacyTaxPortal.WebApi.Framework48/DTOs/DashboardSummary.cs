namespace LegacyTaxPortal.WebApi.Framework48.DTOs
{
    public class DashboardSummary
    {
        public int TotalTaxPayers { get; set; }
        public int TotalFilings { get; set; }
        public int DraftFilings { get; set; }
        public int UnderReviewFilings { get; set; }
        public int ApprovedFilings { get; set; }
        public int HighRiskFilings { get; set; }
        public decimal TotalEstimatedTax { get; set; }
    }
}
