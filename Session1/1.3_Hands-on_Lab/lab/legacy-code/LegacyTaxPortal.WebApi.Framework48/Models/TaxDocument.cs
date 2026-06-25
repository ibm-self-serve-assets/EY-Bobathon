using System;

namespace LegacyTaxPortal.WebApi.Framework48.Models
{
    public class TaxDocument
    {
        public int Id { get; set; }
        public int FilingId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentType { get; set; }
        public string UploadedBy { get; set; }
        public DateTime UploadedDate { get; set; }
    }
}
