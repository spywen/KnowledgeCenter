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
    public class AgencyProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly AgencyProvider _agencyProvider;

        public AgencyProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _agencyProvider = new AgencyProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void CreateAgency_ShouldSuccessfullyCreateANewAgency_WhenItDoesNotAlreadyExist()
        {
            // Act
            var createdAgency = _agencyProvider.CreateAgency(new Contracts.Agency
            {
                Name = "Paris",
                PostalCode = "75000"
            });

            // Assert
            var agenciesCount = _knowledgeCenterContextMock.Agencies.Count();
            agenciesCount.Should().Be(3);
            createdAgency.Should().BeEquivalentTo(new Agency
            {
                Id = 3,
                Name = "Paris",
                PostalCode = "75000"
            });
        }

        [Fact]
        public void CreateAgency_ShouldThrow_AGENCY_ALREADYEXISTS_Exception_WhenAnAgencyWithTheSameInfoAlreadyExists()
        {
            // Act
            Action action = () =>
            {
                _agencyProvider.CreateAgency(new Contracts.Agency
                {
                    Name = "Sophia-Antipolis",
                    PostalCode = "06560"
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.AGENCY_ALREADYEXISTS);
        }

        [Fact]
        public void DeleteAgency_ShouldDeleteTheAgencyCorrespondingToTheGivenId()
        {
            // Act
            _agencyProvider.DeleteAgency(1);

            // Assert
            _knowledgeCenterContextMock.Agencies.Count().Should().Be(1);
        }

        [Fact]
        public void DeleteAgency_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongAgencyIdIsGiven()
        {
            // Act
            Action action = () => { _agencyProvider.DeleteAgency(3); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteAgency_ShouldThrow_AGENCY_LINKEDWITHUSER_WhenUserAffectedToThisAgency()
        {
            // Act
            Action action = () => _agencyProvider.DeleteAgency(2);

            //Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.AGENCY_LINKEDWITHUSER);
        }

        [Fact]
        public void UpdateAgency_ShouldModifyThePostalCode()
        {
            // Act
            var agency = _agencyProvider.UpdateAgency(2, new Contracts.Agency { Name = "Pau", PostalCode = "65000" }); // Modified the postal code

            // Assert
            agency.Name.Should().Be("Pau");
            agency.PostalCode.Should().Be("65000");
        }

        [Fact]
        public void UpdateAgency_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongAgencyIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _agencyProvider.UpdateAgency(3, new Contracts.Agency
                {
                    Name = "Paris",
                    PostalCode = "75000"
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void GetAllAgencies_ShouldReturnAllAvailableAgencies()
        {
            // Act
            var result = _agencyProvider.GetAllAgencies();

            // Assert
            result.Count.Should().Be(2);
            result[0].Name.Should().Be("Sophia-Antipolis");
            result[0].PostalCode.Should().Be("06560");
            result[1].Name.Should().Be("Pau");
            result[1].PostalCode.Should().Be("64000");
        }

        [Fact]
        public void GetAgency_ShouldReturnTheCorrectAgencyForAGivenId()
        {
            // Act
            var result = _agencyProvider.GetAgency(1);

            // Assert
            result.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Agency
                {
                    Id = 1,
                    Name = "Sophia-Antipolis",
                    PostalCode = "06560"
                });
        }

        [Fact]
        public void GetAgency_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongAgencyIdIsGiven()
        {
            // Act
            Action action = () => { _agencyProvider.GetAgency(3); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
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
            _knowledgeCenterContextMock.Dispose();
        }
    }
}