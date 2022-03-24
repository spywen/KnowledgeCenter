using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using KnowledgeCenter.DataConnector.Entities.Match;
using KnowledgeCenter.Match.Providers.Tests.Helpers;
using Xunit;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class MatchingScorePerSkillProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly MatchingScorePerSkillProvider _matchingScorePerSkill;

        public MatchingScorePerSkillProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _matchingScorePerSkill = new MatchingScorePerSkillProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetAllMatchingScoresPerSkill_ShouldReturnAllScoresPerSkillForAGivenCustomerOffer()
        {
            // Act
            var matchingScorePerSkillResults = _matchingScorePerSkill.GetAllMatchingScoresPerSkill(2);

            // Assert
            matchingScorePerSkillResults.Count.Should().Be(2);

            matchingScorePerSkillResults[0].MatchingId.Should().Be(2);
            matchingScorePerSkillResults[0].Id.Should().Be(2);
            matchingScorePerSkillResults[0].SkillLevelId.Should().Be(3);
            matchingScorePerSkillResults[0].CustomerOfferSkillId.Should().Be(1);
            matchingScorePerSkillResults[0].Score.Should().Be(13);

            matchingScorePerSkillResults[1].MatchingId.Should().Be(2);
            matchingScorePerSkillResults[1].Id.Should().Be(3);
            matchingScorePerSkillResults[1].SkillLevelId.Should().Be(1);
            matchingScorePerSkillResults[1].CustomerOfferSkillId.Should().Be(1);
            matchingScorePerSkillResults[1].Score.Should().Be(2.72);
        }

        [Fact]
        public void GetAllMatchingScoresPerSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongMatchingIdIsGiven()
        {
            // Act
            Action action = () => { _matchingScorePerSkill.GetAllMatchingScoresPerSkill(321); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void GetMatchingScorePerSkill_ShouldReturnExpectedScoresPerSkill_WhenGivenId()
        {
            // Act
            var matchingScorePerSkillResult = _matchingScorePerSkill.GetMatchingScorePerSkill(1);

            // Assert
            matchingScorePerSkillResult.Should().NotBeNull();

            matchingScorePerSkillResult.MatchingId.Should().Be(1);
            matchingScorePerSkillResult.Id.Should().Be(1);
            matchingScorePerSkillResult.SkillLevelId.Should().Be(3);
            matchingScorePerSkillResult.CustomerOfferSkillId.Should().Be(1);
            matchingScorePerSkillResult.Score.Should().Be(8.96);
        }

        [Fact]
        public void GetMatchingScorePerSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongMatchingScorePerSkillIdIsGiven()
        {
            // Act
            Action action = () => { _matchingScorePerSkill.GetMatchingScorePerSkill(321); };

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
            var tomUser = new User
            {
                Id = 4,
                Login = "tmoore",
                Firstname = "Tom",
                Lastname = "Moore",
                Email = "tmoore@capgemini.com",
                ServiceLineId = 1,
                AgencyId = 1
            };

            var skillAgile = new Skill
            {
                Id = 1,
                Name = "Agile",
                ServiceLineId = 1
            };
            var skillCSharp = new Skill
            {
                Id = 2,
                Name = "C#",
                ServiceLineId = 1
            };
            var skillJava = new Skill
            {
                Id = 3,
                Name = "Java",
                ServiceLineId = 1
            };
            var skillTeamCoaching = new Skill
            {
                Id = 4,
                Name = "Team Coaching",
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
                SkillId = skillJava.Id,
                SkillLevelId = seniorLevel.Id
            };
            var johnSkill2 = new CollaboratorSkill
            {
                Id = 2,
                CollaboratorId = johnUser.Id,
                SkillId = skillCSharp.Id,
                SkillLevelId = noviceLevel.Id
            };
            var steveSkill1 = new CollaboratorSkill
            {
                Id = 3,
                CollaboratorId = steveUser.Id,
                SkillId = skillJava.Id,
                SkillLevelId = intermediateLevel.Id
            };
            var steveSkill2 = new CollaboratorSkill
            {
                Id = 4,
                CollaboratorId = steveUser.Id,
                SkillId = skillCSharp.Id,
                SkillLevelId = intermediateLevel.Id
            };
            var annaSkill1 = new CollaboratorSkill
            {
                Id = 5,
                CollaboratorId = annaUser.Id,
                SkillId = skillJava.Id,
                SkillLevelId = seniorLevel.Id
            };
            var annaSkill2 = new CollaboratorSkill
            {
                Id = 6,
                CollaboratorId = annaUser.Id,
                SkillId = skillCSharp.Id,
                SkillLevelId = seniorLevel.Id
            };
            var annaSkill3 = new CollaboratorSkill
            {
                Id = 7,
                CollaboratorId = annaUser.Id,
                SkillId = skillAgile.Id,
                SkillLevelId = intermediateLevel.Id
            };
            var tomSkill = new CollaboratorSkill
            {
                Id = 8,
                CollaboratorId = tomUser.Id,
                SkillId = skillTeamCoaching.Id,
                SkillLevelId = expertLevel.Id
            };


            var johnCollaborator = new Collaborator
            {
                Id = johnUser.Id,
                GGID = 11111111,
                CollaboratorSkills = new List<CollaboratorSkill> {johnSkill1, johnSkill2}
            };
            var steveCollaborator = new Collaborator
            {
                Id = steveUser.Id,
                GGID = 222222222,
                CollaboratorSkills = new List<CollaboratorSkill> {steveSkill1, steveSkill2}
            };
            var annaCollaborator = new Collaborator
            {
                Id = annaUser.Id,
                GGID = 333333333,
                CollaboratorSkills = new List<CollaboratorSkill> {annaSkill1, annaSkill2, annaSkill3}
            };
            var tomCollaborator = new Collaborator
            {
                Id = tomUser.Id,
                GGID = 444444444,
                CollaboratorSkills = new List<CollaboratorSkill> {tomSkill}
            };

            var customerOffer = new CustomerOffer
            {
                Id = 1,
                JobTitle = "Offer",
                Requester = "Amadeus requester",
                CreationDate = now,
                ModificationDate = now,
                MissionStartDate = DateTime.MaxValue,
                MissionEndDate = null,
                MobilityRequired = false,
                CustomerOfferStatusId = 1,
                OnSite = true,
                CustomerSiteId = 1,
                WorkFromHome = true,
                Description = "description...",
                CustomerAccountManagerId = tomCollaborator.Id
            };

            var customerOfferSkillJava = new CustomerOfferSkill
            {
                Id = 1,
                CustomerOfferId = customerOffer.Id,
                SkillId = skillJava.Id,
                SkillLevelId = seniorLevel.Id,
                SkillPriority = 1
            };
            var customerOfferSkillCSharp = new CustomerOfferSkill
            {
                Id = 2,
                CustomerOfferId = customerOffer.Id,
                SkillId = skillCSharp.Id,
                SkillLevelId = seniorLevel.Id,
                SkillPriority = 2
            };
            var customerOfferSkillAgile = new CustomerOfferSkill
            {
                Id = 3,
                CustomerOfferId = customerOffer.Id,
                SkillId = skillAgile.Id,
                SkillLevelId = intermediateLevel.Id,
                SkillPriority = 3
            };

            var johnOldMatching = new Matching
            {
                Id = 1,
                CustomerOfferId = customerOffer.Id,
                CollaboratorId = johnCollaborator.Id,
                CreationDate = DateTime.MinValue,
                Score = 8.96
            };
            var johnOldMatchingScorePerSkillJava = new MatchingScorePerSkill
            {
                Id = 1,
                MatchingId = johnOldMatching.Id,
                SkillLevelId = johnSkill1.SkillLevelId,
                CustomerOfferSkillId = johnOldMatching.CustomerOfferId,
                Score = 8.96
            };

            var johnRecentMatching = new Matching
            {
                Id = 2,
                CustomerOfferId = customerOffer.Id,
                CollaboratorId = johnCollaborator.Id,
                CreationDate = now,
                Score = 13
            };
            var johnRecentMatchingScorePerSkillJava = new MatchingScorePerSkill
            {
                Id = 2,
                MatchingId = johnRecentMatching.Id,
                SkillLevelId = johnSkill1.SkillLevelId,
                CustomerOfferSkillId = johnRecentMatching.CustomerOfferId,
                Score = 13
            };
            var johnRecentMatchingScorePerSkillCSharpe = new MatchingScorePerSkill
            {
                Id = 3,
                MatchingId = johnRecentMatching.Id,
                SkillLevelId = johnSkill2.SkillLevelId,
                CustomerOfferSkillId = johnRecentMatching.CustomerOfferId,
                Score = 2.72
            };

            knowledgeCenterContextMock.Agencies.Add(new Agency {Id = 1, Name = "Biot", PostalCode = "06410"});
            knowledgeCenterContextMock.ServiceLines.Add(new ServiceLine {Id = 1, Name = "Agile Center", Description = "Agile Center Service Line"});
            knowledgeCenterContextMock.Users.AddRange(johnUser, steveUser, annaUser, tomUser);
            knowledgeCenterContextMock.Skills.AddRange(skillAgile, skillTeamCoaching, skillJava, skillCSharp);
            knowledgeCenterContextMock.SkillLevels.AddRange(noviceLevel, intermediateLevel, seniorLevel, expertLevel);
            knowledgeCenterContextMock.Collaborators.AddRange(johnCollaborator, annaCollaborator, steveCollaborator, tomCollaborator);
            knowledgeCenterContextMock.CollaboratorSkills.AddRange(johnSkill1, johnSkill2, steveSkill1, steveSkill2, annaSkill1, annaSkill2, annaSkill3, tomSkill);
            knowledgeCenterContextMock.Customers.Add(new Customer {Id = 1, Name = "Amadeus", CreationDate = now, ModificationDate = now});
            knowledgeCenterContextMock.CustomersSites.Add(new CustomerSite {Id = 1, Name = "Paris", CustomerId = 1, Address = "Address for Paris", Contact = null, CreationDate = now, ModificationDate = now});
            knowledgeCenterContextMock.CustomerOffersStatus.Add(new CustomerOfferStatus {Id = 1, Code = "OPEN", Description = "Open"});
            knowledgeCenterContextMock.CustomerOffers.Add(customerOffer);
            knowledgeCenterContextMock.CustomerOfferSkills.AddRange(customerOfferSkillAgile, customerOfferSkillJava, customerOfferSkillCSharp);
            knowledgeCenterContextMock.Matching.AddRange(johnOldMatching, johnRecentMatching);
            knowledgeCenterContextMock.MatchingScoresPerSkill.AddRange(johnOldMatchingScorePerSkillJava, johnRecentMatchingScorePerSkillJava, johnRecentMatchingScorePerSkillCSharpe);

            knowledgeCenterContextMock.SaveChanges();
            return knowledgeCenterContextMock;
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}