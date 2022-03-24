using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
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

namespace KnowledgeCenter.Common.Providers.Tests
{
    public class UserProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly Mock<IPasswordProvider> _passwordProvider = new Mock<IPasswordProvider>();
        private readonly Mock<IIdentityProvider> _identityProvider = new Mock<IIdentityProvider>();
        private readonly Mock<IEmailService> _emailService = new Mock<IEmailService>();
        private readonly Mock<IOptions<SiteSettings>> _siteSettings = new Mock<IOptions<SiteSettings>>();

        private readonly UserProvider _userProvider;

        private const string NewHashedPassword = "NewHashedPassword";
        private const string NewSalt = "NewSalt";
        private const int DeletedUserId = 3;

        public UserProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _passwordProvider.Setup(x => x.GenerateNewSaltedPassword(It.IsAny<string>()))
                .Returns(new PasswordAndSalt(NewHashedPassword, NewSalt));

            _passwordProvider.Setup(x => x.IsHistoricPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(true);

            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
                .Returns(new Identity
                {
                    Id = 1,
                    Login = "john.doe",
                    Roles = new List<string> { EnumRoles.USER }
                });

            _siteSettings.Setup(x => x.Value).Returns(new SiteSettings
            {
                AppUrl = "https://localhost:4200"
            });

            _userProvider = new UserProvider(
                _knowledgeCenterContextMock,
                _passwordProvider.Object,
                _identityProvider.Object,
                _emailService.Object,
                MapperWithoutMock,
                _siteSettings.Object);
        }

        [Fact]
        public void CreateUser_ShouldCreateNewUser_AndSendActivationEmail()
        {
            // Act
            var result = _userProvider.CreateUser(new Contracts.CreateOrUpdateUser()
            {
                Firstname = "Camille",
                Lastname = "Doe",
                Login = "camdoe",
                Email = "camille.doe@hotmail.fr",
                NewPassword = "Pa$$w0rd",
                AgencyId = 1,
                ServiceLineId = 1
            });

            // Assert
            _knowledgeCenterContextMock.Users.Count().Should().Be(4);
            var dbCreatedUser = _knowledgeCenterContextMock.Users.First(x => x.Id == 4);
            dbCreatedUser.IsActive.Should().BeFalse();
            _emailService.Verify(x => x.SendEmail(It.Is<User>(y => y.Id == dbCreatedUser.Id),
                "Account activation",
                It.Is<AccountActivationModel>(y => y.activationUrl == $"https://localhost:4200/activate?token={dbCreatedUser.ActivationToken}"
                && y.appUrl == "https://localhost:4200"
                && y.username == dbCreatedUser.Firstname)), Times.Once);
        }

