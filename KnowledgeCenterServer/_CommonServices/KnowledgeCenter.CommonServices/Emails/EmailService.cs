using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Linq;
using System.Text;
using KnowledgeCenter.CommonServices.Contracts._Interfaces;
using KnowledgeCenter.Common;

namespace KnowledgeCenter.CommonServices.Emails
{
    public class EmailService : IEmailService
    {
        private readonly IOptions<EmailSettings> _config;
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IEmailTemplateBuilder _emailTemplateBuilder;
        private readonly ISendGridClient _sendGridClient;

        public EmailService(IOptions<EmailSettings> config,
            KnowledgeCenterContext knowledgeCenterContext,
            IEmailTemplateBuilder emailTemplateBuilder,
            ISendGridClient sendGridClient)
        {
            _config = config;
            _knowledgeCenterContext = knowledgeCenterContext;
            _emailTemplateBuilder = emailTemplateBuilder;
            _sendGridClient = sendGridClient;
        }

        public void SendEmail(User to, string subject, IEmailModel model)
        {
            EmailAddress from = new EmailAddress(_config.Value.FromAddress, _config.Value.FromName);
            subject = FormatSubject(subject);
            SendGridMessage msg = MailHelper.CreateSingleEmail(from, new EmailAddress(to.Email), subject, null, _emailTemplateBuilder.GenerateEmail(model));

            ThrowExceptionIfTooManyEmailsSent();
            LogEmail(to.Id, subject);

            if (!string.IsNullOrEmpty(_config.Value.ApiKey))
            {
                _sendGridClient.SendEmailAsync(msg).GetAwaiter().GetResult();
            }
        }

        private string FormatSubject(string providedSubject)
        {
            var subject = new StringBuilder();
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (environment != EnvironmentEnum.Production.ToString())
            {
                subject.Append($"[{environment.ToUpper()}]");
            }
            subject.Append("[Knowledge center portal] ");
            subject.Append(providedSubject);
            return subject.ToString();
        }

        private void LogEmail(int userId, string subject)
        {
            var emailLog = new EmailLog
            {
                Date = DateTime.UtcNow,
                UserId = userId,
                Subject = subject
            };
            _knowledgeCenterContext.EmailLogs.Add(emailLog);
            _knowledgeCenterContext.SaveChanges();
        }

        private void ThrowExceptionIfTooManyEmailsSent()
        {
            var oneMinuteAgo = DateTime.UtcNow.AddMinutes(-1);
            if (_knowledgeCenterContext.EmailLogs.Count(x => x.Date > oneMinuteAgo) >= _config.Value.LimitPerMinutes)
            {
                throw new HandledException(ErrorCode.SYSTEM_BUSY, "Too many emails sent during last minute. Email sender system automatically locked.");
            }

            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
            if (_knowledgeCenterContext.EmailLogs.Count(x => x.Date > oneMonthAgo) >= _config.Value.LimitPerMonth)
            {
                throw new HandledException(ErrorCode.EMAIL_LIMIT_REACHED, "Too many emails sent during last month for the current environment. Email sender system automatically locked.");
            }
        }
    }
}
