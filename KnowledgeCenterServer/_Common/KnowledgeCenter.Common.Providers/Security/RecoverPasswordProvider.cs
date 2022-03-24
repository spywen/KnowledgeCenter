using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.CommonServices.Contracts;
using KnowledgeCenter.DataConnector;
using Microsoft.Extensions.Options;
using System;
using System.Linq;

namespace KnowledgeCenter.Common.Providers.Security
{
    public class RecoverPasswordProvider : IRecoverPasswordProvider
    {
        private readonly IEmailService _emailService;
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IPasswordProvider _passwordProvider;
        private readonly IOptions<SiteSettings> _config;

        public RecoverPasswordProvider(IEmailService emailService,
            KnowledgeCenterContext knowledgeCenterContext,
            IPasswordProvider passwordProvider,
            IOptions<SiteSettings> config)
        {
            _emailService = emailService;
            _knowledgeCenterContext = knowledgeCenterContext;
            _passwordProvider = passwordProvider;
            _config = config;
        }

        public void AskForRecoverPassword(AskForRecoverPassword askForRecoverPassword)
        {
            var user = _knowledgeCenterContext.Users.SingleOrDefault(x => x.Email.ToUpper() == askForRecoverPassword.Email.ToUpper());
            if (user == null)
            {
                throw new HandledException(ErrorCode.RECOVERPASSWORD_UNRECOGNIZEDEMAIL);
            }

            user.RecoverPasswordToken = Guid.NewGuid().SanitizeGuid();
            _knowledgeCenterContext.Update(user);
            _knowledgeCenterContext.SaveChanges();

            _emailService.SendEmail(user, "Password recovery", new PasswordRecoveryModel
            {
                recoverPasswordUrl = $"{_config.Value.AppUrl}/passwordrecovery?token={user.RecoverPasswordToken}",
                appUrl = _config.Value.AppUrl,
                username = user.Firstname
            });
        }

        public void RecoverPasswordThanksToToken(RecoverPassword recoverPassword)
        {
            var user = _knowledgeCenterContext.Users.SingleOrDefault(x => x.RecoverPasswordToken == recoverPassword.Token);
            if (user == null)
            {
                throw new HandledException(ErrorCode.INVALID_ACTION, "Invalid token provided to update a user password");
            }

            var newHashedPassword = _passwordProvider.GenerateNewSaltedPassword(recoverPassword.NewPassword);
            user.Password = newHashedPassword.PasswordHashed;
            user.Salt = newHashedPassword.Salt;
            user.RecoverPasswordToken = null;

            _knowledgeCenterContext.Update(user);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}
