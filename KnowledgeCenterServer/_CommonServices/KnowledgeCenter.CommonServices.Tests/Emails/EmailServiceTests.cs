using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers.Tests.Helpers;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.CommonServices.Contracts;
using KnowledgeCenter.CommonServices.Contracts._Interfaces;
using KnowledgeCenter.CommonServices.Emails;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using Microsoft.Extensions.Options;
using Moq;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Xunit;

namespace KnowledgeCenter.Common.Providers.Tests.Emails
{
    public class EmailServiceTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly Mock<IEmailTemplateBuilder> _emailTemplateBuilder = new Mock<IEmailTemplateBuilder>();
        private readonly Mock<ISendGridClient> _sendGridClient = new Mock<ISendGridClient>();
        private readonly Mock<IOptions<EmailSettings>> _emailSettings = new Mock<IOptions<EmailSettings>>();

        private readonly EmailService _emailService;

        private readonly User user = new User
        {
            Id = 1,
            Email = "john.doe@outlook.com"
        };

        public EmailServiceTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _emailSettings.Setup(x => x.Value).Returns(new EmailSettings
            {
                ApiKey = "ABC",
                FromAddress = "noreply@kc.com",
                FromName = "No reply KC",
                LimitPerMinutes = 20,
                LimitPerMonth = 300
            });

            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Development");

            _emailService = new EmailService(
                _emailSettings.Object,
                _knowledgeCenterContextMock,
                _emailTemplateBuilder.Object,
                _sendGridClient.Object);
        }

        [Fact]
        public void SendEmail_ShouldSendEmail_AndLogIt()
        {
            // Act
            var subject = "My amazing subject";
            _emailService.SendEmail(user, subject, new FakeModel());

            // Assert
            _knowledgeCenterContextMock.EmailLogs.Count().Should().Be(2);
            var emailLog = _knowledgeCenterContextMock.EmailLogs.Single(x => x.Id == 2);
            emailLog.UserId.Should().Be(user.Id);
            emailLog.Subject.Should().Be($"[DEVELOPMENT][Knowledge center portal] {subject}");
            _sendGridClient.Verify(x => x.SendEmailAsync(It.IsAny<SendGridMessage>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public void SendEmail_ShouldNotSendEmail_WhenApiKeyIsNotDefined()
        {
            // Arrange
            _emailSettings.Setup(x => x.Value).Returns(new EmailSettings
            {
                ApiKey = null,
                FromAddress = "noreply@kc.com",
                FromName = "No reply KC",
                LimitPerMinutes = 20,
                LimitPerMonth = 300
            });

            // Act
            _emailService.SendEmail(user, "My amazing subject", new FakeModel());

            // Assert
            _sendGridClient.Verify(x => x.SendEmailAsync(It.IsAny<SendGridMessage>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public void SendEmail_ShouldNotAddEnvironmentInsideSubject_WhenEnvironmentIsProduction()
        {
            // Arrange
            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Production");

            // Act
            var subject = "My amazing subject";
            _emailService.SendEmail(user, subject, new FakeModel());

            // Assert
            var emailLog = _knowledgeCenterContextMock.EmailLogs.Single(x => x.Id == 2);
            emailLog.Subject.Should().Be($"[Knowledge center portal] {subject}");
        }

        [Fact]
        public void SendEmail_ShouldThrow_SYSTEM_BUSY_Exception_IfTooMuchEmailSentPerMinute()
        {
            // Arrange
            _emailSettings.Setup(x => x.Value).Returns(new EmailSettings
            {
                ApiKey = "ABC",
                FromAddress = "noreply@kc.com",
                FromName = "No reply KC",
                LimitPerMinutes = 1
            });

            // Act
            Action action = () => _emailService.SendEmail(user, "subject", new FakeModel());

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SYSTEM_BUSY);
        }

        [Fact]
        public void SendEmail_ShouldThrow_EMAIL_LIMIT_REACHED_Exception_IfTooMuchEmailSentPerMonth()
        {
            // Arrange
            _emailSettings.Setup(x => x.Value).Returns(new EmailSettings
            {
                ApiKey = "ABC",
                FromAddress = "noreply@kc.com",
                FromName = "No reply KC",
                LimitPerMinutes = 2000,
                LimitPerMonth = 1
            });

            // Act
            Action action = () => _emailService.SendEmail(user, "subject", new FakeModel());

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.EMAIL_LIMIT_REACHED);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            knowledgeCenterContextMock.Users.AddRange(GetUsers());
            knowledgeCenterContextMock.Agencies.AddRange(GetAgencies());
            knowledgeCenterContextMock.ServiceLines.AddRange(GetServiceLines());

            knowledgeCenterContextMock.EmailLogs.Add(new EmailLog
            {
                Id = 1,
                Date = DateTime.UtcNow,
                Subject = "test",
                UserId = 1
            });

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        private IList<User> GetUsers()
        {
            return Builder<User>.CreateListOfSize(1)
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
                .And(x => x.ActivationToken = null)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Firstname, "John")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "john.doe")
                .And(x => x.Email, "jdoe@hotmail.fr")
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

    public class FakeModel : IEmailModel
    {

    }
}
