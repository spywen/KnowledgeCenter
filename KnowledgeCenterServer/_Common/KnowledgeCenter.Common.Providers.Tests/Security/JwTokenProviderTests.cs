using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Providers.Security;
using KnowledgeCenter.Common.Providers.Tests.Helpers;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using FizzWare.NBuilder;
using Xunit;
using KnowledgeCenter.Common._Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace KnowledgeCenter.Common.Providers.Tests.Security
{
    public class JwTokenProviderTests : _BaseTests
    {
        private KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly Mock<IPasswordProvider> _passwordProviderMock = new Mock<IPasswordProvider>();
        private readonly Mock<IIdentityProvider> _identityProviderMock = new Mock<IIdentityProvider>();

        private readonly JwTokenProvider _jwTokenProvider;

        public JwTokenProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _passwordProviderMock.Setup(x => x.IsHistoricPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(true);

            _identityProviderMock.Setup(x => x.GetConnectedUserIdentity()).Returns(new Identity
            {
                Id = 1
            });

            var securitySettings = Options.Create(new SecuritySettings
            {
                Audience = "Audience",
                ExpirationInSeconds = 10,
                SlidingDelayToRefreshTokenAfterTokenExpirationInSeconds = 10,
                Issuer = "Issuer",
                SecretKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                Subject = "Subject"
            });

            _jwTokenProvider = new JwTokenProvider(
                _knowledgeCenterContextMock,
                securitySettings,
                _passwordProviderMock.Object,
                _identityProviderMock.Object);
        }

        [Fact]
        public void GenerateToken_ShouldSuccessfullyGenerateTokens_AndResetLastConnectionAndPasswordCount()
        {
            // Arrange
            var credentials = new Contracts.Credentials { Login = "BOB", Password = "abcd1234!" };
            var now = DateTime.UtcNow;

            // Act
            var tokens = _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            tokens.Token.Should().NotBeEmpty();
            var deserializedToken = new JwtSecurityToken(tokens.Token);
            var roles = deserializedToken.Claims
                .Where(x => x.Type == CustomClaims.RoleClaimCode)
                .Select(x => x.Value)
                .ToList();
            roles.Should().HaveCount(2);
            roles.Should().Contain(new List<string> { "USER", "ADMIN" });

            var user = _knowledgeCenterContextMock.Users.First();
            user.PasswordTryCount.Should().Be(0);
            user.LastConnection.Year.Should().BeGreaterThan(1999);
            user.RefreshToken.Should().Be(tokens.RefreshToken);
            user.RefreshTokenExpirationDate.Should().BeCloseTo(now.AddSeconds(20));
        }

        [Fact]
        public void GenerateToken_ShouldSuccessfullyGenerateToken_WhenLoginIsEmail()
        {
            // Arrange
            var credentials = new Contracts.Credentials { Login = "bob@HOtmail.com", Password = "abcd1234!" };

            // Act
            var tokens = _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            tokens.Token.Should().NotBeEmpty();
        }

        [Fact]
        public void GenerateToken_ShouldThrow_INVALIDCREDENTIALS_Exception_WhenLoginProvidedDoesNotExist()
        {
            // Arrange
            var credentials = new Contracts.Credentials { Login = "unknownUser", Password = "abcd1234!" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.LOGIN_INVALIDCREDENTIALS);
        }

        [Fact]
        public void GenerateToken_ShouldThrow_INVALIDCREDENTIALS_Exception_WhenUserHasBeenDeleted()
        {
            // Arrange
            var user = _knowledgeCenterContextMock.Users.Single(x => x.Email == "bob@hotmail.com");
            user.IsDeleted = true;
            _knowledgeCenterContextMock.SaveChanges();
            var credentials = new Contracts.Credentials { Login = "BOB", Password = "abcd1234!" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.LOGIN_INVALIDCREDENTIALS);
        }

        [Fact]
        public void GenerateToken_ShouldThrow_ACCOUNTBLOCKED_Exception_WhenAccountIsNoMoreActive()
        {
            // Arrange
            var user = _knowledgeCenterContextMock.Users.First();
            user.IsActive = false;
            _knowledgeCenterContextMock.SaveChanges();
            var credentials = new Contracts.Credentials { Login = "bob", Password = "abcd1234!" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.LOGIN_ACCOUNTBLOCKED);
        }

        [Fact]
        public void GenerateToken_ShouldThrow_REMAININGTRY_Exception_WhenPasswordIsIncorrect_AndIncrementPasswordTryCount()
        {
            // Arrange
            _passwordProviderMock.Setup(x => x.IsHistoricPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            var credentials = new Contracts.Credentials { Login = "bob", Password = "abcd1234!" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            action.Should()
                .Throw<HandledException>()
                .Where(x =>
                    x.ErrorCode == ErrorCode.LOGIN_REMAININGTRY
                    && x.EndUserMessage.Contains("4"));
            _knowledgeCenterContextMock.Users.First().PasswordTryCount.Should().Be(1);
        }

        [Fact]
        public void GenerateToken_ShouldThrow_ACCOUNTBLOCKED_Exception_WhenAfterFiveTries_ByBlockingAccount()
        {
            // Arrange
            _passwordProviderMock.Setup(x => x.IsHistoricPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            var credentials = new Contracts.Credentials { Login = "bob", Password = "abcd1234!" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokens(credentials);

            // Assert (Retry to login 5 times)
            var expectedExceptions = new (ErrorCode, string)[]
            {
                ( ErrorCode.LOGIN_REMAININGTRY, "Your password is incorrect. 4 tries are remaining after your account will be blocked." ),
                ( ErrorCode.LOGIN_REMAININGTRY, "Your password is incorrect. 3 tries are remaining after your account will be blocked." ),
                ( ErrorCode.LOGIN_REMAININGTRY, "Your password is incorrect. 2 tries are remaining after your account will be blocked." ),
                ( ErrorCode.LOGIN_REMAININGTRY, "Your password is incorrect. 1 tries are remaining after your account will be blocked." ),
                ( ErrorCode.LOGIN_ACCOUNTBLOCKED, "You tried too connect too many times; now your account is blocked. Please contact administrator." ),
            };
            const int retryCount = 5;
            for (var i = 0; i < retryCount; i++)
            {
                action.Should()
                    .Throw<HandledException>()
                    .Where(x => x.ErrorCode == expectedExceptions[i].Item1
                        && x.EndUserMessage == expectedExceptions[i].Item2);
            }
        }

        [Fact]
        public void GenerateToken_ShouldThrow_SIGNIN_ACCOUNT_NOTACTIVATED_Warning_WhenAccountIsNotYetActivated()
        {
            // Arrange
            var user = _knowledgeCenterContextMock.Users.First();
            user.IsActive = false;
            user.ActivationToken = "ABC";
            _knowledgeCenterContextMock.SaveChanges();

            var credentials = new Contracts.Credentials { Login = "bob", Password = "abcd1234!" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokens(credentials);

            // Assert
            action.Should()
                .Throw<HandledWarning>()
                .Where(x =>
                    x.WarningCode == WarningCode.SIGNIN_ACCOUNT_NOTACTIVATED);
        }

        [Fact]
        public void GenerateTokensFromRefreshToken_ShouldGenerateFreshTokens()
        {
            // Arrange
            var initialTokens = _jwTokenProvider.GenerateTokens(new Contracts.Credentials { Login = "BOB", Password = "abcd1234!" });
            var tokens = new Tokens { Token = initialTokens.Token, RefreshToken = initialTokens.RefreshToken };
            var now = DateTime.UtcNow;

            // Act
            var newTokens = _jwTokenProvider.GenerateTokensFromRefreshToken(tokens);

            // Assert
            newTokens.Token.Should().NotBeEmpty();
            var deserializedToken = new JwtSecurityToken(newTokens.Token);
            var roles = deserializedToken.Claims
                .Where(x => x.Type == CustomClaims.RoleClaimCode)
                .Select(x => x.Value)
                .ToList();
            roles.Should().HaveCount(2);
            roles.Should().Contain(new List<string> { "USER", "ADMIN" });

            var user = _knowledgeCenterContextMock.Users.First();
            user.PasswordTryCount.Should().Be(0);
            user.LastConnection.Year.Should().BeGreaterThan(1999);
            user.RefreshToken.Should().Be(newTokens.RefreshToken);
            user.RefreshTokenExpirationDate.Should().BeCloseTo(now.AddSeconds(20), 1000);
        }

        [Fact]
        public void GenerateTokensFromRefreshToken_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenUserHasBeenDeleted()
        {
            // Arrange
            var initialTokens = _jwTokenProvider.GenerateTokens(new Contracts.Credentials { Login = "BOB", Password = "abcd1234!" });
            var tokens = new Tokens { Token = initialTokens.Token, RefreshToken = initialTokens.RefreshToken };
            var user = _knowledgeCenterContextMock.Users.Single(x => x.Email == "bob@hotmail.com");
            user.IsDeleted = true;
            _knowledgeCenterContextMock.SaveChanges();

            // Act
            Action action = () => _jwTokenProvider.GenerateTokensFromRefreshToken(tokens);

            // Assert
            action.Should()
                .Throw<HandledException>()
                .Where(x => x.ErrorCode == ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void GenerateTokensFromRefreshToken_ShouldThrow_SecurityToken_Exception_WhenInvalidRefreshTokenProvided()
        {
            // Arrange
            var initialTokens = _jwTokenProvider.GenerateTokens(new Contracts.Credentials { Login = "BOB", Password = "abcd1234!" });
            var tokens = new Tokens { Token = initialTokens.Token, RefreshToken = "INVALID" };

            // Act
            Action action = () => _jwTokenProvider.GenerateTokensFromRefreshToken(tokens);

            // Assert
            action.Should()
                .Throw<SecurityTokenException>()
                .Where(x => x.Message == "Invalid refresh token");
        }

        [Fact]
        public void GenerateTokensFromRefreshToken_ShouldThrow_SecurityToken_Exception_WhenRefreshTokenIsExpired()
        {
            // Arrange
            var initialTokens = _jwTokenProvider.GenerateTokens(new Contracts.Credentials { Login = "BOB", Password = "abcd1234!" });
            var tokens = new Tokens { Token = initialTokens.Token, RefreshToken = initialTokens.RefreshToken };
            var now = DateTime.UtcNow;
            var user = _knowledgeCenterContextMock.Users.First();
            user.RefreshTokenExpirationDate = DateTime.UtcNow.AddDays(-1);
            _knowledgeCenterContextMock.Update(user);
            _knowledgeCenterContextMock.SaveChanges();

            // Act
            Action action = () => _jwTokenProvider.GenerateTokensFromRefreshToken(tokens);

            // Assert
            action.Should()
                .Throw<SecurityTokenException>()
                .Where(x => x.Message == "Expired refresh token");
        }

        [Fact]
        public void ClearRefreshToken_ShouldResetRefreshToken()
        {
            // Act
            _jwTokenProvider.ClearRefreshToken();

            // Assert
            var user = _knowledgeCenterContextMock.Users.First();
            user.RefreshToken.Should().BeNull();
            user.RefreshTokenExpirationDate.Should().BeNull();
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var adminRole = new Role
            {
                Code = EnumRoles.ADMIN,
                Description = "Administrator"
            };
            knowledgeCenterContextMock.Roles.Add(adminRole);

            knowledgeCenterContextMock.Agencies.Add(GetAgency());
            knowledgeCenterContextMock.ServiceLines.Add(GetServiceLine());
            knowledgeCenterContextMock.Users.Add(new User
            {
                Id = 1,
                Login = "Bob",
                Email = "bob@hotmail.com",
                IsActive = true,
                PasswordTryCount = 0,
                LastConnection = new DateTime(1999, 1, 1),
                UserRoles = new List<UserRoles>{
                        new UserRoles { Role = adminRole }
                    },
                AgencyId = 1,
                ServiceLineId = 1,
                RefreshToken = "REFRESHTOKEN",
                RefreshTokenExpirationDate = new DateTime(2019, 1, 1)
            });
            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        private Agency GetAgency()
        {
            return Builder<Agency>.CreateNew()
                .With(x => x.Id, 1)
                .And(x => x.Name, "Sophia-Antipolis")
                .And(x => x.PostalCode, "06560")
                .Build();
        }

        private ServiceLine GetServiceLine()
        {
            return Builder<ServiceLine>.CreateNew()
                .With(x => x.Id, 1)
                .And(x => x.Name, "Agile Center")
                .And(x => x.Description, "Agile Center Service Line")
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}
