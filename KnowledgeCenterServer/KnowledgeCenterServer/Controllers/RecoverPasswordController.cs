using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Providers._Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers
{
    /// <summary>
    /// Recover password controller
    /// </summary>
    [AllowAnonymous]
    [Produces("application/json")]
    [Route("api/password/recover")]
    public class RecoverPasswordController : Controller
    {
        private readonly IRecoverPasswordProvider _recoverPasswordProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="recoverPasswordProvider"></param>
        public RecoverPasswordController(IRecoverPasswordProvider recoverPasswordProvider)
        {
            _recoverPasswordProvider = recoverPasswordProvider;
        }

        /// <summary>
        /// Ask to for recover password
        /// </summary>
        /// <param name="ask"></param>
        /// <returns></returns>
        [HttpPost("ask")]
        public void AskForRecoverPassword([FromBody]AskForRecoverPassword ask)
        {
            _recoverPasswordProvider.AskForRecoverPassword(ask);
        }

        /// <summary>
        /// Try to recover password thanks to recover token
        /// </summary>
        /// <param name="recoverPassword"></param>
        /// <returns></returns>
        [HttpPost]
        public void RecoverPasswordThanksToToken([FromBody]RecoverPassword recoverPassword)
        {
            _recoverPasswordProvider.RecoverPasswordThanksToToken(recoverPassword);
        }
    }
}
