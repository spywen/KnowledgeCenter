using System;

namespace KnowledgeCenter.Common.Exceptions
{
    public class HandledWarning : Exception
    {
        public WarningCode WarningCode { get; set; }
        private object[] EndUserMessageParams { get; set; }

        public string Code => WarningCode.ToString();

        public string EndUserMessage
        {
            get
            {
                if (EndUserMessageParams != null)
                {
                    return string.Format(WarningResources.ResourceManager.GetString(WarningCode.ToString()), EndUserMessageParams);
                }
                return WarningResources.ResourceManager.GetString(WarningCode.ToString());
            }
        }

        public HandledWarning(WarningCode code)
        {
            WarningCode = code;
        }

        public HandledWarning(WarningCode code, params object[] endUserMessageParams)
        {
            WarningCode = code;
            EndUserMessageParams = endUserMessageParams;
        }

        public HandledWarning(WarningCode code, string technicalMessage) : base(technicalMessage)
        {
            WarningCode = code;
        }

        public HandledWarning(WarningCode code, string technicalMessage, params object[] endUserMessageParams) : base(technicalMessage)
        {
            WarningCode = code;
            EndUserMessageParams = endUserMessageParams;
        }

        public HandledWarning(WarningCode code, string technicalMessage, Exception e) : base(technicalMessage, e)
        {
            WarningCode = code;
        }

        public HandledWarning(WarningCode code, string technicalMessage, Exception e, params object[] endUserMessageParams) : base(technicalMessage, e)
        {
            WarningCode = code;
            EndUserMessageParams = endUserMessageParams;
        }
    }
}
