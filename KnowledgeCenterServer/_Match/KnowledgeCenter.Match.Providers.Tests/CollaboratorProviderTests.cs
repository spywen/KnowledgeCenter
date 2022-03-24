using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers.Tests.Helpers;
using Moq;
using Xunit;
using Agency = KnowledgeCenter.Match.Contracts.Agency;
using ServiceLine = KnowledgeCenter.Match.Contracts.ServiceLine;
using User = KnowledgeCenter.DataConnector.Entities.User;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class CollaboratorProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly Mock<IPasswordProvider> _passwordProvider = new Mock<IPasswordProvider>();

        private readonly CollaboratorProvider _collaboratorProvider;

        private const string NewHashedPassword = "NewHashedPassword";
        private const string NewSalt = "NewSalt";
        private const int NewCollaboratorGgid = 3333;

        private const int CollaboratorUserId = 1;
        private const int SimpleUserId = 2;

        public CollaboratorProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _passwordProvider.Setup(x => x.GenerateNewSaltedPassword(It.Is<string>(y => y == NewCollaboratorGgid.ToString())))
                .Returns(new PasswordAndSalt(NewHashedPassword, NewSalt));

            _collaboratorProvider = new CollaboratorProvider(
                _knowledgeCenterContextMock,
                _passwordProvider.Object,
                MapperWithoutMock);
        }

        #region Get

        [Fact]
        public void GetAllCollaborators_ShouldReturnAllCollaborators()
        {
            // Act
            var result = _collaboratorProvider.GetFilteredCollaborators(new Common.BasePaginationRequest<CollaboratorFilter>(null));

            // Assert
            result.Data.Should().HaveCount(2);

            var expectedCollaboratorUser = result.Data.Single(x => x.Id == CollaboratorUserId);
            expectedCollaboratorUser.Should().BeEquivalentTo(new Collaborator
            {
                Id = CollaboratorUserId,
                GGID = 1111,
                Firstname = "John",
                Lastname = "Doe",
                Email = "jdoe@capgemini.com",
                ServiceLineId = 1,
                ServiceLine = new ServiceLine
                {
                    Id = 1,
                    Description = "Agile Center",
                    Name = "Agile Center"
                },
                AgencyId = 1,
                Agency = new Agency
                {
                    Id = 1,
                    Name = "Biot",
                    PostalCode = "06410"
                },
                CollaboratorSkills = new List<CollaboratorSkill>
                {
                    new CollaboratorSkill
                    {
                        Id = 1,
                        SkillId = 1,
                        Skill = new Skill { Id = 1, Name = "Agile", ServiceLineId = 1, ServiceLine = new ServiceLine { Id = 1, Name = "Agile Center", Description = "Agile Center" } },
                        SkillLevelId = 1,
                        SkillLevel = new SkillLevel { Id = 1, Name = "Novice" }
                    }
                }
            });

            var expectedSimpleUser = result.Data.Single(x => x.Id == SimpleUserId);
            expectedSimpleUser.GGID.Should().BeNull();
            expectedSimpleUser.CollaboratorSkills.Should().BeNull();
        }

        [Fact]
        public void GetAllCollaborators_ShouldReturnExpectedUsers_WhenFilteringByAgency()
        {
            // Act
            var result = _collaboratorProvider.GetFilteredCollaborators(new Common.BasePaginationRequest<CollaboratorFilter>(new CollaboratorFilter
            {
                Keyword = "",
                RoleId = 0,
                RoleCode = "",
                AgencyId = 2,
                ServiceLineId = 0
            }));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == SimpleUserId);
        }

        [Fact]
        public void GetAllCollaborators_ShouldReturnExpectedUsers_WhenFilteringByServiceLine()
        {
            // Act
            var result = _collaboratorProvider.GetFilteredCollaborators(new Common.BasePaginationRequest<CollaboratorFilter>(new CollaboratorFilter
            {
                Keyword = "",
                RoleId = 0,
                RoleCode = "",
                AgencyId = 0,
                ServiceLineId = 1
            }));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CollaboratorUserId);
        }

        [Fact]
        public void GetAllCollaborators_ShouldReturnExpectedUsers_WhenFilteringByKeyword()
        {
            // Act
            var result = _collaboratorProvider.GetFilteredCollaborators(new Common.BasePaginationRequest<CollaboratorFilter>(new CollaboratorFilter
            {
                Keyword = "doE",
                RoleId = 0,
                RoleCode = "",
                AgencyId = 0,
                ServiceLineId = 0
            }));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CollaboratorUserId);
        }

        [Fact]
        public void GetAllCollaborators_ShouldReturnExpectedUsers_WhenFilteringByGgid()
        {
            // Act
            var result = _collaboratorProvider.GetFilteredCollaborators(new Common.BasePaginationRequest<CollaboratorFilter>(new CollaboratorFilter
            {
                Keyword = "1111",
                RoleId = 0,
                RoleCode = "",
                AgencyId = 0,
                ServiceLineId = 0
            }));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CollaboratorUserId);
        }

        [Fact]
        public void GetAllCollaborators_ShouldReturnNoUser_WhenFilteringIsTooRestrictive()
        {
            // Act
            var result = _collaboratorProvider.GetFilteredCollaborators(new Common.BasePaginationRequest<CollaboratorFilter>(new CollaboratorFilter { Keyword = "doE", AgencyId = 1, ServiceLineId = 2 }));

            // Assert
            result.Data.Should().HaveCount(0);
        }

        [Fact]
        public void GetCollaborator_ShouldReturnSimpleUser()
        {
            // Act
            var result = _collaboratorProvider.GetCollaborator(SimpleUserId);

            // Assert
            result.Should().BeEquivalentTo(new Collaborator
            {
                Id = SimpleUserId,
                Firstname = "Steve",
                Lastname = "Foo",
                Email = "steve.foo@capgemini.com",
                ServiceLineId = 2,
                ServiceLine = new ServiceLine
                {
                    Id = 2,
                    Description = "Digital Technology and Cloud",
                    Name = "DTC"
                },
                AgencyId = 2,
                Agency = new Agency
                {
                    Id = 2,
                    Name = "Grimaud",
                    PostalCode = "83310"
                }
            });
        }

        [Fact]
        public void GetCollaborator_ShouldCollaboratorUser()
        {
            // Act
            var result = _collaboratorProvider.GetCollaborator(CollaboratorUserId);

            // Assert
            result.Id.Should().Be(CollaboratorUserId);
        }

        [Fact]
        public void GetCollaborator_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenCollaboratorDoesNotExist()
        {
            // Act
            Action action = () => { _collaboratorProvider.GetCollaborator(567); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }


        #endregion

        #region Skills

        [Fact]
        public void UpdateCollaboratorSkillLevel_ShouldThrow_ENTITY_NOT_FOUND_Exception_WhenNoCollaboratorCorrespondsToTheGivenId()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.UpdateCollaboratorSkillLevel(234, 1, new CollaboratorSkill
                {
                    SkillId = 1,
                    SkillLevelId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCollaboratorSkillLevel_ShouldUpdateTheSkillLevelOfTheCollaboratorSkillCorrespondingToTheGivenId()
        {
            // Arrange
            var newCollaboratorSkill = new CollaboratorSkill { SkillId = 1, SkillLevelId = 2 };

            // Act
            _collaboratorProvider.UpdateCollaboratorSkillLevel(CollaboratorUserId, 1, newCollaboratorSkill);
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CollaboratorSkill
                {
                    Id = 1,
                    SkillId = 1,
                    Skill = new Skill
                    {
                        Id = 1,
                        Name = "Agile",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 2,
                    SkillLevel = new SkillLevel
                    {
                        Id = 2,
                        Name = "Expert"
                    }
                });
        }

        [Fact]
        public void DeleteCollaboratorSkill_ShouldThrow_ENTITY_NOT_FOUND_Exception_WhenNoCollaboratorCorrespondsToTheGivenId()
        {
            // Act
            Action action = () => { _collaboratorProvider.DeleteCollaboratorSkill(1111, 1); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteCollaboratorSkill_ShouldCorrectlyDeleteTheCollaboratorSkillCorrespondingToTheGivenId()
        {
            // Act
            _collaboratorProvider.DeleteCollaboratorSkill(CollaboratorUserId, 1);
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(0);
        }

        [Fact]
        public void AddCollaboratorSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenNoCollaboratorCorrespondsToTheGivenId()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.AddCollaboratorSkill(1111, new CollaboratorSkill
                {
                    SkillId = 2,
                    SkillLevelId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void AddCollaboratorSkill_ShouldThrow_COLLABORATOR_ALREADY_HAS_SKILL_Exception_WhenTheCollaboratorAlreadyHasTheGivenSkill()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.AddCollaboratorSkill(1, new CollaboratorSkill
                {
                    SkillId = 1,
                    SkillLevelId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.COLLABORATOR_ALREADY_HAS_SKILL);
        }

        [Fact]
        public void AddCollaboratorSkill_ShouldCorrectlyAddTheCollaboratorSkill()
        {
            // Act
            _collaboratorProvider.AddCollaboratorSkill(CollaboratorUserId, new CollaboratorSkill
            {
                SkillId = 2,
                SkillLevelId = 1
            });
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(2);
        }

        [Fact]
        public void GetCollaboratorSkills_ShouldReturnAllTheSkillsAssociatedWithTheCollaboratorCorrespondingToTheGivenId()
        {
            // Act
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(1);

            // Assert
            collaboratorSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CollaboratorSkill
                {
                    Id = 1,
                    SkillId = 1,
                    Skill = new Skill
                    {
                        Id = 1,
                        Name = "Agile",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 1,
                    SkillLevel = new SkillLevel
                    {
                        Id = 1,
                        Name = "Novice"
                    }
                });
        }

        [Fact]
        public void GetCollaboratorSkills_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongIdIsGiven()
        {
            // Act
            Action action = () => { _collaboratorProvider.GetCollaboratorSkills(234); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCollaboratorSkills_ShouldDeleteExistingSkillAndReplaceByAnother()
        {
            // Arrange
            var newSkillsList = new List<CollaboratorSkill>
            {
                new CollaboratorSkill { SkillId = 2, SkillLevelId = 2 }
            };

            // Act
            _collaboratorProvider.UpdateCollaboratorSkills(CollaboratorUserId, newSkillsList);
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CollaboratorSkill
                {
                    Id = 2,
                    SkillId = 2,
                    Skill = new Skill
                    {
                        Id = 2,
                        Name = "SCRUM",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 2,
                    SkillLevel = new SkillLevel
                    {
                        Id = 2,
                        Name = "Expert"
                    }
                });
        }

        [Fact]
        public void UpdateCollaboratorSkills_ShouldDeleteSkill()
        {
            // Arrange
            var newSkillsList = new List<CollaboratorSkill>();

            // Act
            _collaboratorProvider.UpdateCollaboratorSkills(CollaboratorUserId, newSkillsList);
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(0);
        }

        [Fact]
        public void UpdateCollaboratorSkills_ShouldUpdateSkill()
        {
            // Arrange
            var newSkillsList = new List<CollaboratorSkill> {
                new CollaboratorSkill { SkillId = 1, SkillLevelId = 2 }
            };

            // Act
            _collaboratorProvider.UpdateCollaboratorSkills(CollaboratorUserId, newSkillsList);
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CollaboratorSkill
                {
                    Id = 1,
                    SkillId = 1,
                    Skill = new Skill
                    {
                        Id = 1,
                        Name = "Agile",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 2,
                    SkillLevel = new SkillLevel
                    {
                        Id = 2,
                        Name = "Expert"
                    }
                });
        }

        [Fact]
        public void UpdateCollaboratorSkills_ShouldAddSkill()
        {
            // Arrange
            var newSkillsList = new List<CollaboratorSkill> {
                new CollaboratorSkill { SkillId = 1, SkillLevelId = 1 },
                new CollaboratorSkill { SkillId = 2, SkillLevelId = 1 }
            };

            // Act
            _collaboratorProvider.UpdateCollaboratorSkills(CollaboratorUserId, newSkillsList);
            var collaboratorSkills = _collaboratorProvider.GetCollaboratorSkills(CollaboratorUserId);

            // Assert
            collaboratorSkills.Should().HaveCount(2)
                .And.ContainEquivalentOf(new CollaboratorSkill
                {
                    Id = 2,
                    SkillId = 2,
                    Skill = new Skill
                    {
                        Id = 2,
                        Name = "SCRUM",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 1,
                    SkillLevel = new SkillLevel
                    {
                        Id = 1,
                        Name = "Novice"
                    }
                });
        }

        [Fact]
        public void UpdateCollaboratorSkills_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongIdIsGiven()
        {
            // Act
            var newSkillsList = new List<CollaboratorSkill>
            {
                new CollaboratorSkill {SkillId = 2, SkillLevelId = 2},
                new CollaboratorSkill {SkillId = 3, SkillLevelId = 1}
            };

            Action action = () => { _collaboratorProvider.UpdateCollaboratorSkills(234, newSkillsList); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCollaboratorSkills_ShouldThrow_UNAUTHORIZED_OPERATION_Exception_WhenDuplicateSkillsWereFound()
        {
            // Act
            var newSkillsList = new List<CollaboratorSkill>
            {
                new CollaboratorSkill {SkillId = 1, SkillLevelId = 1},
                new CollaboratorSkill {SkillId = 1, SkillLevelId = 2}
            };

            Action action = () => { _collaboratorProvider.UpdateCollaboratorSkills(1, newSkillsList); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.UNAUTHORIZED_OPERATION);
        }

        #endregion

        #region CRUD

        [Fact]
        public void CreateCollaborator_ShouldCreateNewUserAndCollaboratorData_WhenEmailIsNotBelongingToAnExistingUser_WithDefaultLoginAndPassword()
        {
            // Act
            var newCollaborator = _collaboratorProvider.CreateCollaborator(new CreateOrUpdateCollaborator
            {
                GGID = NewCollaboratorGgid,
                Email = "sheran.ler@capgemini.com",
                Firstname = "Sherman",
                Lastname = "Leroy",
                AgencyId = 1,
                ServiceLineId = 1
            });

            // Assert
            var expectedNewUser = _knowledgeCenterContextMock.Users.Single(x => x.Id == newCollaborator.Id);
            expectedNewUser.Login.Should().Be("sheran.ler@capgemini.com");
            expectedNewUser.Password.Should().Be(NewHashedPassword);

            var expectedCollaboratorData = _knowledgeCenterContextMock.Collaborators.Single(x => x.Id == newCollaborator.Id);
            expectedCollaboratorData.GGID.Should().Be(NewCollaboratorGgid);
        }

        [Fact]
        public void CreateCollaborator_ShouldThrow_COLLABORATOR_ALREADYEXISTS_EMAIL_WhenUserWithSameEmailAlreadyExists()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.CreateCollaborator(new CreateOrUpdateCollaborator
                {
                    GGID = NewCollaboratorGgid,
                    Email = "jdoe@capgemini.com",
                    Firstname = "john",
                    Lastname = "Doe",
                    AgencyId = 1,
                    ServiceLineId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .Where(x => x.EndUserMessage == "A collaborator with the same email already exists: John Doe")
                .And.ErrorCode.Should().Be(ErrorCode.COLLABORATOR_ALREADYEXISTS_EMAIL);
        }

        [Fact]
        public void CreateCollaborator_ShouldThrow_COLLABORATOR_ALREADYEXISTS_GGID_WhenUserWithSameGgidAlreadyExists()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.CreateCollaborator(new CreateOrUpdateCollaborator
                {
                    GGID = 1111,
                    Email = "sheran.ler@capgemini.com",
                    Firstname = "Sherman",
                    Lastname = "Leroy",
                    AgencyId = 1,
                    ServiceLineId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .Where(x => x.EndUserMessage == "A collaborator with the same GGID already exists: John Doe")
                .And.ErrorCode.Should().Be(ErrorCode.COLLABORATOR_ALREADYEXISTS_GGID);
        }

        [Fact]
        public void DeleteCollaborator_ShouldDeleteCollaboratorData_NotUser()
        {
            // Act
            _collaboratorProvider.DeleteCollaborator(CollaboratorUserId);

            // Assert
            _knowledgeCenterContextMock.Collaborators.Count().Should().Be(0);
            _knowledgeCenterContextMock.CollaboratorSkills.Count().Should().Be(0);

            _knowledgeCenterContextMock.Users.Count().Should().Be(2);
        }

        [Fact]
        public void DeleteCollaborator_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenNoCollaboratorFound()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.DeleteCollaborator(SimpleUserId);
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCollaborator_ShouldUpdateCollaborator_WhenAlreadyHaveCollaboratorData()
        {
            // Act
            _collaboratorProvider.UpdateCollaborator(new CreateOrUpdateCollaborator
            {
                Id = CollaboratorUserId,
                GGID = 87654,
                Firstname = "Camille",
                Lastname = "Doe",
                Email = "cdoe@hotmail.fr",
                AgencyId = 1,
                ServiceLineId = 1
            });

            // Assert
            var expectedUpdatedCollaborator = _knowledgeCenterContextMock.Collaborators.Single(x => x.Id == CollaboratorUserId);
            var expectedUpdatedUser = _knowledgeCenterContextMock.Users.Single(x => x.Id == CollaboratorUserId);
            expectedUpdatedCollaborator.GGID.Should().Be(87654);
            expectedUpdatedUser.Firstname.Should().Be("Camille");
            expectedUpdatedUser.Lastname.Should().Be("Doe");
            expectedUpdatedUser.Email.Should().Be("cdoe@hotmail.fr");
            expectedUpdatedUser.Agency.Name.Should().Be("Biot");
            expectedUpdatedUser.ServiceLine.Name.Should().Be("Agile Center");
        }

        [Fact]
        public void UpdateCollaborator_ShouldUpdateCollaborator_WhenDoesNotHaveYetCollaboratorData()
        {
            // Act
            _collaboratorProvider.UpdateCollaborator(new CreateOrUpdateCollaborator
            {
                Id = SimpleUserId,
                GGID = 87654,
                Firstname = "Camille",
                Lastname = "Doe",
                Email = "cdoe@hotmail.fr",
                AgencyId = 1,
                ServiceLineId = 1
            });

            // Assert
            var expectedUpdatedCollaborator = _knowledgeCenterContextMock.Collaborators.Single(x => x.Id == SimpleUserId);
            var expectedUpdatedUser = _knowledgeCenterContextMock.Users.Single(x => x.Id == SimpleUserId);
            expectedUpdatedCollaborator.GGID.Should().Be(87654);
            expectedUpdatedUser.Firstname.Should().Be("Camille");
            expectedUpdatedUser.Lastname.Should().Be("Doe");
            expectedUpdatedUser.Email.Should().Be("cdoe@hotmail.fr");
            expectedUpdatedUser.Agency.Name.Should().Be("Biot");
            expectedUpdatedUser.ServiceLine.Name.Should().Be("Agile Center");
        }

        [Fact]
        public void UpdateCollaborator_ShouldThrow_COLLABORATOR_ALREADYEXISTS_EMAIL_WhenAUserIsAlreadyAsignedToTheGivenEmail()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.UpdateCollaborator(new CreateOrUpdateCollaborator
                {
                    Id = CollaboratorUserId,
                    GGID = 12345678,
                    Firstname = "jdoe",
                    Lastname = "Doe",
                    Email = "steve.foo@capgemini.com",
                    ServiceLineId = 1,
                    AgencyId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.COLLABORATOR_ALREADYEXISTS_EMAIL);
        }
        
        [Fact]
        public void UpdateCollaborator_ShouldThrow_COLLABORATOR_ALREADYEXISTS_GGID_WhenAUserIsAlreadyAsignedToTheGivenGGID()
        {
            // Act
            Action action = () =>
            {
                _collaboratorProvider.UpdateCollaborator(new CreateOrUpdateCollaborator
                {
                    Id = CollaboratorUserId,
                    GGID = 1111,
                    Firstname = "jdoe",
                    Lastname = "Doe",
                    Email = "jdoe.foo@capgemini.com",
                    ServiceLineId = 1,
                    AgencyId = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.COLLABORATOR_ALREADYEXISTS_GGID);
        }

        #endregion

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var collaboratorUser = new User
            {
                Id = CollaboratorUserId,
                Login = "jdoe",
                Firstname = "John",
                Lastname = "Doe",
                Email = "jdoe@capgemini.com",
                ServiceLineId = 1,
                AgencyId = 1
            };

            var collaboratorData = new DataConnector.Entities.Match.Collaborator
            {
                Id = CollaboratorUserId,
                GGID = 1111,
                CollaboratorSkills = new List<DataConnector.Entities.Match.CollaboratorSkill>
                {
                    new DataConnector.Entities.Match.CollaboratorSkill
                    {
                        Id = 1,
                        SkillId = 1,
                        SkillLevelId = 1
                    }
                }
            };

            var simpleUser = new User
            {
                Id = 2,
                Login = "sfoo",
                Firstname = "Steve",
                Lastname = "Foo",
                Email = "steve.foo@capgemini.com",
                ServiceLineId = 2,
                AgencyId = 2
            };

            knowledgeCenterContextMock.Agencies.Add(new DataConnector.Entities.Agency { Id = 1, Name = "Biot", PostalCode = "06410" });
            knowledgeCenterContextMock.Agencies.Add(new DataConnector.Entities.Agency { Id = 2, Name = "Grimaud", PostalCode = "83310" });
            knowledgeCenterContextMock.ServiceLines.Add(new DataConnector.Entities.ServiceLine { Id = 1, Name = "Agile Center", Description = "Agile Center" });
            knowledgeCenterContextMock.ServiceLines.Add(new DataConnector.Entities.ServiceLine { Id = 2, Name = "DTC", Description = "Digital Technology and Cloud" });
            knowledgeCenterContextMock.Users.Add(collaboratorUser);
            knowledgeCenterContextMock.Users.Add(simpleUser);

            knowledgeCenterContextMock.Collaborators.Add(collaboratorData);
            knowledgeCenterContextMock.Skills.Add(new DataConnector.Entities.Match.Skill { Id = 1, Name = "Agile", ServiceLineId = 1 });
            knowledgeCenterContextMock.Skills.Add(new DataConnector.Entities.Match.Skill { Id = 2, Name = "SCRUM", ServiceLineId = 1 });
            knowledgeCenterContextMock.SkillLevels.Add(new DataConnector.Entities.Match.SkillLevel { Id = 1, Name = "Novice" });
            knowledgeCenterContextMock.SkillLevels.Add(new DataConnector.Entities.Match.SkillLevel { Id = 2, Name = "Expert" });

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}