using System.Web.Http;

namespace LegacyTaxPortal.WebApi.Framework48
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(App_Start.WebApiConfig.Register);
        }
    }
}
