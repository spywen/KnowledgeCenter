using System;
using System.Collections.Generic;
using System.Linq;
using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers.Tests.Helpers;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using Xunit;

namespace KnowledgeCenter.Common.Providers.Tests
{
    public class ServiceLineProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly ServiceLineProvider _serviceLineProvider;

        public ServiceLineProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _serviceLineProvider = new ServiceLineProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetAllServiceLines_ShouldReturnAllAvailableServiceLines()
        {
            // Act
            var result = _serviceLineProvider.GetAllServiceLines();

            // Assert
            result.Count.Should().Be(2);
            result[0].Name.Should().Be("Agile Center");
            result[1].Name.Should().Be("DTC");
        }

        [Fact]
        public void GetServiceLine_ShouldReturnServiceLine()
        {
            // Act
            var result = _serviceLineProvider.GetServiceLine(1);

            // Assert
            result.Id.Should().Be(1);
            result.Name.Should().Be("Agile Center");
            result.Description.Should().Be("Agile Center Service Line");
        }

        [Fact]
        public void GetServiceLine_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenWrongIdIsGiven()
        {
            // Act
            Action action = () => { _serviceLineProvider.GetServiceLine(4); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateServiceLine_ShouldReturnTheUpdatedServiceLine()
        {
            // Act
            var updated = _serviceLineProvider.UpdateServiceLine(1, new Contracts.ServiceLine
            {
                Name = "TPAM",
                Description = "TPAM"
            });

            // Assert
            updated.Name.Should().Be("TPAM");
            updated.Description.Should().Be("TPAM");
        }

        [Fact]
        public void UpdateServiceLine_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenWrongIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _serviceLineProvider.UpdateServiceLine(3, new Contracts.ServiceLine
                {
                    Name = "Rail",
                    Description = "Service line rail"
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void CreateServiceLine_ShouldReturnTheNewlyCreatedServiceLine()
        {
            // Arrange
            var newlyServiceLine = new Contracts.ServiceLine
            {
                Name = "Orange Box",
                Description = "CBS Hospitality Orange Box"
            };

            // Act
            _serviceLineProvider.CreateServiceLine(newlyServiceLine);

            // Assert
            _knowledgeCenterContextMock.ServiceLines.Count().Should().Be(3);
            newlyServiceLine.Should().BeEquivalentTo(new ServiceLine
            {
                Name = "Orange Box",
                Description = "CBS Hospitality Orange Box"
            });
        }

        [Fact]
        public void CreateServiceLine_ShouldThrow_SERVICELINE_ALREADYEXISTS_Exception_WhenServiceLineAlreadyExists()
        {
            // Arrange
            var newlyServiceLine = new Contracts.ServiceLine
            {
                Name = "Agile Center",
                Description = "Agile Center Service Line"
            };

            // Act
            Action action = () => { _serviceLineProvider.CreateServiceLine(newlyServiceLine); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SERVICELINE_ALREADYEXISTS);
        }

        [Fact]
        public void DeleteServiceLine_ShouldDeleteTheServiceLineAndRemoveIt_WhenSelectEverything()
        {
            // Act
            _serviceLineProvider.DeleteServiceLine(1);

            // Assert
            _knowledgeCenterContextMock.ServiceLines.Count().Should().Be(1);
        }

        [Fact]
        public void DeleteServiceLine_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenNoServiceLineFound()
        {
            // Act
            Action action = () => { _serviceLineProvider.DeleteServiceLine(4); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteServiceLine_ShouldThrow_SERVICELINE_LINKEDWITHUSER_WhenUserAffectedToThisServiceLine()
        {
            // Act
            Action action = () => _serviceLineProvider.DeleteServiceLine(2);

            //Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SERVICELINE_LINKEDWITHUSER);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            knowledgeCenterContextMock.Agencies.AddRange(GetAgencies());
            knowledgeCenterContextMock.ServiceLines.AddRange(GetServiceLines());
            knowledgeCenterContextMock.Users.AddRange(GetUsers());
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
                .And(x => x.AgencyId = 2)
                .And(x => x.ServiceLineId = 2)
                .TheFirst(1)
                .With(x => x.Id, 0)
                .And(x => x.Firstname, "John")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "jdoe")
                .And(x => x.Email, "jdoe@hotmail.fr")
                .TheNext(1)
                .With(x => x.Id, 0)
                .And(x => x.Firstname, "Bob")
                .And(x => x.Lastname, "Doe")
                .And(x => x.Login, "bdoe")
                .And(x => x.Email, "bdoe@hotmail.fr")
                .Build();
        }

        private IList<Agency> GetAgencies()
        {
            return Builder<Agency>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .With(x => x.Name, "Sophia-Antipolis")
                .With(x => x.PostalCode, "06560")
                .TheNext(1)
                .With(x => x.Id, 2)
                .With(x => x.Name, "Pau")
                .With(x => x.PostalCode, "64000")
                .Build();
        }

        private IList<ServiceLine> GetServiceLines()
        {
            return Builder<ServiceLine>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Name, "Agile Center")
                .And(x => x.Description, "Agile Center Service Line")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Name, "DTC")
                .And(x => x.Description, "Digital Technology and Cloud")
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock?.Dispose();
        }
    }
}