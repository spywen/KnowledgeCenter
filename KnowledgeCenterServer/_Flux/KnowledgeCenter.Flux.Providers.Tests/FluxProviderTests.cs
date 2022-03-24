using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Flux.Contracts;
using KnowledgeCenter.CapLab.Providers.Tests.Helpers;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace KnowledgeCenter.Flux.Providers.Tests
{
    public class FluxProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly FluxProvider _fluxProvider;
        private readonly Mock<IIdentityProvider> _identityProvider = new Mock<IIdentityProvider>();

        public FluxProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _fluxProvider = new FluxProvider(
                _knowledgeCenterContextMock,
                MapperWithoutMock,
                _identityProvider.Object);

            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.USER }
             });
        }

        [Fact]
        public void CreatePublication_ShouldCreateNewPublication()
        {
            // Act
            var result = _fluxProvider.CreatePublication(new CreatePublication()
            {
                Message = "test",
                CategoryCode = CategoryCode.FOOD,
                IsAnonymous = false
            });

            // Assert
            _knowledgeCenterContextMock.FluxPublications.Should().HaveCount(3);
            var expectedUpdatedPublication = _knowledgeCenterContextMock.FluxPublications
                .First(x => x.Id == 3);
            expectedUpdatedPublication.Message.Should().Be("test");
            expectedUpdatedPublication.CategoryCode.Should().Be(CategoryCode.FOOD.ToString());
            expectedUpdatedPublication.IsAnonymous.Should().BeFalse();
        }

        [Fact]
        public void DeletePublication_ShouldDeletePublication_WhenUserIsOwner()
        {
            // Act
            _fluxProvider.DeletePublication(1);

            // Assert
            _knowledgeCenterContextMock.FluxPublications.Count().Should().Be(1);
        }

        [Fact]
        public void DeletePublication_ShouldDeletePublication_WhenUserIsNotOwnerOfProjectButIsFluxAdmin()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.FLUX_ADMIN }
             });

            // Act
            _fluxProvider.DeletePublication(2);

            // Assert
            _knowledgeCenterContextMock.FluxPublications.Count().Should().Be(1);
        }

        [Fact]
        public void LikePublication_ShouldAddLike_WhenUserDidNotAlreadyLikeThisPublication()
        {
            // Arrange
            var publicationId = 2;

            // Act
            _fluxProvider.LikePublication(publicationId, LikeCode.down);

            // Assert
            _knowledgeCenterContextMock.FluxLikes.Where(x => x.PublicationId == publicationId).Should().HaveCount(2);
            _knowledgeCenterContextMock.FluxLikes.Where(x => x.PublicationId == publicationId && x.UserId == 1)
                .Should().HaveCount(1)
                .And.Subject.Single()
                .LikeCode.Should().Be(LikeCode.down.ToString());
        }

        [Fact]
        public void LikePublication_ShouldUpdateLike_WhenUserAlreadyLikeThisPublication()
        {
            // Arrange
            var publicationId = 1;

            // Act
            _fluxProvider.LikePublication(publicationId, LikeCode.down);

            // Assert
            _knowledgeCenterContextMock.FluxLikes.Where(x => x.PublicationId == publicationId).Should().HaveCount(1);
            _knowledgeCenterContextMock.FluxLikes.Where(x => x.PublicationId == publicationId && x.UserId == 1)
                .Should().HaveCount(1)
                .And.Subject.Single()
                .LikeCode.Should().Be(LikeCode.down.ToString());
        }

        [Fact]
        public void GetPublications_ShouldGetLastPublications()
        {
            // Arrange
            var filter = new PublicationFilter { };

            // Act
            var publications = _fluxProvider.GetPublications(new Common.BasePaginationRequest<PublicationFilter>(filter));

            // Assert
            publications.TotalItems.Should().Be(2);
            var ownPublication = publications.Data.First();
            ownPublication.CreationDate.Should().Be(new DateTime(2019, 1, 1));
            ownPublication.IsAnonymous.Should().BeFalse();
            ownPublication.User.Fullname.Should().Be("John Doe");
            ownPublication.IsOwner.Should().BeTrue();
            ownPublication.Likes.Should().HaveCount(1);
            ownPublication.UserLike.Should().Be(LikeCode.heart.ToString());

            var otherPublication = publications.Data.Last();
            otherPublication.CreationDate.Should().Be(new DateTime(2018, 1, 1));
            otherPublication.IsAnonymous.Should().BeTrue();
            otherPublication.User.Should().BeNull();
            otherPublication.IsOwner.Should().BeFalse();
            otherPublication.Likes.Should().HaveCount(1);
            otherPublication.UserLike.Should().BeNullOrEmpty();
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var agencies = GetAgencies();
            var serviceLines = GetServiceLines();
            var users = GetUsers();

            knowledgeCenterContextMock.Users.AddRange(users);
            knowledgeCenterContextMock.Agencies.AddRange(agencies);
            knowledgeCenterContextMock.ServiceLines.AddRange(serviceLines);

            knowledgeCenterContextMock.FluxPublications.AddRange(GetPublications());
            knowledgeCenterContextMock.FluxLikes.AddRange(GetPublicationLikes());

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

        private IList<DataConnector.Entities.Flux.Publication> GetPublications()
        {
            return Builder<DataConnector.Entities.Flux.Publication>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Message, "My first event message")
                .And(x => x.CategoryCode, CategoryCode.EVENT.ToString())
                .And(x => x.IsAnonymous, false)
                .And(x => x.UserId, 1)
                .And(x => x.CreationDate, new DateTime(2019, 1, 1))
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Message, "My first green message")
                .And(x => x.CategoryCode, CategoryCode.GREEN.ToString())
                .And(x => x.IsAnonymous, true)
                .And(x => x.UserId, 2)
                .And(x => x.CreationDate, new DateTime(2018, 1, 1))
                .Build();
        }

        private IList<DataConnector.Entities.Flux.Like> GetPublicationLikes()
        {
            return Builder<DataConnector.Entities.Flux.Like>.CreateListOfSize(2)
                .All()
                .TheFirst(1)
                .With(x => x.PublicationId, 1)
                .And(x => x.UserId, 1)
                .And(x => x.LikeCode, LikeCode.heart.ToString())
                .TheNext(1)
                .With(x => x.PublicationId, 2)
                .And(x => x.UserId, 2)
                .And(x => x.LikeCode, LikeCode.warning.ToString())
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}