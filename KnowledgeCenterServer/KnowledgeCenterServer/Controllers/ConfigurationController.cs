using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers
{
    /// <summary>
    /// Configuration controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/configurations")]
    public class ConfigurationController : Controller
    {
        private readonly IConfigurationProvider _configurationProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="configurationProvider"></param>
        public ConfigurationController(IConfigurationProvider configurationProvider)
        {
            _configurationProvider = configurationProvider;
        }

        /// <summary>
        /// Ping
        /// </summary>
        /// <returns></returns>
        [HttpGet("ping")]
        public BaseResponse<Configurations> Ping()
        {
            return new BaseResponse<Configurations>(_configurationProvider.GetConfigurations());
        }

        /// <summary>
        /// SPing: S for secured
        /// Mainly use for testing purpose
        /// </summary>
        /// <returns></returns>
        [HttpGet("sping")]
        [Authorize(Roles = EnumRoles.USER)]
        public BaseResponse<Configurations> SPing()
        {
            return new BaseResponse<Configurations>(_configurationProvider.GetConfigurations());
        }

        /// <summary>
        /// Initialize serie of data for e2e testing
        /// Secured by: only if environment is "E2e" (inside provider)
        /// </summary>
        /// <returns></returns>
        [HttpPost("e2e/init")]
        public BaseResponse<bool> InitializeE2ETestingData()
        {
            return new BaseResponse<bool>(_configurationProvider.InitializeE2ETestingData());
        }

        /// <summary>
        /// Get last  token for E2E tetsing purpose
        /// </summary>
        /// <returns></returns>
        [HttpGet("e2e/lasttokens")]
        public BaseResponse<LastTokens> GetLastTokensForE2eTestingPurpose()
        {
            return new BaseResponse<LastTokens>(_configurationProvider.GetLastTokensForE2eTestingPurpose());
        }
    }
}
