using FluentAssertions;
using KnowledgeCenter.CommonServices.Contracts;
using KnowledgeCenter.CommonServices.Contracts._Interfaces;
using KnowledgeCenter.CommonServices.Emails;
using System.Collections.Generic;
using Xunit;

namespace KnowledgeCenter.Common.Providers.Tests.Emails
{
    public class EmailTemplateBuilderTests
    {
        private readonly EmailTemplateBuilder _emailTemplateBuilder;

        public EmailTemplateBuilderTests()
        {
            _emailTemplateBuilder = new EmailTemplateBuilder();
        }

        [Theory]
        [MemberData(nameof(EmailsTestData))]
        public void GenerateEmail_ShouldGenerateCorrectlyEmail_AccordingToProvidedEmailTemplate(IEmailModel model, List<string> expectedContent)
        {
            // Act
            var result = _emailTemplateBuilder.GenerateEmail(model);

            // Assert
            result.Should().Contain("<html");
            result.Should().ContainAll(expectedContent);
            result.Should().Contain("</html>");
        }

        public static IEnumerable<object[]> EmailsTestData =>
            new List<object[]>
            {
                new object[] { new AccountActivationModel
                    {
                        appUrl = "http://localhost",
                        username = "John",
                        activationUrl = "http://localhost/activate"
                    }, new List<string>{ "Hello John!", "<a href=\"http://localhost/activate\">link</a>" }
                },
                new object[] { new PasswordRecoveryModel
                    {
                        appUrl = "http://localhost",
                        username = "John",
                        recoverPasswordUrl = "http://localhost/recover"
                    }, new List<string>{ "Hello John!", "<a href=\"http://localhost/recover\">here</a>" }
                }
            };
    }
}
