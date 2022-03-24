using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Common.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Entities = KnowledgeCenter.DataConnector.Entities;
using KnowledgeCenter.Common._Interfaces;
using System.Security.Cryptography;

namespace KnowledgeCenter.Common.Providers.Security
{
    public class JwTokenProvider : IJwTokenProvider
    {
        private const int ConnectionTryLimit = 5;
        private const string NiceAgencyCode = "06410";
        private const string RobotLogin = "ROBOT";

        private Claim AuthentifiedRole = new Claim(CustomClaims.RoleClaimCode, EnumRoles.USER);
        private Claim RobotRole = new Claim(CustomClaims.RoleClaimCode, EnumRoles.ROBOT);

        private readonly SecuritySettings _config;
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IPasswordProvider _passwordProvider;
        private readonly IIdentityProvider _identityProvider;

        public JwTokenProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IOptions<SecuritySettings> config,
            IPasswordProvider passwordProvider,
            IIdentityProvider identityProvider)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _config = config.Value;
            _passwordProvider = passwordProvider;
            _identityProvider = identityProvider;
        }

        public JwToken GenerateTokens(Credentials credentials)
        {
            if (credentials.Login == RobotLogin && credentials.Password == _config.RobotPassword)
            {
                return GetValidRobotToken();
            } 
            else
            {
                var user = _knowledgeCenterContext.Users
                    .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                    .Include(x => x.Agency)
                    .FirstOrDefault(x => !x.IsDeleted &&
                        (x.Login.ToLower() == credentials.Login.ToLower()) || (x.Email.ToLower() == credentials.Login.ToLower()));

                if (user == null)
                {
                    throw new HandledException(ErrorCode.LOGIN_INVALIDCREDENTIALS);
                }
                else
                {
                    user = ValidateLogin(user, credentials.Password);
                }

                return GetValidUserToken(user);
            }
        }

        public JwToken GenerateTokensFromRefreshToken(Tokens tokens)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false, // do not consider expiration time of token because we specifically need to consider to refresh it becaused expired !
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config.Issuer,
                ValidAudience = _config.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.SecretKey))
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(tokens.Token, tokenValidationParameters, out SecurityToken securityToken);
            JwtSecurityToken jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            var userId = int.Parse(principal.Identity.Name);
            var user = _knowledgeCenterContext.Users
                .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
                .Include(x => x.Agency)
                .SingleOrDefault(x => !x.IsDeleted && x.Id == userId);

            if (user == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (user.RefreshToken != tokens.RefreshToken)
            {
                throw new SecurityTokenException("Invalid refresh token");
            }

            if (user.RefreshTokenExpirationDate < DateTime.UtcNow)
            {
                throw new SecurityTokenException("Expired refresh token");
            }

            return GetValidUserToken(user);
        }

        public void ClearRefreshToken()
        {
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            var dbUser = _knowledgeCenterContext.Users.Single(x => x.Id == connectedUser.Id);
            dbUser.RefreshToken = null;
            dbUser.RefreshTokenExpirationDate = null;
            _knowledgeCenterContext.Update(dbUser);
            _knowledgeCenterContext.SaveChanges();
        }

        public List<string> GetRoles()
        {
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            return connectedUser.Roles;
        }

        private Entities.User ValidateLogin(Entities.User user, string password)
        {
            if (!user.IsActive && !string.IsNullOrEmpty(user.ActivationToken))
            {
                throw new HandledWarning(WarningCode.SIGNIN_ACCOUNT_NOTACTIVATED);
            }

            if (!user.IsActive || !_passwordProvider.IsHistoricPassword(password, user.Salt, user.Password))
            {
                HandledException exception;
                // After exactly 5 invalid tries -> the account is blocked and will stay blocked until admin is unblocking account
                user.PasswordTryCount += 1;
                if (!user.IsActive || user.PasswordTryCount >= ConnectionTryLimit)
                {
                    user.IsActive = false;
                    exception = new HandledException(ErrorCode.LOGIN_ACCOUNTBLOCKED);
                }
                else
                {
                    exception = new HandledException(ErrorCode.LOGIN_REMAININGTRY, ConnectionTryLimit - user.PasswordTryCount);
                }
                _knowledgeCenterContext.Users.Update(user);
                _knowledgeCenterContext.SaveChanges();
                throw exception;
            }
            else
            {
                user.PasswordTryCount = 0;
                user.LastConnection = DateTime.Now;
                _knowledgeCenterContext.Users.Update(user);
                _knowledgeCenterContext.SaveChanges();
            }

            return user;
        }

        private JwToken GetValidUserToken(Entities.User user)
        {
            var claims = GetUserClaims(user);

            var token = new JwtSecurityToken(
                              issuer: _config.Issuer,
                              audience: _config.Audience,
                              claims: claims,
                              expires: DateTime.UtcNow.AddSeconds(_config.ExpirationInSeconds),
                              signingCredentials:
                new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config.SecretKey)), SecurityAlgorithms.HmacSha256));

            return new JwToken(token, GenerateRefreshToken(user.Id));
        }

        private JwToken GetValidRobotToken()
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.UniqueName, RobotLogin),
                new Claim(JwtRegisteredClaimNames.Email, RobotLogin),
                new Claim(JwtRegisteredClaimNames.NameId, RobotLogin),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, _config.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            claims.Add(RobotRole);

            var token = new JwtSecurityToken(
                              issuer: _config.Issuer,
                              audience: _config.Audience,
                              claims: claims,
                              expires: DateTime.UtcNow.AddSeconds(_config.ExpirationInSeconds),
                              signingCredentials:
                new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config.SecretKey)), SecurityAlgorithms.HmacSha256));

            return new JwToken(token, string.Empty);
        }

        private List<Claim> GetUserClaims(Entities.User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.NameId, user.Login),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, _config.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            claims.Add(AuthentifiedRole);

            foreach (var role in user.UserRoles)
            {
                claims.Add(new Claim(CustomClaims.RoleClaimCode, role.Role.Code));
            }

            if (user.UserRoles.Any(x => x.Role.Code.Contains("MATCH_")))
            {
                claims.Add(new Claim(CustomClaims.RoleClaimCode, EnumComputedRoles.MATCH_USER));
            }

            if (user.Agency.PostalCode == NiceAgencyCode)
            {
                claims.Add(new Claim(CustomClaims.RoleClaimCode, EnumComputedRoles.NICE_COLAB));
            }

            return claims;
        }

        private string GenerateRefreshToken(int userId)
        {
            var randomNumber = new byte[32];
            string refreshToken;
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                refreshToken = Convert.ToBase64String(randomNumber);
            }

            var user = _knowledgeCenterContext.Users.Single(x => x.Id == userId);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpirationDate = DateTime.UtcNow.AddSeconds(_config.ExpirationInSeconds + _config.SlidingDelayToRefreshTokenAfterTokenExpirationInSeconds);
            _knowledgeCenterContext.Update(user);
            _knowledgeCenterContext.SaveChanges();

            return refreshToken;
        }
    }
}
