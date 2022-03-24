using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;

namespace KnowledgeCenter.Common.Exceptions
{
    public class HandledException : Exception
    {
        public ModelStateDictionary ModelState;

        public ErrorCode ErrorCode { get; set; }
        private object[] EndUserMessageParams { get; set; }

        public string Code => ErrorCode.ToString();

        public string EndUserMessage
        {
            get
            {
                if (EndUserMessageParams != null)
                {
                    return string.Format(ErrorResources.ResourceManager.GetString(ErrorCode.ToString()), EndUserMessageParams);
                }
                return ErrorResources.ResourceManager.GetString(ErrorCode.ToString());
            }
        }

        public HandledException(ErrorCode errorCode)
        {
            ErrorCode = errorCode;
        }

        public HandledException(ErrorCode errorCode, params object[] endUserMessageParams)
        {
            ErrorCode = errorCode;
            EndUserMessageParams = endUserMessageParams;
        }

        public HandledException(ErrorCode errorCode, string technicalMessage) : base(technicalMessage)
        {
            ErrorCode = errorCode;
        }

        public HandledException(ErrorCode errorCode, string technicalMessage, params object[] endUserMessageParams) : base(technicalMessage)
        {
            ErrorCode = errorCode;
            EndUserMessageParams = endUserMessageParams;
        }

        public HandledException(ErrorCode errorCode, string technicalMessage, Exception e) : base(technicalMessage, e)
        {
            ErrorCode = errorCode;
        }

        public HandledException(ErrorCode errorCode, string technicalMessage, Exception e, params object[] endUserMessageParams) : base(technicalMessage, e)
        {
            ErrorCode = errorCode;
            EndUserMessageParams = endUserMessageParams;
        }

        public HandledException(ErrorCode errorCode, ModelStateDictionary modelState)
        {
            ErrorCode = errorCode;
            ModelState = modelState;
        }
    }
}
