using LegacyTaxPortal.WebApi.Framework48.Services;
using System.Web.Http;

namespace LegacyTaxPortal.WebApi.Framework48.Controllers
{
    public class DashboardController : ApiController
    {
        private readonly DashboardService _dashboardService = new DashboardService();

        [HttpGet]
        [Route("api/dashboard/summary")]
        public IHttpActionResult GetSummary()
        {
            return Ok(_dashboardService.GetSummary());
        }
    }
}
