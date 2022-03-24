using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;
using System.Net;

namespace KnowledgeCenterServer.Middlewares
{
    /// <summary>
    /// Exception filter in order to return properly error messages
    /// </summary>
    public class ExceptionFilter : ExceptionFilterAttribute
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ExceptionFilter()
        {
        }

        /// <summary>
        /// On exception
        /// </summary>
        /// <param name="context"></param>
        public override void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            var response = new BaseResponse<object> { Data = null };

            if (exception is HandledException handledException)
            {
                response.AddError(handledException.Code, handledException.EndUserMessage, exception);
                if (handledException.Data != null)
                {
                    response.Errors.First().ModelState = handledException.ModelState;
                }
            }
            else if (exception is HandledWarning handledWarning)
            {
                response.AddWarning(handledWarning.Code, handledWarning.EndUserMessage);
            }
            else if (exception is SecurityTokenException)
            {
                var tokenException = new HandledException(ErrorCode.TOKEN_ISSUE, endUserMessageParams: exception.Message);
                response.AddError(tokenException.Code, tokenException.EndUserMessage, exception);
            }
            else
            {
                var unknownException = new HandledException(ErrorCode.UNKNOWN);
                response.AddError(unknownException.Code, unknownException.EndUserMessage, exception);
            }

            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            serializerSettings.NullValueHandling = NullValueHandling.Ignore;
            var jsonResponse = new JsonResult(response, serializerSettings);
            jsonResponse.StatusCode = (int)HttpStatusCode.BadRequest;
            jsonResponse.ContentType = "application/json";

            context.Result = jsonResponse;
        }
    }
}
