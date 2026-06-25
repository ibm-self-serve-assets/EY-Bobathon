using LegacyTaxPortal.WebApi.Framework48.Models;
using System.Collections.Generic;
using System.Linq;

namespace LegacyTaxPortal.WebApi.Framework48.Services
{
    public class TaxPayerService
    {
        public IEnumerable<TaxPayer> GetAll()
        {
            return InMemoryTaxRepository.TaxPayers;
        }

        public TaxPayer GetById(int id)
        {
            return InMemoryTaxRepository.TaxPayers.FirstOrDefault(t => t.Id == id);
        }

        public TaxPayer Create(TaxPayer taxPayer)
        {
            taxPayer.Id = InMemoryTaxRepository.TaxPayers.Count == 0 ? 1 : InMemoryTaxRepository.TaxPayers.Max(t => t.Id) + 1;
            taxPayer.IsActive = true;
            InMemoryTaxRepository.TaxPayers.Add(taxPayer);
            return taxPayer;
        }
    }
}
