using System;

namespace LegacyTaxPortal.WebApi.Framework48.Models
{
    public class AuditEvent
    {
        public int Id { get; set; }
        public string EventType { get; set; }
        public string EntityName { get; set; }
        public int EntityId { get; set; }
        public string Message { get; set; }
        public string PerformedBy { get; set; }
        public DateTime EventDate { get; set; }
    }
}
