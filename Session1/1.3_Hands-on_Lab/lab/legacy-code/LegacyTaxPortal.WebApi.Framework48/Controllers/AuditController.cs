using LegacyTaxPortal.WebApi.Framework48.Services;
using System.Web.Http;

namespace LegacyTaxPortal.WebApi.Framework48.Controllers
{
    public class AuditController : ApiController
    {
        private readonly AuditService _auditService = new AuditService();

        [HttpGet]
        [Route("api/audit")]
        public IHttpActionResult GetAuditEvents()
        {
            return Ok(_auditService.GetAll());
        }
    }
}
