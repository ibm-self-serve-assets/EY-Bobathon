using LegacyTaxPortal.WebApi.Framework48.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class AuditService
    {
        public IEnumerable<AuditEvent> GetAll()
        {
            return InMemoryTaxRepository.AuditEvents.OrderByDescending(e => e.EventDate);
        }

        public void Record(string entityName, int entityId, string eventType, string message, string performedBy)
        {
            var nextId = InMemoryTaxRepository.AuditEvents.Count == 0 ? 1 : InMemoryTaxRepository.AuditEvents.Max(e => e.Id) + 1;
            InMemoryTaxRepository.AuditEvents.Add(new AuditEvent
            {
                Id = nextId,
                EntityName = entityName,
                EntityId = entityId,
                EventType = eventType,
                Message = message,
                PerformedBy = string.IsNullOrWhiteSpace(performedBy) ? "system" : performedBy,
                EventDate = DateTime.UtcNow
            });
        }
    }
}
