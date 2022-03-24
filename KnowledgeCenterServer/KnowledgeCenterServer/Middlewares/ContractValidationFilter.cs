using KnowledgeCenter.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace KnowledgeCenterServer.Middlewares
{
    /// <summary>
    /// Validate contract model
    /// </summary>
    public class ContractValidationFilter : ActionFilterAttribute
    {
        /// <summary>
        /// On API call
        /// </summary>
        /// <param name="context"></param>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                throw new HandledException(ErrorCode.UNKNOWN, context.ModelState);
            }
        }
    }
}
