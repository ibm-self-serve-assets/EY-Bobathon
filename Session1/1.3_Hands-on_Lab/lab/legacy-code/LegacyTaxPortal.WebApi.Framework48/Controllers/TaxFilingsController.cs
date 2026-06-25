using LegacyTaxPortal.WebApi.Framework48.DTOs;
using LegacyTaxPortal.WebApi.Framework48.Models;
using LegacyTaxPortal.WebApi.Framework48.Services;
using System.Linq;
using System.Web.Http;

namespace LegacyTaxPortal.WebApi.Framework48.Controllers
{
    public class TaxFilingsController : ApiController
    {
        private readonly TaxFilingService _filingService = new TaxFilingService();
        private readonly TaxCalculationService _calculationService = new TaxCalculationService();

        [HttpGet]
        [Route("api/taxfilings")]
        public IHttpActionResult GetTaxFilings()
        {
            return Ok(_filingService.GetAll());
        }

        [HttpGet]
        [Route("api/taxfilings/{id}")]
        public IHttpActionResult GetTaxFiling(int id)
        {
            var filing = _filingService.GetById(id);
            if (filing == null) return NotFound();
            return Ok(filing);
        }

        [HttpPost]
        [Route("api/taxfilings")]
        public IHttpActionResult CreateTaxFiling(TaxFiling filing)
        {
            var errors = _filingService.Validate(filing);
            if (errors.Any()) return BadRequest(string.Join("; ", errors));
            return Ok(_filingService.Create(filing));
        }

        [HttpGet]
        [Route("api/taxfilings/{id}/calculation")]
        public IHttpActionResult GetTaxCalculation(int id)
        {
            var filing = _filingService.GetById(id);
            if (filing == null) return NotFound();
            return Ok(_calculationService.Calculate(filing));
        }

        [HttpPut]
        [Route("api/taxfilings/{id}/status")]
        public IHttpActionResult UpdateReviewStatus(int id, [FromBody] ReviewStatusUpdateRequest request)
        {
            var updated = _filingService.UpdateStatus(id, request);
            if (!updated) return BadRequest("Invalid filing id or review status.");
            return Ok();
        }

        [HttpPut]
        [Route("api/taxfilings/{id}/reviewer")]
        public IHttpActionResult AssignReviewer(int id, [FromBody] AssignReviewerRequest request)
        {
            var updated = _filingService.AssignReviewer(id, request);
            if (!updated) return BadRequest("Invalid filing id or reviewer.");
            return Ok();
        }

        [HttpDelete]
        [Route("api/taxfilings/{id}")]
        public IHttpActionResult DeleteTaxFiling(int id)
        {
            var deleted = _filingService.Delete(id);
            if (!deleted) return NotFound();
            return Ok();
        }
    }
}
