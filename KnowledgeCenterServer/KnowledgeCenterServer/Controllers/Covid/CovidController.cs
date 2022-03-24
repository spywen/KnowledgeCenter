using KnowledgeCenter.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KnowledgeCenter.Covid.Providers.Interfaces;
using KnowledgeCenter.Covid.Contracts;
using KnowledgeCenter.Common.Security;

namespace KnowledgeCenterServer.Controllers.Covid
{
    /// <summary>
    /// Covid controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/covid")]
    public class CovidController : Controller
    {
        private readonly ICovidProvider _covidProvider;
        private readonly ICovidImportProvider _covidImportProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="covidProvider"></param>
        /// <param name="covidImportProvider"></param>
        public CovidController(ICovidProvider covidProvider, ICovidImportProvider covidImportProvider)
        {
            _covidProvider = covidProvider;
            _covidImportProvider = covidImportProvider;
        }

        /// <summary>
        /// Get deaths
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("stats")]
        public BaseResponse<CovidStatsResponse> GetStats([FromBody]BasePaginationRequest<CovidStatsFilters> filters)
        {
            return new BaseResponse<CovidStatsResponse>(_covidProvider.GetStats(filters));
        }

        /// <summary>
        /// Execute import of data
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.ROBOT)]
        [HttpGet("import")]
        public BaseResponse<bool> ImportData()
        {
            _covidImportProvider.ImportData();
            return new BaseResponse<bool>(true);
        }
    }
}