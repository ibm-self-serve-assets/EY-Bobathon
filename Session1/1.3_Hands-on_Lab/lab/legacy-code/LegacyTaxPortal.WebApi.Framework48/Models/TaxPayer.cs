namespace LegacyTaxPortal.WebApi.Framework48.Models
{
    public class TaxPayer
    {
        public int Id { get; set; }
        public string TaxPayerName { get; set; }
        public string TaxIdentifier { get; set; }
        public string EntityType { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public bool IsActive { get; set; }
    }
}
