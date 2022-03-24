using System;
using System.Collections.Generic;
using System.Linq;
using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Common.Tools;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.Green;
using KnowledgeCenter.Green.Providers.Tests.Helpers;
using Moq;
using Xunit;

namespace KnowledgeCenter.Green.Providers.Tests
{
    public class PublicationProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly PublicationProvider _publicationProvider;
        private readonly Mock<IIdentityProvider> _identityProvider = new Mock<IIdentityProvider>();

        public PublicationProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _publicationProvider = new PublicationProvider(
                _knowledgeCenterContextMock,
                MapperWithoutMock,
                _identityProvider.Object);

            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.ADMIN, EnumRoles.GREEN_ADMIN }
             });

             SystemTime.UtcNow = () => new DateTime(2019, 12, 1, 8, 0, 0);
        }

        [Fact]
        public void GetPublication_ShouldReturnPublication()
        {
            // Act
            var publication = _publicationProvider.GetPublication(1);

            // Assert
            publication.Message.Should().Be("First publication");
            publication.PublicationTypeId.Should().Be(1);
            publication.CreationDate.Should().Be(new DateTime(2019, 11, 30, 8, 0, 0));
            publication.PublicationDate.Should().Be(new DateTime(2019, 12, 01, 8, 0, 0));
        }

        [Fact]
        public void GetLastPublication_ShouldReturnLastPublication()
        {
            // Act
            var publication = _publicationProvider.GetLastPublication();

            // Assert
            publication.Message.Should().Be("First publication");
            publication.PublicationTypeId.Should().Be(1);
            publication.CreationDate.Should().Be(new DateTime(2019, 11, 30, 8, 0, 0));
            publication.PublicationDate.Should().Be(new DateTime(2019, 12, 01, 8, 0, 0));
        }

        [Fact]
        public void DeletePublication_ShouldDeletePublication_WhenUserIsGreenAdmin()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.GREEN_ADMIN }
             });

            // Act
            _publicationProvider.DeletePublication(1);

            // Assert
            _knowledgeCenterContextMock.Publications.Count().Should().Be(1);
        }

        [Fact]
        public void CreatePublication_ShouldCreateNewPublication()
        {
            // Act
            var result = _publicationProvider.CreatePublication(new Contracts.CreateOrUpdatePublication()
            {
                Message = "Third publication",
                PublicationTypeId = 1,
                PublicationDate = new DateTime(2019, 12, 3, 9, 0, 0)
            });

            // Assert
            _knowledgeCenterContextMock.Publications.Should().HaveCount(3);
            var expectedCreatedProject = _knowledgeCenterContextMock.Publications
                .First(x => x.Id == 3);
            expectedCreatedProject.Message.Should().Be("Third publication");
            expectedCreatedProject.PublicationTypeId.Should().Be(1);
            expectedCreatedProject.UserId.Should().Be(1);
            expectedCreatedProject.PublicationDate.Should().Be(new DateTime(2019, 12, 3, 9, 0, 0));
        }

        [Fact]
        public void UpdatePublication_ShouldUpdatePublication_WhenSimpleUserIsTryingToUpdateHisOwnProject()
        {
            // Act
            var result = _publicationProvider.UpdatePublication(new Contracts.CreateOrUpdatePublication()
            {
                Id = 1,
                Message = "First publication updated",
                PublicationTypeId = 1,
                PublicationDate = new DateTime(2019, 12, 3, 9, 0, 0)
            });

            // Assert
            _knowledgeCenterContextMock.Publications.Should().HaveCount(2);
            var expectedUpdatedProject = _knowledgeCenterContextMock.Publications
                .First(x => x.Id == 1);
            expectedUpdatedProject.Message.Should().Be("First publication updated");
            expectedUpdatedProject.PublicationDate.Should().Be(new DateTime(2019, 12, 3, 9, 0, 0));
            expectedUpdatedProject.PublicationTypeId.Should().Be(1);
        }

        [Fact]
        public void GetAllPublications_ShouldGetAllPublications()
        {
            // Arrange

            // Act
            var publications = _publicationProvider.GetAllPublications();

            // Assert
            publications.Count.Should().Be(2);
            publications.First().Message.Should().Be("Second publication");
        }

        [Fact]
        public void GetAllPublicationTypes_ShouldGetAllPublicationTypes()
        {
            // Arrange

            // Act
            var publications = _publicationProvider.GetAllPublicationTypes();

            // Assert
            publications.Count.Should().Be(2);
            publications.First().Code.Should().Be("NEWS");
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var agencies = GetAgencies();
            var serviceLines = GetServiceLines();
            var users = GetUsers();

            var publications = GetPublications();
            var publicationTypes = GetPublicationTypes();

            knowledgeCenterContextMock.Users.AddRange(users);
            knowledgeCenterContextMock.Agencies.AddRange(agencies);
            knowledgeCenterContextMock.ServiceLines.AddRange(serviceLines);

            knowledgeCenterContextMock.Publications.AddRange(publications);
            knowledgeCenterContextMock.PublicationTypes.AddRange(publicationTypes);

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        private IList<DataConnector.Entities.Agency> GetAgencies()
        {
            return Builder<DataConnector.Entities.Agency>.CreateListOfSize(2)
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

        private IList<DataConnector.Entities.ServiceLine> GetServiceLines()
        {
            return Builder<DataConnector.Entities.ServiceLine>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Name, "DTC")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Name, "TMA")
                .Build();
        }
        private IList<DataConnector.Entities.User> GetUsers()
        {
            return Builder<DataConnector.Entities.User>.CreateListOfSize(2)
                .All()
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
                .And(x => x.Login, "john.doe")
                .And(x => x.Email, "jdoe@hotmail.fr")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Firstname, "Bob")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "bob.doe")
                .And(x => x.Email, "bdoe@hotmail.fr")
                .Build();
        }

        private IList<DataConnector.Entities.Green.Publication> GetPublications()
        {
            return Builder<DataConnector.Entities.Green.Publication>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Message, "First publication")
                .And(x => x.CreationDate, new DateTime(2019, 11, 30, 8, 0, 0))
                .And(x => x.PublicationDate, new DateTime(2019, 12, 01, 8, 0, 0))
                .And(x => x.UserId, 1)
                .And(x => x.PublicationTypeId, 1)
                .TheNext(1)
                .And(x => x.Message, "Second publication")
                .And(x => x.CreationDate, new DateTime(2019, 11, 30, 8, 0, 0))
                .And(x => x.PublicationDate, new DateTime(2019, 12, 03, 8, 0, 0))
                .And(x => x.UserId, 1)
                .And(x => x.PublicationTypeId, 2)
                .Build();
        }

        private IList<DataConnector.Entities.Green.PublicationType> GetPublicationTypes()
        {
            return Builder<DataConnector.Entities.Green.PublicationType>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Code, "NEWS")
                .And(x => x.Description, "News")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Code, "ANECDOTES")
                .And(x => x.Description, "Anecdotes")
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}
