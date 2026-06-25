using LegacyTaxPortal.WebApi.Framework48.Models;
using System.Collections.Generic;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class TaxValidationService
    {
        public IList<string> ValidateFiling(TaxFiling filing)
        {
            var errors = new List<string>();

            if (filing == null)
            {
                errors.Add("Tax filing payload is required.");
                return errors;
            }

            if (string.IsNullOrWhiteSpace(filing.TaxPayerName))
                errors.Add("Taxpayer name is required.");

            if (string.IsNullOrWhiteSpace(filing.TaxYear))
                errors.Add("Tax year is required.");

            if (filing.AnnualIncome < 0)
                errors.Add("Annual income cannot be negative.");

            if (filing.DeductionAmount < 0)
                errors.Add("Deduction amount cannot be negative.");

            if (filing.DeductionAmount > filing.AnnualIncome)
                errors.Add("Deduction amount cannot exceed annual income.");

            if (string.IsNullOrWhiteSpace(filing.FilingType))
                errors.Add("Filing type is required.");

            return errors;
        }

        public bool IsValidReviewStatus(string status)
        {
            return status == "Draft" || status == "Under Review" || status == "Approved" || status == "Rejected";
        }
    }
}
