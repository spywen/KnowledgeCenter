using Microsoft.Extensions.Options;
using SendGrid;

namespace KnowledgeCenter.CommonServices.Emails
{
    public class SendGridClientProxy : SendGridClient
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SendGridClient"/> class.
        /// https://github.com/sendgrid/sendgrid-csharp/pull/904
        /// Not a perfect solution... hopefully they will try something more clear.
        /// </summary>
        /// <param name="options">An <see cref="IOptions{SendGridClientOptions}"/> instance specifying the configuration to be used with the client.</param>
        public SendGridClientProxy(IOptions<SendGridClientOptions> options)
            : base(options?.Value)
        {
        }
    }
}
