using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.CapLab.Contracts;
using KnowledgeCenter.CapLab.Providers.Tests.Helpers;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.CapLab;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace KnowledgeCenter.CapLab.Providers.Tests
{
    public class ProjectProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly ProjectProvider _projectProvider;
        private readonly Mock<IIdentityProvider> _identityProvider = new Mock<IIdentityProvider>();

        public const int WaitingProjectId = 1;
        public const int ValidatedProjectId = 2;

        public ProjectProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _projectProvider = new ProjectProvider(
                _knowledgeCenterContextMock,
                MapperWithoutMock,
                _identityProvider.Object);

            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.ADMIN }
             });
        }

        [Fact]
        public void GetProject_ShouldReturnProject()
        {
            // Act
            var project = _projectProvider.GetProject(WaitingProjectId);

            // Assert
            project.Title.Should().Be("Project n°1");
            project.LikeCount.Should().Be(2);
            project.LikeAverageRate.Should().Be(3);
            project.Tags.Should().HaveCount(1);
            project.Tags.Single().Code.Should().Be("FUN");
        }

        [Fact]
        public void GetProject_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenProjectDoesNotExist()
        {
            // Act
            Action action = () => { _projectProvider.GetProject(567); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteProject_ShouldDeleteProject_WhenUserIsOwnerOfProject()
        {
            // Act
            _projectProvider.DeleteProject(WaitingProjectId);

            // Assert
            _knowledgeCenterContextMock.Projects.Count().Should().Be(1);
        }

        [Fact]
        public void DeleteProject_ShouldDeleteProject_WhenUserIsNotOwnerOfProjectButIsCapLabAdmin()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.CAPLAB_ADMIN }
             });

            // Act
            _projectProvider.DeleteProject(WaitingProjectId);

            // Assert
            _knowledgeCenterContextMock.Projects.Count().Should().Be(1);
        }

        [Fact]
        public void CreateProject_ShouldCreateNewProject()
        {
            // Act
            var result = _projectProvider.CreateProject(new CreateOrUpdateProject()
            {
                ShortDescription = "Third project short description",
                Image = "base64Image",
                Description = "Third project",
                Title = "Third project title",
                TagIds = new List<int>
                {
                    1,
                    2
                }
            });

            // Assert
            _knowledgeCenterContextMock.Projects.Should().HaveCount(3);
            var expectedCreatedProject = _knowledgeCenterContextMock.Projects
                .First(x => x.Id == 3);
            expectedCreatedProject.Title.Should().Be("Third project title");
            expectedCreatedProject.UserId.Should().Be(1);
            expectedCreatedProject.ProjectStatus.Code.Should().Be(EnumProjectStatus.WAITING);
            expectedCreatedProject.ProjectTags.Should().HaveCount(2);
        }

        [Fact]
        public void UpdateProject_ShouldUpdateProject_WhenSimpleUserIsTryingToUpdateHisOwnProject()
        {
            // Act
            var result = _projectProvider.UpdateProject(new Contracts.CreateOrUpdateProject()
            {
                Id = WaitingProjectId,
                ShortDescription = "project short description",
                Image = "base64Image",
                Description = "Project n°1",
                Title = "Project to improve my development skills title modified",
                TagIds = new List<int>
                {
                    1
                }
            });

            // Assert
            _knowledgeCenterContextMock.Projects.Should().HaveCount(2);
            var expectedUpdatedProject = _knowledgeCenterContextMock.Projects
                .First(x => x.Id == WaitingProjectId);
            expectedUpdatedProject.Title.Should().Be("Project to improve my development skills title modified");
            expectedUpdatedProject.ProjectStatus.Code.Should().Be(EnumProjectStatus.WAITING);
            expectedUpdatedProject.ProjectTags.Should().HaveCount(1);
        }

        [Fact]
        public void UpdateProject_ShouldUpdateProject_WhenCapLablAdminIsTryingToUpdateNotHisOwnProject()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.CAPLAB_ADMIN }
             });

            // Act
            var result = _projectProvider.UpdateProject(new Contracts.CreateOrUpdateProject()
            {
                Id = ValidatedProjectId,
                ShortDescription = "project short description",
                Image = "base64Image",
                Description = "Project to improve my C#",
                Title = "Project n°2 title modified",
                TagIds = new List<int>
                {
                    1,
                    2
                }
            }); ;

            // Assert
            _knowledgeCenterContextMock.Projects.Should().HaveCount(2);
            _knowledgeCenterContextMock.Projects.First(x => x.Id == ValidatedProjectId).Title.Should().Be("Project n°2 title modified");
        }

        [Fact]
        public void UpdateProject_ShouldThrow_UNAUTHORIZED_OPERATION_Exception_WhenConnectedUserIsNotOwnerOfTheProjectAndNotCapLabAdmin()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
             .Returns(new Identity
             {
                 Id = 1,
                 Login = "john.doe",
                 Roles = new List<string> { EnumRoles.USER }
             });

            // Act
            Action action = () => _projectProvider.UpdateProject(new Contracts.CreateOrUpdateProject()
            {
                Id = ValidatedProjectId,
                ShortDescription = "project short description",
                Image = "base64Image",
                Description = "Project to improve my C#",
                Title = "Project n°2 title modified",
                TagIds = new List<int>
                {
                    1,
                    2
                }
            }); ;

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.UNAUTHORIZED_OPERATION);
        }

        [Fact]
        public void UpdateProject_ShouldSetProjectStatusToWaiting_WhenWasRejectedButJustUpdated()
        {
            // Arrange
            var project = _knowledgeCenterContextMock.Projects.Single(x => x.Id == WaitingProjectId);
            project.ProjectStatusId = _knowledgeCenterContextMock.ProjectStatuses.Single(x => x.Code == EnumProjectStatus.REJECTED).Id;
            _knowledgeCenterContextMock.Update(project);
            _knowledgeCenterContextMock.SaveChanges();

            // Act
            var result = _projectProvider.UpdateProject(new Contracts.CreateOrUpdateProject()
            {
                Id = WaitingProjectId,
                Description = "Project n°1",
                Title = "Project to improve my development skills title modified",
                TagIds = new List<int>
                {
                    1
                }
            }); ;

            // Assert
            _knowledgeCenterContextMock.Projects.Single(x => x.Id == WaitingProjectId).ProjectStatus.Code.Should().Be(EnumProjectStatus.WAITING);
        }

        [Fact]
        public void GetProjectStatuses_ShouldReturnProjectStatuses()
        {
            // Act
            var result = _projectProvider.GetProjectStatuses();

            // Assert
            result.Should().HaveCount(5);
        }

        [Fact]
        public void UpdateProjectStatus_ShouldChangeProjectStatus()
        {
            // Act
            _projectProvider.UpdateProjectStatus(ValidatedProjectId, 4);

            // Assert
            _knowledgeCenterContextMock.Projects.Single(x => x.Id == ValidatedProjectId).ProjectStatus.Code.Should().Be(EnumProjectStatus.INPROGRESS);
        }

        [Fact]
        public void UpdateProjectStatus_ShouldChangeProjectStatus_AndSetApprover_WhenProjectHasJustBeenValidated()
        {
            // Act
            _projectProvider.UpdateProjectStatus(WaitingProjectId, 2);

            // Assert
            var project = _knowledgeCenterContextMock.Projects.Single(x => x.Id == WaitingProjectId);
            project.ProjectStatus.Code.Should().Be(EnumProjectStatus.VALIDATED);
            project.ApproverId.Should().Be(1);
        }

        [Fact]
        public void UpdateProjectStatus_ShouldChangeProjectStatus_AndSetApprover_WhenProjectHasJustBeenRejected()
        {
            // Act
            _projectProvider.UpdateProjectStatus(WaitingProjectId, 3);

            // Assert
            var project = _knowledgeCenterContextMock.Projects.Single(x => x.Id == WaitingProjectId);
            project.ProjectStatus.Code.Should().Be(EnumProjectStatus.REJECTED);
            project.ApproverId.Should().Be(1);
        }

        [Fact]
        public void RateProject_ShouldAddLike_WhenUserDidNotAlreadyLikeThisProject()
        {
            // Act
            _projectProvider.RateProject(2, 1);

            // Assert
            _knowledgeCenterContextMock.ProjectLikes.Where(x => x.ProjectId == ValidatedProjectId).Should().HaveCount(1);
            _knowledgeCenterContextMock.ProjectLikes.First(x => x.ProjectId == ValidatedProjectId && x.UserId == 1).Rate.Should().Be(1);
        }

        [Fact]
        public void RateProject_ShouldUpdateRateLike_WhenUserAlreadyLikeThisProject()
        {
            // Act
            _projectProvider.RateProject(1, 5);

            // Assert
            _knowledgeCenterContextMock.ProjectLikes.Where(x => x.ProjectId == WaitingProjectId).Should().HaveCount(2);
            _knowledgeCenterContextMock.ProjectLikes.First(x => x.ProjectId == WaitingProjectId && x.UserId == 1).Rate.Should().Be(5);
        }

        [Fact]
        public void RateProject_ShouldThrow_INVALID_OPERATION_Exception_WhenInvalidRateProvided()
        {
            // Act
            Action action = () => _projectProvider.RateProject(WaitingProjectId, 99);

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.INVALID_ACTION);
        }

        [Fact]
        public void GetProjects_ShouldGetPublicProjects()
        {
            // Arrange
            var filter = new ProjectFilter
            {
                StatusCodes = new List<string> { EnumProjectStatus.VALIDATED }
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
            projects.Data.Single().Title.Should().Be("Project n°2");
        }

        [Fact]
        public void GetProjects_ShouldNotReturnApproverName_WhenUserIsNotProjectOwner()
        {
            // Arrange
            var filter = new ProjectFilter
            {
                StatusCodes = new List<string> { EnumProjectStatus.VALIDATED }
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
            projects.Data.Single().ApproverFullName.Should().BeNullOrEmpty();
        }

        [Fact]
        public void GetProjects_ShouldReturnApproverName_WhenUserIsProjectOwner()
        {
            // Arrange
            _identityProvider.Setup(x => x.GetConnectedUserIdentity())
                 .Returns(new Identity
                 {
                     Id = 2,
                     Login = "bob.doe",
                     Roles = new List<string> { EnumRoles.USER }
                 });
            var filter = new ProjectFilter
            {
                StatusCodes = new List<string> { EnumProjectStatus.VALIDATED }
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
            projects.Data.Single().ApproverFullName.Should().Be("Bob Doe");
        }

        [Fact]
        public void GetProjects_ShouldGetMyProjects()
        {
            // Arrange
            var filter = new ProjectFilter
            {
                IsOnlyMine = true
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
            projects.Data.Single().Title.Should().Be("Project n°1");
        }

        [Fact]
        public void GetProjects_ShouldGetProjectsToBeValidated()
        {
            // Arrange
            var filter = new ProjectFilter
            {
                StatusCodes = new List<string> { EnumProjectStatus.WAITING }
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
        }

        [Fact]
        public void GetProjects_ShouldGetMyProjectsToBeValidated()
        {
            // Arrange
            var filter = new ProjectFilter
            {
                StatusCodes = new List<string> { EnumProjectStatus.WAITING },
                IsOnlyMine = true
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
        }

        [Theory]
        [InlineData("c#", 2)]
        [InlineData("ProjECT n°1", 1)]
        [InlineData("improve my devELOpment skills", 1)]
        [InlineData("#UseFuL", 2)]
        public void GetProjects_ShouldGetProjectsFilteredByKeyword(string keyword, int expectedProjectId)
        {
            // Arrange
            var filter = new ProjectFilter
            {
                IsOnlyMine = false,
                Keyword = keyword
            };

            // Act
            var projects = _projectProvider.GetProjects(new Common.BasePaginationRequest<ProjectFilter>(filter));

            // Assert
            projects.TotalItems.Should().Be(1);
            projects.Data.First().Id.Should().Be(expectedProjectId);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var agencies = GetAgencies();
            var serviceLines = GetServiceLines();
            var users = GetUsers();

            var projects = GetProjects();
            var projectTags = GetProjectTags();
            var tags = GetTags();
            var projectStatuses = GetProjectStatuses();
            var projectLikes = GetProjectLikes();

            knowledgeCenterContextMock.Users.AddRange(users);
            knowledgeCenterContextMock.Agencies.AddRange(agencies);
            knowledgeCenterContextMock.ServiceLines.AddRange(serviceLines);

            knowledgeCenterContextMock.Projects.AddRange(projects);
            knowledgeCenterContextMock.Tags.AddRange(tags);
            knowledgeCenterContextMock.ProjectTags.AddRange(projectTags);
            knowledgeCenterContextMock.ProjectStatuses.AddRange(projectStatuses);
            knowledgeCenterContextMock.ProjectLikes.AddRange(projectLikes);

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

        private IList<DataConnector.Entities.CapLab.Project> GetProjects()
        {
            return Builder<DataConnector.Entities.CapLab.Project>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, WaitingProjectId)
                .And(x => x.Title, "Project n°1")
                .And(x => x.ShortDescription, "improve my development skills")
                .And(x => x.Image, "base64image")
                .And(x => x.Description, "Project to improve my development skills")
                .And(x => x.UserId, 1)
                .And(x => x.ProjectStatusId, 1)
                .And(x => x.LikeCount, 2)
                .And(x => x.LikeAverage, 3)
                .TheNext(1)
                .With(x => x.Id, ValidatedProjectId)
                .And(x => x.Title, "Project n°2")
                .And(x => x.ShortDescription, "improve my development")
                .And(x => x.Image, "base64image")
                .And(x => x.Description, "Project to improve my C#")
                .And(x => x.UserId, 2)
                .And(x => x.ProjectStatusId, 2)
                .And(x => x.LikeCount, 0)
                .And(x => x.LikeAverage, 0)
                .And(x => x.ApproverId, 2)
                .Build();
        }

        private IList<DataConnector.Entities.CapLab.ProjectTag> GetProjectTags()
        {
            return Builder<DataConnector.Entities.CapLab.ProjectTag>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.ProjectId, 1)
                .And(x => x.TagId, 1)
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.ProjectId, 2)
                .And(x => x.TagId, 2)
                .Build();
        }

        private IList<DataConnector.Entities.CapLab.Tag> GetTags()
        {
            return Builder<DataConnector.Entities.CapLab.Tag>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Code, "FUN")
                .And(x => x.Description, "#Fun")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Code, "USEFUL")
                .And(x => x.Description, "#Useful")
                .Build();
        }

        private IList<DataConnector.Entities.CapLab.ProjectStatus> GetProjectStatuses()
        {
            return Builder<DataConnector.Entities.CapLab.ProjectStatus>.CreateListOfSize(5)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Code, EnumProjectStatus.WAITING)
                .And(x => x.Description, "project waiting validation")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Code, EnumProjectStatus.VALIDATED)
                .And(x => x.Description, "project validated")
                .TheNext(1)
                .With(x => x.Id, 3)
                .And(x => x.Code, EnumProjectStatus.REJECTED)
                .And(x => x.Description, "project rejecteds")
                .TheNext(1)
                .With(x => x.Id, 4)
                .And(x => x.Code, EnumProjectStatus.INPROGRESS)
                .And(x => x.Description, "In progress")
                .TheNext(1)
                .With(x => x.Id, 5)
                .And(x => x.Code, EnumProjectStatus.FINISHED)
                .And(x => x.Description, "Finished")
                .Build();
        }

        private IList<DataConnector.Entities.CapLab.ProjectLike> GetProjectLikes()
        {
            return Builder<DataConnector.Entities.CapLab.ProjectLike>.CreateListOfSize(2)
                .All()
                .And(x => x.ProjectId, 1)
                .And(x => x.DateCreation, DateTime.Now)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.UserId, 1)
                .And(x => x.Rate, 4)
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.UserId, 2)
                .And(x => x.Rate, 2)
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}