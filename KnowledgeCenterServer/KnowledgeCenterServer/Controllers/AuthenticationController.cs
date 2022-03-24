using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace KnowledgeCenterServer.Controllers
{
    /// <summary>
    /// Authentification controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/auth")]
    public class AuthentificationController : Controller
    {
        private readonly IJwTokenProvider _jwTokenProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="jwTokenProvider"></param>
        public AuthentificationController(IJwTokenProvider jwTokenProvider)
        {
            _jwTokenProvider = jwTokenProvider;
        }

        /// <summary>
        /// Generate and get valid tokens in order to be authentified
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public BaseResponse<JwToken> GenerateToken([FromBody]Credentials body)
        {
            return new BaseResponse<JwToken>(_jwTokenProvider.GenerateTokens(body));
        }

        /// <summary>
        /// Get new token from refresh token
        /// </summary>
        /// <param name="tokens"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("refresh")]
        public BaseResponse<JwToken> RefreshToken([FromBody]Tokens tokens)
        {
            return new BaseResponse<JwToken>(_jwTokenProvider.GenerateTokensFromRefreshToken(tokens));
        }

        /// <summary>
        /// Logout
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.USER)]
        [HttpPost("logout")]
        public BaseResponse<bool> Logout()
        {
            _jwTokenProvider.ClearRefreshToken();
            return new BaseResponse<bool>(true);
        }

        /// <summary>
        /// Get user roles
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.USER)]
        [HttpGet("roles")]
        public BaseResponse<List<string>> GetRoles()
        {
            return new BaseResponse<List<string>>(_jwTokenProvider.GetRoles()); ;
        }
    }
}
