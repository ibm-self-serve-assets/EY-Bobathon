using LegacyTaxPortal.WebApi.Framework48.Models;
using LegacyTaxPortal.WebApi.Framework48.Services;
using System.Web.Http;

namespace LegacyTaxPortal.WebApi.Framework48.Controllers
{
    public class TaxPayersController : ApiController
    {
        private readonly TaxPayerService _taxPayerService = new TaxPayerService();

        [HttpGet]
        [Route("api/taxpayers")]
        public IHttpActionResult GetTaxPayers()
        {
            return Ok(_taxPayerService.GetAll());
        }

        [HttpGet]
        [Route("api/taxpayers/{id}")]
        public IHttpActionResult GetTaxPayer(int id)
        {
            var taxPayer = _taxPayerService.GetById(id);
            if (taxPayer == null) return NotFound();
            return Ok(taxPayer);
        }

        [HttpPost]
        [Route("api/taxpayers")]
        public IHttpActionResult CreateTaxPayer(TaxPayer taxPayer)
        {
            if (taxPayer == null) return BadRequest("Taxpayer payload is required.");
            return Ok(_taxPayerService.Create(taxPayer));
        }
    }
}
