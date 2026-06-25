using LegacyTaxPortal.WebApi.Framework48.DTOs;
using LegacyTaxPortal.WebApi.Framework48.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class TaxDocumentService
    {
        private readonly AuditService _auditService = new AuditService();

        public IEnumerable<TaxDocument> GetByFilingId(int filingId)
        {
            return InMemoryTaxRepository.Documents.Where(d => d.FilingId == filingId);
        }

        public TaxDocument Add(int filingId, CreateTaxDocumentRequest request)
        {
            if (!InMemoryTaxRepository.Filings.Any(f => f.Id == filingId)) return null;

            var doc = new TaxDocument
            {
                Id = InMemoryTaxRepository.Documents.Count == 0 ? 1 : InMemoryTaxRepository.Documents.Max(d => d.Id) + 1,
                FilingId = filingId,
                DocumentName = request.DocumentName,
                DocumentType = request.DocumentType,
                UploadedBy = request.UploadedBy,
                UploadedDate = DateTime.UtcNow
            };

            InMemoryTaxRepository.Documents.Add(doc);
            _auditService.Record("TaxDocument", doc.Id, "Uploaded", "Document uploaded for filing " + filingId, request.UploadedBy);
            return doc;
        }
    }
}
