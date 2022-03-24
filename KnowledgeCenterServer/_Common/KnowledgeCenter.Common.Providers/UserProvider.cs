using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Entities = KnowledgeCenter.DataConnector.Entities;
using AutoMapper;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.CommonServices.Contracts;
using Microsoft.Extensions.Options;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.Common.Security;

namespace KnowledgeCenter.Common.Providers
{
    public class UserProvider : IUserProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IPasswordProvider _passwordProvider;
        private readonly IIdentityProvider _identityProvider;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly IOptions<SiteSettings> _config;

        public UserProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IPasswordProvider passwordProvider,
            IIdentityProvider identityProvider,
            IEmailService emailService,
            IMapper mapper,
            IOptions<SiteSettings> config)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _passwordProvider = passwordProvider;
            _identityProvider = identityProvider;
            _emailService = emailService;
            _mapper = mapper;
            _config = config;
        }

        public User CreateUser(CreateOrUpdateUser userFacade)
        {
            if (_knowledgeCenterContext.Users.Any(x => x.Login.ToUpper() == userFacade.Login.ToUpper()
                                                    || x.Email.ToUpper() == userFacade.Email.ToUpper()))
            {
                throw new HandledException(ErrorCode.SIGNIN_ALREADYEXIST);
            }

            var password = _passwordProvider.GenerateNewSaltedPassword(userFacade.NewPassword);
            var now = DateTime.Now;
            var activationToken = Guid.NewGuid().SanitizeGuid();
            var user = new Entities.User
            {
                Firstname = userFacade.Firstname,
                Lastname = userFacade.Lastname,
                Email = userFacade.Email,
                Login = userFacade.Login,
                CreationDate = now,
                ModificationDate = now,
                LastConnection = now,
                IsActive = false,
                PasswordTryCount = 0,
                Password = password.PasswordHashed,
                Salt = password.Salt,
                AgencyId = userFacade.AgencyId,
                ServiceLineId = userFacade.ServiceLineId,
                ActivationToken = activationToken
            };

            _knowledgeCenterContext.Users.Add(user);
            _knowledgeCenterContext.SaveChanges();

            _emailService.SendEmail(user, "Account activation", new AccountActivationModel
            {
                activationUrl = $"{_config.Value.AppUrl}/activate?token={activationToken}",
                appUrl = _config.Value.AppUrl,
                username = user.Firstname
            });

            return GetUser(user.Id);
        }

        public string ActivateAccount(string token)
        {
            var user = _knowledgeCenterContext.Users.SingleOrDefault(x => x.ActivationToken == token);
            if (user == null)
            {
                throw new HandledException(ErrorCode.SIGNIN_ACTIVATION_INVALIDTOKEN);
            }

            user.ActivationToken = null;
            user.IsActive = true;
            _knowledgeCenterContext.Update(user);
            _knowledgeCenterContext.SaveChanges();
            return user.Login;
        }

        public User UpdateUser(CreateOrUpdateUser userFacade)
        {
            var user = _knowledgeCenterContext.Users.FirstOrDefault(x => x.Id == userFacade.Id);
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            Debug.Assert(user != null, nameof(user) + " != null");
            if ((user.Id != connectedUser.Id && !connectedUser.IsAdmin()) ||
                (user.IsDeleted && !connectedUser.IsAdmin()))
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            if (string.IsNullOrWhiteSpace(userFacade.NewPassword) && string.IsNullOrWhiteSpace(userFacade.OldPassword))
            {
                // Do nothing
            }
            else if (!string.IsNullOrWhiteSpace(userFacade.NewPassword) && !string.IsNullOrWhiteSpace(userFacade.OldPassword))
            {
                if (connectedUser.IsAdmin() && connectedUser.Id != userFacade.Id)
                {
                    var admin = _knowledgeCenterContext.Users.FirstOrDefault(x => x.Id == connectedUser.Id);
                    if (_passwordProvider.IsHistoricPassword(userFacade.OldPassword, admin.Salt, admin.Password))
                    {
                        var newHashedPassword = _passwordProvider.GenerateNewSaltedPassword(userFacade.NewPassword);
                        user.Password = newHashedPassword.PasswordHashed;
                        user.Salt = newHashedPassword.Salt;
                    }
                    else
                    {
                        throw new HandledException(ErrorCode.USER_ADMIN_INVALIDADMINPASSWORD);
                    }
                }
                else
                {
                    if (_passwordProvider.IsHistoricPassword(userFacade.OldPassword, user.Salt, user.Password))
                    {
                        var newHashedPassword = _passwordProvider.GenerateNewSaltedPassword(userFacade.NewPassword);
                        user.Password = newHashedPassword.PasswordHashed;
                        user.Salt = newHashedPassword.Salt;
                    }
                    else
                    {
                        throw new HandledException(ErrorCode.USER_INVALIDOLDPASSWORD);
                    }

                }
            }
            else
            {
                throw new HandledException(ErrorCode.INVALID_ACTION,
                    "Password update impossible. Please provide both old and new password");
            }

            user.Email = userFacade.Email;
            user.Firstname = userFacade.Firstname;
            user.Lastname = userFacade.Lastname;
            user.Login = userFacade.Login;
            user.ModificationDate = DateTime.Now;
            user.AgencyId = userFacade.AgencyId;
            user.ServiceLineId = userFacade.ServiceLineId;

            if (connectedUser.IsAdmin())
            {
                user.PasswordTryCount = userFacade.PasswordTryCount;
                user.IsActive = userFacade.IsActive;
            }

            _knowledgeCenterContext.Users.Update(user);
            _knowledgeCenterContext.SaveChanges();

            userFacade.OldPassword = string.Empty;
            userFacade.NewPassword = string.Empty;

            return GetUser(user.Id);
        }

        public List<User> GetAllUsers()
        {
            return _knowledgeCenterContext.Users
                .Where(x => !x.IsDeleted)
                .Include(x => x.Agency)
                .Include(x => x.ServiceLine)
                .Select(x => _mapper.Map<User>(x))
                .ToList();
        }

        public User GetConnectedUser()
        {
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            return _knowledgeCenterContext.Users
                .Where(x => x.Id == connectedUser.Id && !x.IsDeleted)
                .Include(x => x.Agency)
                .Include(x => x.ServiceLine)
                .Select(x => _mapper.Map<User>(x))
                .Single();
        }

        public User GetUser(int id)
        {
            return _mapper.Map<User>(GetUserEntity(id));
        }

        private Entities.User GetUserEntity(int id)
        {
            if (!_knowledgeCenterContext.Users.Any(x => x.Id == id))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.Users
                .Include(x => x.Agency)
                .Include(x => x.ServiceLine)
                .Single(x => x.Id == id);
        }

        public void DeleteUser(int id)
        {
            var user = _knowledgeCenterContext.Users.Single(x => x.Id == id);
            user.IsDeleted = true;
            _knowledgeCenterContext.SaveChanges();
        }
    }
}
