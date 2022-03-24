using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers.Security;
using KnowledgeCenter.Common.Providers.Tests.Helpers;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.CommonServices.Contracts;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace KnowledgeCenter.Common.Providers.Tests.Security
{
    public class RecoverPasswordProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly Mock<IPasswordProvider> _passwordProvider = new Mock<IPasswordProvider>();
        private readonly Mock<IEmailService> _emailService = new Mock<IEmailService>();
        private readonly Mock<IOptions<SiteSettings>> _siteSettings = new Mock<IOptions<SiteSettings>>();

        private readonly RecoverPasswordProvider _recoverPasswordProvider;

        private const string NewHashedPassword = "NewHashedPassword";
        private const string NewSalt = "NewSalt";
        private const string AppUrl = "https://mywebsite.com";
        private const string ValidToken = "XYZ";

        public RecoverPasswordProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _passwordProvider.Setup(x => x.GenerateNewSaltedPassword(It.IsAny<string>()))
                .Returns(new PasswordAndSalt(NewHashedPassword, NewSalt));

            _siteSettings.Setup(x => x.Value).Returns(new SiteSettings
            {
                AppUrl = AppUrl
            });

            _recoverPasswordProvider = new RecoverPasswordProvider(
                _emailService.Object,
                _knowledgeCenterContextMock,
                _passwordProvider.Object,
                _siteSettings.Object);
        }

        [Fact]
        public void AskForRecoverPassword_ShouldSuccessfullyInitiatePasswordRecoveryProcedure()
        {
            // Act
            _recoverPasswordProvider.AskForRecoverPassword(new Contracts.AskForRecoverPassword
            {
                Email = "jOHn.doe@cApgemini.cOm"
            });

            // Assert
            _knowledgeCenterContextMock.Users.First(x => x.Id == 1).RecoverPasswordToken.Should().NotBeNull();
            _emailService.Verify(x => x.SendEmail(
                It.Is<User>(y => y.Email == "john.doe@capgemini.com"),
                "Password recovery",
                It.Is<PasswordRecoveryModel>(y => y.username == "John" &&
                    y.appUrl == AppUrl &&
                    y.recoverPasswordUrl.Contains($"{AppUrl}/passwordrecovery?token="))), Times.Once);
        }

        [Fact]
        public void AskForRecoverPassword_ShouldThrow_RECOVERPASSWORD_UNRECOGNIZEDEMAIL_Exception_WhenInvalidEmailProvided()
        {
            // Act
            Action action = () => _recoverPasswordProvider.AskForRecoverPassword(new Contracts.AskForRecoverPassword
            {
                Email = "jane.doe@cApgemini.cOm"
            });

            // Assert
            action.Should()
               .Throw<HandledException>()
               .And.ErrorCode.Should().Be(ErrorCode.RECOVERPASSWORD_UNRECOGNIZEDEMAIL);
        }

        [Fact]
        public void RecoverPasswordThanksToToken_ShouldSuccessfullyRecoverPassword_WhenTokenProvidedIsValid()
        {
            // Act
            _recoverPasswordProvider.RecoverPasswordThanksToToken(new Contracts.RecoverPassword
            {
                Token = ValidToken,
                NewPassword = "NEWPASSWORD$!"
            });

            // Assert
            var user = _knowledgeCenterContextMock.Users.First(x => x.Id == 2);
            user.RecoverPasswordToken.Should().BeNull();
            user.Password.Should().Be(NewHashedPassword);
            user.Salt.Should().Be(NewSalt);
        }

        [Fact]
        public void RecoverPasswordThanksToToken_ShouldThrow_INVALID_ACTION_Exception_WhenInvalidTokenProvided()
        {
            // Act
            Action action = () => _recoverPasswordProvider.RecoverPasswordThanksToToken(new Contracts.RecoverPassword
            {
                Token = "INVALID TOKEN",
                NewPassword = "NEWPASSWORD$!"
            });

            // Assert
            action.Should()
               .Throw<HandledException>()
               .Where(x =>
                    x.ErrorCode == ErrorCode.INVALID_ACTION
                    && x.Message == "Invalid token provided to update a user password");
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var users = GetUsers();

            var agencies = GetAgencies();

            var serviceLines = GetServiceLines();

            knowledgeCenterContextMock.Users.AddRange(users);
            knowledgeCenterContextMock.Agencies.AddRange(agencies);
            knowledgeCenterContextMock.ServiceLines.AddRange(serviceLines);
            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        private IList<User> GetUsers()
        {
            return Builder<User>.CreateListOfSize(2)
                .All()
                .With(x => x.IsActive, true)
                .And(x => x.CreationDate, new DateTime(2019, 1, 1))
                .And(x => x.LastConnection, new DateTime(2019, 1, 2))
                .And(x => x.ModificationDate, new DateTime(2019, 1, 1))
                .And(x => x.PasswordTryCount, 0)
                .And(x => x.Password, "xyz")
                .And(x => x.Salt, "xyz")
                .And(x => x.AgencyId = 1)
                .And(x => x.ServiceLineId = 1)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Firstname, "John")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "jdoe")
                .And(x => x.Email, "john.doe@capgemini.com")
                .And(x => x.RecoverPasswordToken = null)
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Firstname, "Bob")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "bdoe")
                .And(x => x.Email, "bob.doe@capgemini.com")
                .And(x => x.RecoverPasswordToken = ValidToken)
                .Build();
        }

        private IList<Agency> GetAgencies()
        {
            return Builder<Agency>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .With(x => x.Name, "Bordeaux")
                .With(x => x.PostalCode, "33700")
                .TheNext(1)
                .With(x => x.Id, 2)
                .With(x => x.Name, "Nice-Sophia Antipolis")
                .With(x => x.PostalCode, "06410")
                .Build();
        }

        private IList<ServiceLine> GetServiceLines()
        {
            return Builder<ServiceLine>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Name, "DTC")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Name, "TMA")
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}
