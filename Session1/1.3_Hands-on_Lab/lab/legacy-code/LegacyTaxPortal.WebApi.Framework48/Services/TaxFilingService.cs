using LegacyTaxPortal.WebApi.Framework48.DTOs;
using LegacyTaxPortal.WebApi.Framework48.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class TaxFilingService
    {
        private readonly TaxValidationService _validationService = new TaxValidationService();
        private readonly AuditService _auditService = new AuditService();

        public IEnumerable<TaxFiling> GetAll()
        {
            return InMemoryTaxRepository.Filings.OrderByDescending(f => f.CreatedDate);
        }

        public TaxFiling GetById(int id)
        {
            return InMemoryTaxRepository.Filings.FirstOrDefault(f => f.Id == id);
        }

        public IList<string> Validate(TaxFiling filing)
        {
            return _validationService.ValidateFiling(filing);
        }

        public TaxFiling Create(TaxFiling filing)
        {
            filing.Id = InMemoryTaxRepository.Filings.Count == 0 ? 1 : InMemoryTaxRepository.Filings.Max(f => f.Id) + 1;
            filing.CreatedDate = DateTime.UtcNow;
            filing.ReviewStatus = string.IsNullOrWhiteSpace(filing.ReviewStatus) ? "Draft" : filing.ReviewStatus;
            filing.AssignedReviewer = string.IsNullOrWhiteSpace(filing.AssignedReviewer) ? "Unassigned" : filing.AssignedReviewer;
            filing.RiskBand = string.IsNullOrWhiteSpace(filing.RiskBand) ? "Medium" : filing.RiskBand;
            InMemoryTaxRepository.Filings.Add(filing);
            _auditService.Record("TaxFiling", filing.Id, "Created", "Tax filing created", "api-user");
            return filing;
        }

        public bool UpdateStatus(int id, ReviewStatusUpdateRequest request)
        {
            if (request == null || !_validationService.IsValidReviewStatus(request.Status)) return false;
            var filing = GetById(id);
            if (filing == null) return false;

            filing.ReviewStatus = request.Status;
            _auditService.Record("TaxFiling", id, "StatusUpdated", "Review status updated to " + request.Status, request.UpdatedBy);
            return true;
        }

        public bool AssignReviewer(int id, AssignReviewerRequest request)
        {
            var filing = GetById(id);
            if (filing == null || request == null || string.IsNullOrWhiteSpace(request.ReviewerName)) return false;

            filing.AssignedReviewer = request.ReviewerName;
            _auditService.Record("TaxFiling", id, "ReviewerAssigned", "Reviewer assigned to " + request.ReviewerName, request.AssignedBy);
            return true;
        }

        public bool Delete(int id)
        {
            var filing = GetById(id);
            if (filing == null) return false;
            InMemoryTaxRepository.Filings.Remove(filing);
            _auditService.Record("TaxFiling", id, "Deleted", "Tax filing deleted", "api-user");
            return true;
        }
    }
}
