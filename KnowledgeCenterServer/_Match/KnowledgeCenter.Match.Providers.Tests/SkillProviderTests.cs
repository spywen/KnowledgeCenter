using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using KnowledgeCenter.DataConnector.Entities.Match;
using Xunit;
using _BaseTests = KnowledgeCenter.Match.Providers.Tests.Helpers._BaseTests;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class SkillProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly SkillProvider _skillProvider;

        public SkillProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _skillProvider = new SkillProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void CreateSkill_ShouldSuccessfullyCreateANewSkill_WhenItDoesNotAlreadyExist()
        {
            // Act
            var createdSkill = _skillProvider.CreateSkill(new Match.Contracts.Skill
            {
                Name = "SAFe",
                ServiceLineId = 1
            });

            // Assert
            var skillsCount = _knowledgeCenterContextMock.Skills.Count();
            skillsCount.Should().Be(4);
            createdSkill.Should().BeEquivalentTo(new Skill
            {
                Id = 4,
                Name = "SAFe",
                ServiceLineId = 1,
                ServiceLine = new ServiceLine
                {
                    Id = 1,
                    Description = "Agile Center Service Line",
                    Name = "Agile Center"
                }
            });
        }

        [Fact]
        public void CreateSkill_ShouldThrow_SKILL_ALREADYEXISTS_Exception_WhenASkillWithTheSameNameAlreadyExists()
        {
            // Act
            Action action = () =>
            {
                _skillProvider.CreateSkill(new Match.Contracts.Skill
                {
                    Name = "Agile",
                    ServiceLineId = 1
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SKILL_ALREADYEXISTS);
        }

        [Fact]
        public void CreateSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenASWrongServiceLineIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _skillProvider.CreateSkill(new Match.Contracts.Skill
                {
                    Name = "SAFe",
                    ServiceLineId = 10
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void CreateSkill_ShouldSuccessfullyCreateASkillWithServiceLineIdSetAtZero_WhenNoValueIsGiven()
        {
            // Act
            var createdSkill = _skillProvider.CreateSkill(new Match.Contracts.Skill
            {
                Name = "SAFe"
            });

            // Assert
            var skillsCount = _knowledgeCenterContextMock.Skills.Count();
            skillsCount.Should().Be(4);
            createdSkill.Should().BeEquivalentTo(new Skill
            {
                Id = 4,
                Name = "SAFe",
                ServiceLineId = 0
            });
        }

        [Fact]
        public void DeleteSkill_ShouldDeleteTheSkillCorrespondingToTheGivenId()
        {
            // Act
            _skillProvider.DeleteSkill(3);

            // Assert
            _knowledgeCenterContextMock.Skills.Count().Should().Be(2);
        }

        [Fact]
        public void DeleteSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongSkillIdIsGiven()
        {
            // Act
            Action action = () => { _skillProvider.DeleteSkill(4); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteSkill_ShouldThrow_SKILL_LINKEDTOCOLLABORATOR_Exception_TheSkillCorrespingToTheGivenIdIsLinkedToACollaborator()
        {
            // Act
            Action action = () => { _skillProvider.DeleteSkill(2); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SKILL_LINKEDTOCOLLABORATOR);
        }

        [Fact]
        public void UpdateSkill_ShouldCorrectlyModifyTheSkill()
        {
            // Act
            var skill = _skillProvider.UpdateSkill(1, new Match.Contracts.Skill
            {
                Name = "SAFe",
                ServiceLineId = 1
            }); // Modified the name from "Agile" to "SAFe"

            // Assert
            skill.Name.Should().Be("SAFe");
            skill.ServiceLineId.Should().Be(1);
        }

        [Fact]
        public void UpdateSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongSkillIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _skillProvider.UpdateSkill(4, new Match.Contracts.Skill
                {
                    Name = "SAFe",
                    ServiceLineId = 1
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateSkill_ShouldThrow_SKILL_ALREADYEXISTS_Exception_WhenASkillAlreadyExistsForTheGivenName()
        {
            // Act
            Action action = () =>
            {
                _skillProvider.UpdateSkill(1, new Match.Contracts.Skill
                {
                    Name = "Team Coaching",
                    ServiceLineId = 1
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SKILL_ALREADYEXISTS);
        }

        [Fact]
        public void UpdateSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongServiceLineIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _skillProvider.UpdateSkill(1, new Match.Contracts.Skill
                {
                    Name = "SAFe",
                    ServiceLineId = 10
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateSkill_ShouldCorrectlyModifyTheServiceLineIdToZero_WhenNoValueIsGiven()
        {
            // Act
            var skill = _skillProvider.UpdateSkill(1, new Match.Contracts.Skill
            {
                Name = "SAFe"
            });

            // Assert
            skill.Name.Should().Be("SAFe");
            skill.ServiceLineId.Should().Be(0);
        }

        [Fact]
        public void GetAllSkills_ShouldReturnAllAvailableSkill()
        {
            // Act
            var skillsResult = _skillProvider.GetAllSkills();

            // Assert
            skillsResult.Count.Should().Be(3);
            skillsResult[0].Should().BeEquivalentTo(new Skill
            {
                Id = 1,
                Name = "Agile",
                ServiceLineId = 1,
                ServiceLine = new ServiceLine
                {
                    Id = 1,
                    Description = "Agile Center Service Line",
                    Name = "Agile Center"
                }
            });
            skillsResult[1].Should().BeEquivalentTo(new Skill
            {
                Id = 2,
                Name = "Team Coaching",
                ServiceLineId = 1,
                ServiceLine = new ServiceLine
                {
                    Id = 1,
                    Description = "Agile Center Service Line",
                    Name = "Agile Center"
                }
            });
        }

        [Fact]
        public void GetSkill_ShouldReturnTheCorrectSkillForAGivenId()
        {
            // Act
            var skillResult = _skillProvider.GetSkill(1);

            // Assert
            skillResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Skill
                {
                    Id = 1,
                    Name = "Agile",
                    ServiceLineId = 1,
                    ServiceLine = new ServiceLine
                    {
                        Id = 1,
                        Description = "Agile Center Service Line",
                        Name = "Agile Center"
                    }
                });
        }

        [Fact]
        public void GetSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongSkillIdIsGiven()
        {
            // Act
            Action action = () => { _skillProvider.GetSkill(4); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var biotAgency = new Agency
            {
                Id = 1,
                Name = "Biot",
                PostalCode = "06410"
            };

            var agileCenter = new ServiceLine
            {
                Id = 1,
                Name = "Agile Center",
                Description = "Agile Center Service Line"
            };

            var dtc = new ServiceLine
            {
                Id = 2,
                Name = "DTC",
                Description = "Digital Technology and Cloud"
            };

            var userMock = new User
            {
                Id = 1,
                Login = "jdoe",
                Firstname = "John",
                Lastname = "Doe",
                Email = "jdoe@hotmail.fr",
                ServiceLineId = 1,
                AgencyId = 1
            };

            var collaboratorMock = new Collaborator
            {
                Id = 1,
                GGID = 1111
            };

            var skillAgile = new Skill
            {
                Id = 1,
                Name = "Agile",
                ServiceLineId = 1
            };

            var skillTeamCoaching = new Skill
            {
                Id = 2,
                Name = "Team Coaching",
                ServiceLineId = 1
            };

            var skillScrum = new Skill
            {
                Id = 3,
                Name = "SCRUM",
                ServiceLineId = 1
            };

            var noviceLevel = new SkillLevel
            {
                Id = 1,
                Name = "Novice"
            };

            var expertLevel = new SkillLevel
            {
                Id = 2,
                Name = "Expert"
            };


            var collaboratorSkill = new CollaboratorSkill
            {
                Id = 1,
                CollaboratorId = 1,
                SkillId = 1,
                SkillLevelId = 1
            };

            var collaboratorSkill2 = new CollaboratorSkill
            {
                Id = 2,
                CollaboratorId = 1,
                SkillId = 2,
                SkillLevelId = 2
            };

            knowledgeCenterContextMock.Agencies.Add(biotAgency);
            knowledgeCenterContextMock.ServiceLines.Add(agileCenter);
            knowledgeCenterContextMock.ServiceLines.Add(dtc);
            knowledgeCenterContextMock.Users.Add(userMock);
            knowledgeCenterContextMock.Collaborators.Add(collaboratorMock);
            knowledgeCenterContextMock.Skills.Add(skillAgile);
            knowledgeCenterContextMock.Skills.Add(skillTeamCoaching);
            knowledgeCenterContextMock.Skills.Add(skillScrum);
            knowledgeCenterContextMock.SkillLevels.Add(noviceLevel);
            knowledgeCenterContextMock.SkillLevels.Add(expertLevel);
            knowledgeCenterContextMock.CollaboratorSkills.Add(collaboratorSkill);
            knowledgeCenterContextMock.CollaboratorSkills.Add(collaboratorSkill2);

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}