        [Fact]
        public void CreateUser_ShouldThrow_SIGNIN_ALREADYEXIST_Exception_WhenEmailAlreadyExists()
        {
            // Act
            Action action = () => _userProvider.CreateUser(new Contracts.CreateOrUpdateUser()
            {
                Firstname = "Camille",
                Lastname = "Doe",
                Login = "camdoe",
                Email = "jDoe@hotmAil.fr",
                NewPassword = "Pa$$w0rd",
                AgencyId = 1,
                ServiceLineId = 1
            });

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SIGNIN_ALREADYEXIST);
        }

        [Fact]
        public void ActivateAccount_ShouldActivateAccount()
        {
            // Arrange
            var activationToken = "ABC";
            var dbUser = _knowledgeCenterContextMock.Users.First();
            dbUser.IsActive = false;
            dbUser.ActivationToken = activationToken;
            _knowledgeCenterContextMock.SaveChanges();

            // Act
            var result = _userProvider.ActivateAccount(activationToken);

            // Assert
            result.Should().Be(dbUser.Login);
            var dbUserActivated = _knowledgeCenterContextMock.Users.Single(x => x.Id == dbUser.Id);
            dbUserActivated.IsActive.Should().BeTrue();
            dbUserActivated.ActivationToken.Should().BeNull();
        }

        [Fact]
        public void ActivateAccount_ShouldThrow_SIGNIN_SIGNIN_ACTIVATION_INVALIDTOKEN_Exception_WhenTokenIsNotFound()
        {
            // Act
            Action action = () => _userProvider.ActivateAccount("INVALID TOKEN");

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SIGNIN_ACTIVATION_INVALIDTOKEN);
        }

        [Fact]
        public void UpdateUser_ShouldUpdateUser()
        {
            // Act
            var userUpdatedInDb = _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 1,
                Firstname = "chantal",
                Lastname = "van",
                Login = "cvan",
                Email = "cvan@hotmail.fr",
                AgencyId = 1,
                ServiceLineId = 1
            });

            // Assert
            userUpdatedInDb.Firstname.Should().Be("chantal");
            userUpdatedInDb.Lastname.Should().Be("van");
            userUpdatedInDb.Email.Should().Be("cvan@hotmail.fr");
            userUpdatedInDb.Login.Should().Be("cvan");
            userUpdatedInDb.Agency.Name.Should().Be("Bordeaux");
            userUpdatedInDb.ServiceLine.Name.Should().Be("DTC");
        }

        [Fact]
        public void UpdateUser_ShouldUpdateUser_EvenIfAdministratorIsTryingToUpdateProfileOfAnotherUser()
        {
            // Arrange 
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
                .Returns(new Identity
                {
                    Id = 1,
                    Login = "john.doe",
                    Roles = new List<string> { EnumRoles.ADMIN }
                });
            var initialModificationDate = _knowledgeCenterContextMock.Users.Single(x => x.Id == 1).ModificationDate;

            // Act
            var userUpdatedInDb = _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 2,
                Login = "cvan",
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            userUpdatedInDb.Firstname.Should().Be("chantal");
            userUpdatedInDb.Lastname.Should().Be("van");
            userUpdatedInDb.Login.Should().Be("cvan");
            userUpdatedInDb.Email.Should().Be("cvan@hotmail.fr");
            userUpdatedInDb.Agency.Name.Should().Be("Bordeaux");
            userUpdatedInDb.ServiceLine.Name.Should().Be("TMA");
        }

        [Fact]
        public void UpdateUser_ShouldThrow_UNAUTHORIZED_OPERATION_Exception_WhenUserIsNotTryingToUpdateHisProfile()
        {
            // Act
            Action action = () => _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 2,
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.UNAUTHORIZED_OPERATION);
        }

        [Fact]
        public void UpdateUser_ShouldThrow_UNAUTHORIZED_OPERATION_Exception_WhenUserHasBeenDeleted()
        {
            // Act
            Action action = () => _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 3
            });

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.UNAUTHORIZED_OPERATION);
        }

        [Fact]
        public void UpdateUser_ShouldThrow_INVALID_ACTION_Exception_WhenNotBothOldPasswordAndNewPasswordAreDefined()
        {
            // Act
            Action action = () => _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 1,
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                NewPassword = "abc",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            action.Should()
                .Throw<HandledException>()
                .Where(x =>
                    x.ErrorCode == ErrorCode.INVALID_ACTION
                    && x.Message == "Password update impossible. Please provide both old and new password");
        }

        [Fact]
        public void UpdateUser_ShouldUpdatePassword_WhenCorrectOldPasswordProvided()
        {
            // Act
            _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 1,
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                NewPassword = "abc",
                OldPassword = "abc",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            var userUpdatedInDb = _knowledgeCenterContextMock.Users.Single(x => x.Id == 1);
            userUpdatedInDb.Password.Should().Be(NewHashedPassword);
            userUpdatedInDb.Salt.Should().Be(NewSalt);
        }

        [Fact]
        public void UpdateUser_ShouldThrow_INVALIDOLDPASSWORD_Exception_WhenInvalidOldPasswordProvided()
        {
            // Arrange
            _passwordProvider.Setup(x => x.IsHistoricPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            // Act
            Action action = () => _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 1,
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                NewPassword = "abc",
                OldPassword = "abc",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.USER_INVALIDOLDPASSWORD);
        }

        [Fact]
        public void UpdateUser_ShouldUpdatePassword_WhenCorrectOldAdminPasswordProvided()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
                .Returns(new Identity
                {
                    Id = 1,
                    Login = "jdoe",
                    Roles = new List<string> { EnumRoles.ADMIN }
                });

            // Act
            _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 2,
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                NewPassword = "abc",
                OldPassword = "abc",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            var userUpdatedInDb = _knowledgeCenterContextMock.Users.Single(x => x.Id == 2);
            userUpdatedInDb.Password.Should().Be(NewHashedPassword);
            userUpdatedInDb.Salt.Should().Be(NewSalt);
        }

        [Fact]
        public void UpdateUser_ShouldThrow_INVALIDADMINPASSWORD_Exception_WhenInvalidOldAdminPasswordProvided()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
                .Returns(new Identity
                {
                    Id = 1,
                    Login = "jdoe",
                    Roles = new List<string> { EnumRoles.ADMIN }
                });
            _passwordProvider.Setup(x => x.IsHistoricPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(false);

            // Act
            Action action = () => _userProvider.UpdateUser(new Contracts.CreateOrUpdateUser()
            {
                Id = 2,
                Firstname = "chantal",
                Lastname = "van",
                Email = "cvan@hotmail.fr",
                NewPassword = "abc",
                OldPassword = "abc",
                AgencyId = 1,
                ServiceLineId = 2
            });

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.USER_ADMIN_INVALIDADMINPASSWORD);
        }

        [Fact]
        public void GetAllUsers_ShouldReturnAllUsers()
        {
            // Act
            var users = _userProvider.GetAllUsers();

            // Assert
            users.Count.Should().Be(2);
        }

        [Fact]
        public void GetConnectedUser_ShouldReturnConnectedUser()
        {
            // Act
            var connectedUser = _userProvider.GetConnectedUser();

            // Assert
            connectedUser.Firstname.Should().Be("John");
        }

        [Fact]
        public void GetUser_ShouldReturnUser()
        {
            // Act
            var connectedUser = _userProvider.GetUser(2);

            // Assert
            connectedUser.Firstname.Should().Be("Bob");
        }


        [Fact]
        public void GetUser_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenUserDoesNotExist()
        {
            // Act
            Action action = () => { _userProvider.GetUser(567); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteUser_ShouldDeleteUser_BySetingIsDeleteFlagToTrue()
        {
            // Act
            _userProvider.DeleteUser(1);

            // Assert
            _knowledgeCenterContextMock.Users.Count().Should().Be(3);
            _knowledgeCenterContextMock.Users.Single(x => x.Id == 1).IsDeleted.Should().BeTrue();
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
            return Builder<User>.CreateListOfSize(3)
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
                .And(x => x.IsDeleted = false)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Firstname, "John")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "john.doe")
                .And(x => x.Email, "jdoe@hotmail.fr")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Firstname, "Bob")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "bob.doe")
                .And(x => x.Email, "bdoe@hotmail.fr")
                .TheNext(1)
                .With(x => x.Id, DeletedUserId)
                .And(x => x.Firstname, "del")
                .And(x => x.Lastname, "ete")
                .And(x => x.Login, "del")
                .And(x => x.Email, "del@hotmail.fr")
                .And(x => x.IsDeleted, true)
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
