using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Providers.Tests.Helpers;
using KnowledgeCenter.Match.Contracts;
using Xunit;
using Agency = KnowledgeCenter.DataConnector.Entities.Agency;
using Collaborator = KnowledgeCenter.DataConnector.Entities.Match.Collaborator;
using CollaboratorSkill = KnowledgeCenter.DataConnector.Entities.Match.CollaboratorSkill;
using Customer = KnowledgeCenter.DataConnector.Entities.Match.Customer;
using CustomerOffer = KnowledgeCenter.DataConnector.Entities.Match.CustomerOffer;
using CustomerOfferSkill = KnowledgeCenter.DataConnector.Entities.Match.CustomerOfferSkill;
using CustomerOfferStatus = KnowledgeCenter.DataConnector.Entities.Match.CustomerOfferStatus;
using CustomerSite = KnowledgeCenter.DataConnector.Entities.Match.CustomerSite;
using Matching = KnowledgeCenter.DataConnector.Entities.Match.Matching;
using MatchingScorePerSkill = KnowledgeCenter.DataConnector.Entities.Match.MatchingScorePerSkill;
using ServiceLine = KnowledgeCenter.DataConnector.Entities.ServiceLine;
using Skill = KnowledgeCenter.DataConnector.Entities.Match.Skill;
using SkillLevel = KnowledgeCenter.DataConnector.Entities.Match.SkillLevel;
using User = KnowledgeCenter.DataConnector.Entities.User;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class MatchingProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly MatchingProvider _matchingProvider;

        public MatchingProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _matchingProvider = new MatchingProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }
        
        [Fact]
        public void GenerateMatching()
        {
            // Act
            var angularMatchingResults = _matchingProvider.GenerateMatching(1);
            var dotNetMatchingResults = _matchingProvider.GenerateMatching(2);
            _knowledgeCenterContextMock.Matching.Count().Should().Be(4);
            _knowledgeCenterContextMock.MatchingScoresPerSkill.Count().Should().Be(4);
            
            // Assert
            angularMatchingResults.Count.Should().Be(2);
            dotNetMatchingResults.Count.Should().Be(2);
            
            angularMatchingResults[0].CollaboratorId.Should().Be(1);
            angularMatchingResults[0].Score.Should().Be(100);
            dotNetMatchingResults[0].CollaboratorId.Should().Be(2);
            dotNetMatchingResults[0].Score.Should().Be(100);
            
            angularMatchingResults[1].CollaboratorId.Should().Be(3);
            angularMatchingResults[1].Score.Should().Be(66.67);
            dotNetMatchingResults[1].CollaboratorId.Should().Be(3);
            dotNetMatchingResults[1].Score.Should().Be(50);
        }

        [Fact]
        public void GenerateMatching_ShouldThrow_ENTITY_NOTFOUND_WhenCustomerOfferDoesNotExist()
        {
            // Act
            Action action = () => { _matchingProvider.GenerateMatching(1234); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void GetAllRecentMatching_ShouldReturnEveryMatchingCorrespondingToTheGivenByCustomerOfferId()
        {
            // Act
            var matchingResults = _matchingProvider.GetFilteredMatching(new BasePaginationRequest<MatchingFilter>(new MatchingFilter
            {
                CustomerOfferId = 1
            }));
            
            // Assert
            matchingResults.Data.Should().HaveCount(1);
            
            matchingResults.Data[0].Id.Should().Be(1);
            matchingResults.Data[0].CollaboratorId.Should().Be(1);
            matchingResults.Data[0].MatchingScorePerSkills.Should().HaveCount(1);
            matchingResults.Data[0].Score.Should().Be(100);
        }
        
        [Fact]
        public void GetMatching_ShouldReturnExpectedMatching()
        {
            // Act
            var matchingResult = _matchingProvider.GetMatching(1);
            
            // Assert
            matchingResult.Should().NotBeNull();
            
            matchingResult.Id.Should().Be(1);
            matchingResult.CollaboratorId.Should().Be(1);
            matchingResult.Score.Should().Be(100);
        }

        [Fact]
        public void GetMatching_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenMatchingDoesNotExist()
        {
            // Act
            Action action = () => { _matchingProvider.GetMatching(1234); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteMatching_ShouldDeleteAllMatchingAndSCoresPerSkillLinkedWithTheGivenCustomerOffer()
        {
            // Act
            _matchingProvider.DeleteMatching(1);
            
            // Assert
            _knowledgeCenterContextMock.Matching.Count().Should().Be(0);
            _knowledgeCenterContextMock.MatchingScoresPerSkill.Count().Should().Be(0);
        }

        [Fact]
        public void DeleteMatching_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenCustomerOfferDoesNotExist()
        {
            // Act
            Action action = () => { _matchingProvider.DeleteMatching(1234); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();
            var now = DateTime.Now;
            
            var johnUser = new User
            {
                Id = 1,
                Login = "jdoe",
                Firstname = "John",
                Lastname = "Doe",
                Email = "jdoe@hotmail.fr",
                ServiceLineId = 1,
                AgencyId = 1
            };
            var steveUser = new User
            {
                Id = 2,
                Login = "ssmith",
                Firstname = "Steve",
                Lastname = "Smith",
                Email = "steve.smith@capgemini.com",
                ServiceLineId = 1,
                AgencyId = 1
            };
            var annaUser = new User
            {
                Id = 3,
                Login = "anna.brown",
                Firstname = "Anna",
                Lastname = "Brown",
                Email = "anna.brown@capgemini.com",
                ServiceLineId = 1,
                AgencyId = 1
            };

            var skillAngular = new Skill
            {
                Id = 1,
                Name = "Angular",
                ServiceLineId = 1
            };
            var skillDotNet = new Skill
            {
                Id = 2,
                Name = ".NET Core",
                ServiceLineId = 1
            };
            
            var noviceLevel = new SkillLevel
            {
                Id = 1,
                Name = "Novice",
                Order = 1
            };
            var intermediateLevel = new SkillLevel
            {
                Id = 2,
                Name = "Intermediate",
                Order = 2
            };
            var seniorLevel = new SkillLevel
            {
                Id = 3,
                Name = "Senior",
                Order = 3
            };
            var expertLevel = new SkillLevel
            {
                Id = 4,
                Name = "Expert",
                Order = 4
            };
            
            var johnSkill1 = new CollaboratorSkill
            {
                Id = 1,
                CollaboratorId = johnUser.Id,
                SkillId = skillAngular.Id,
                SkillLevelId = seniorLevel.Id
            };
            var steveSkill1 = new CollaboratorSkill
            {
                Id = 2,
                CollaboratorId = steveUser.Id,
                SkillId = skillDotNet.Id,
                SkillLevelId = intermediateLevel.Id
            };
            var annaSkill1 = new CollaboratorSkill
            {
                Id = 3,
                CollaboratorId = annaUser.Id,
                SkillId = skillAngular.Id,
                SkillLevelId = intermediateLevel.Id
            };
            var annaSkill2 = new CollaboratorSkill
            {
                Id = 5,
                CollaboratorId = annaUser.Id,
                SkillId = skillDotNet.Id,
                SkillLevelId = noviceLevel.Id
            };

            var johnCollaborator = new Collaborator
            {
                Id = johnUser.Id,
                GGID = 11111111,
                CollaboratorSkills = new List<CollaboratorSkill>{ johnSkill1 }
            };
            var steveCollaborator = new Collaborator
            {
                Id = steveUser.Id,
                GGID = 222222222,
                CollaboratorSkills = new List<CollaboratorSkill>{ steveSkill1 }
            };
            var annaCollaborator = new Collaborator
            {
                Id = annaUser.Id,
                GGID = 333333333,
                CollaboratorSkills = new List<CollaboratorSkill>{ annaSkill1, annaSkill2 }
            };

            var customerOfferAngular = new CustomerOffer
            {
                Id = 1,
                JobTitle = "Angular Developer",
                Requester = "Amadeus requester",
                CreationDate = now,
                ModificationDate = now,
                MissionStartDate = now,
                MissionEndDate = DateTime.MaxValue,
                MobilityRequired = false,
                OnSite = true,
                WorkFromHome = true,
                CustomerOfferStatusId = 1,
                Description = "description...",
                CustomerAccountManagerId = johnCollaborator.Id,
                CustomerSiteId = 1
            };
            var customerOfferDotNet = new CustomerOffer
            {
                Id = 2,
                JobTitle = ".NET Core Developer",
                Requester = "Amadeus requester",
                CreationDate = now,
                ModificationDate = now,
                MissionStartDate = now,
                MissionEndDate = DateTime.MaxValue,
                MobilityRequired = false,
                OnSite = false,
                WorkFromHome = true,
                CustomerOfferStatusId = 1,
                Description = "description...",
                CustomerAccountManagerId = johnCollaborator.Id,
                CustomerSiteId = 1
            };

            var customerOfferSkillAngular = new CustomerOfferSkill
            {
                Id = 1,
                CustomerOfferId = customerOfferAngular.Id,
                SkillId = skillAngular.Id,
                SkillLevelId = seniorLevel.Id,
                SkillPriority = 1
            };
            var customerOfferSkillDotNet = new CustomerOfferSkill
            {
                Id = 2,
                CustomerOfferId = customerOfferDotNet.Id,
                SkillId = skillDotNet.Id,
                SkillLevelId = intermediateLevel.Id,
                SkillPriority = 2
            };
            
            var johnMatchingAngularOffer = new Matching
            {
                Id = 1,
                CustomerOfferId = customerOfferAngular.Id,
                CollaboratorId = johnCollaborator.Id,
                CreationDate = now,
                Score = 100
            };
            var johnMatchingScorePerSkillAngular = new MatchingScorePerSkill
            {
                Id = 1,
                MatchingId = johnMatchingAngularOffer.Id,
                SkillLevelId = johnSkill1.SkillLevelId,
                CustomerOfferSkillId = johnMatchingAngularOffer.CustomerOfferId,
                Score = 100
            };


            knowledgeCenterContextMock.Agencies.Add(new Agency { Id = 1, Name = "Biot", PostalCode = "06410" });
            knowledgeCenterContextMock.ServiceLines.Add(new ServiceLine { Id = 1, Name = "Agile Center", Description = "Agile Center Service Line" });
            knowledgeCenterContextMock.Users.AddRange(johnUser, steveUser, annaUser);
            knowledgeCenterContextMock.Skills.AddRange(skillAngular, skillDotNet);
            knowledgeCenterContextMock.SkillLevels.AddRange(noviceLevel, intermediateLevel, seniorLevel, expertLevel);
            knowledgeCenterContextMock.Collaborators.AddRange(johnCollaborator, annaCollaborator, steveCollaborator);
            knowledgeCenterContextMock.CollaboratorSkills.AddRange(johnSkill1, steveSkill1, annaSkill1, annaSkill2);
            knowledgeCenterContextMock.Customers.Add(new Customer { Id = 1, Name = "Amadeus", CreationDate = now, ModificationDate = now });
            knowledgeCenterContextMock.CustomersSites.Add(new CustomerSite { Id = 1, Name = "Paris", CustomerId = 1, Address = "Address for Paris", Contact = null, CreationDate = now, ModificationDate = now });
            knowledgeCenterContextMock.CustomerOffersStatus.Add(new CustomerOfferStatus { Id = 1, Code = "OPEN", Description = "Open" });
            knowledgeCenterContextMock.CustomerOffers.AddRange(customerOfferAngular, customerOfferDotNet);
            knowledgeCenterContextMock.CustomerOfferSkills.AddRange(customerOfferSkillAngular, customerOfferSkillDotNet);
            knowledgeCenterContextMock.Matching.AddRange(johnMatchingAngularOffer);
            knowledgeCenterContextMock.MatchingScoresPerSkill.AddRange(johnMatchingScorePerSkillAngular);
            
            knowledgeCenterContextMock.SaveChanges();
            return knowledgeCenterContextMock;
        }
        
        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}