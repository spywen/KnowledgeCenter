using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Providers._Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers.Common
{
    /// <summary>
    /// Role controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/common")]
    [AllowAnonymous]
    public class CommonController : Controller
    {
        private readonly ICountryProvider _countryProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="countryProvider"></param>
        public CommonController(ICountryProvider countryProvider)
        {
            _countryProvider = countryProvider;
        }

        /// <summary>
        /// Get countries
        /// </summary>
        /// <returns></returns>
        [HttpGet("country")]
        public BaseResponse<List<Country>> GetCountries()
        {
            return new BaseResponse<List<Country>>(_countryProvider.GetCountries());
        }
    }
}
