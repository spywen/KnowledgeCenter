using System;
using System.Linq;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.Match;
using Xunit;
using _BaseTests = KnowledgeCenter.Match.Providers.Tests.Helpers._BaseTests;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class SkillLevelProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly SkillLevelProvider _skillLevelProvider;

        public SkillLevelProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _skillLevelProvider = new SkillLevelProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void CreateSkillLevel_ShouldSuccessfullyCreateANewSkillLevel_WhenItDoesNotAlreadyExists()
        {
            // Act
            var createdSkillLevel = _skillLevelProvider.CreateSkillLevel(new Contracts.SkillLevel
            {
                Name = "Intermediate",
                Order = 3
            });

            // Assert
            var skillLevelsCount = _knowledgeCenterContextMock.SkillLevels.Count();
            skillLevelsCount.Should().Be(3);
            createdSkillLevel.Should().BeEquivalentTo(new SkillLevel
            {
                Id = 3,
                Name = "Intermediate",
                Order = 3
            });
        }

        [Fact]
        public void
            CreateSkillLevel_ShouldThrow_SKILLLEVEL_ALREADYEXISTS_Exception_WhenASkillLevelWithTheSameNameAlreadyExists()
        {
            // Act
            Action action = () =>
            {
                _skillLevelProvider.CreateSkillLevel(new Contracts.SkillLevel
                {
                    Name = "Novice",
                    Order = 1
                });
            };

            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SKILLLEVEL_ALREADYEXISTS);
        }

        [Fact]
        public void DeleteSkillLevel_ShouldDeleteTheSkillLevelCorrespondingToTheGivenId()
        {
            // Act
            _skillLevelProvider.DeleteSkillLevel(1);

            // Assert
            _knowledgeCenterContextMock.SkillLevels.Count().Should().Be(1);
        }

        [Fact]
        public void DeleteSkillLevel_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongSkillLevelIdIsGiven()
        {
            // Act
            Action action = () => { _skillLevelProvider.DeleteSkillLevel(3); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateSkillLevel_ShouldCorrectlyModifyTheSkillLevel()
        {
            // Act
            var skillLevel = _skillLevelProvider.UpdateSkillLevel(1, new Contracts.SkillLevel
            {
                Name = "Intermediate",
                Order = 2
            }); // Modified the name from "Novice" to "Intermediate"

            // Assert
            skillLevel.Name.Should().Be("Intermediate");
            skillLevel.Order.Should().Be(2);
        }

        [Fact]
        public void UpdateSkillLevel_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongSkillLevelIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _skillLevelProvider.UpdateSkillLevel(3, new Contracts.SkillLevel
                {
                    Name = "Intermediate",
                    Order = 1
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateSkillLevel_ShouldThrow_SKILLLEVEL_ALREADYEXISTS_Exception_WhenASkillLevelAlreadyExistsForTheGivenName()
        {
            // Act
            Action action = () =>
            {
                _skillLevelProvider.UpdateSkillLevel(1, new Contracts.SkillLevel
                {
                    Name = "Expert",
                    Order = 3
                });
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.SKILLLEVEL_ALREADYEXISTS);
        }

        [Fact]
        public void GetAllSkillsLevels_ShouldReturnAllAvailableSkillLevels_OrderedBySkillLevel()
        {
            // Act
            var skillLevelsResult = _skillLevelProvider.GetAllSkillLevels();

            // Assert
            skillLevelsResult.Count.Should().Be(2);
            skillLevelsResult[0].Should().BeEquivalentTo(new SkillLevel
            {
                Id = 2,
                Name = "Novice",
                Order = 1
            });
            skillLevelsResult[1].Should().BeEquivalentTo(new SkillLevel
            {
                Id = 1,
                Name = "Expert",
                Order = 3
            });
        }

        [Fact]
        public void GetSkillLevel_ShouldReturnTheCorrectSkillLevelForAGivenId()
        {
            // Act
            var skillLevelResult = _skillLevelProvider.GetSkillLevel(2);

            // Assert
            skillLevelResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new SkillLevel
                {
                    Id = 2,
                    Name = "Novice",
                    Order = 1
                });
        }

        [Fact]
        public void GetSkillLevel_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongSkillLevelIdIsGiven()
        {
            // Act
            Action action = () => { _skillLevelProvider.GetSkillLevel(112); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();


            var expert = new SkillLevel
            {
                Id = 1,
                Name = "Expert",
                Order = 3
            };
            var novice = new SkillLevel
            {
                Id = 2,
                Name = "Novice",
                Order = 1
            };

            knowledgeCenterContextMock.SkillLevels.Add(expert);
            knowledgeCenterContextMock.SkillLevels.Add(novice);

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}