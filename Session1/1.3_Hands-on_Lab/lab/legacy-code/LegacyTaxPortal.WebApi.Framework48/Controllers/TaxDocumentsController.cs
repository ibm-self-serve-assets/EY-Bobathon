using LegacyTaxPortal.WebApi.Framework48.DTOs;
using LegacyTaxPortal.WebApi.Framework48.Services;
using System.Web.Http;

namespace LegacyTaxPortal.WebApi.Framework48.Controllers
{
    public class TaxDocumentsController : ApiController
    {
        private readonly TaxDocumentService _documentService = new TaxDocumentService();

        [HttpGet]
        [Route("api/taxfilings/{filingId}/documents")]
        public IHttpActionResult GetDocuments(int filingId)
        {
            return Ok(_documentService.GetByFilingId(filingId));
        }

        [HttpPost]
        [Route("api/taxfilings/{filingId}/documents")]
        public IHttpActionResult AddDocument(int filingId, [FromBody] CreateTaxDocumentRequest request)
        {
            if (request == null) return BadRequest("Document payload is required.");
            var document = _documentService.Add(filingId, request);
            if (document == null) return NotFound();
            return Ok(document);
        }
    }
}
