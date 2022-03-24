using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using KnowledgeCenter.DataConnector.Entities.CapLab;
using KnowledgeCenter.DataConnector.Entities.Flux;

namespace KnowledgeCenter.Common.Providers
{
    public class ConfigurationProvider : IConfigurationProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly string Environment;

        public ConfigurationProvider(KnowledgeCenterContext knowledgeCenterContext)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            Environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        }

        public Contracts.Configurations GetConfigurations()
        {
            return new Contracts.Configurations
            {
                Date = DateTime.UtcNow,
                Environment = Environment,
                Version = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion
            };
        }

        public Contracts.LastTokens GetLastTokensForE2eTestingPurpose()
        {
            if (Environment != EnvironmentEnum.E2e.ToString()) // ABSOLUTELY BLOCK THIS OPERATION ON ANOTHER ENVIRONMENT THAN E2E !!!!
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            return new Contracts.LastTokens
            {
                ActivationToken = _knowledgeCenterContext.Users.FirstOrDefault(x => x.ActivationToken != null)?.ActivationToken,
                RecoverPasswordToken = _knowledgeCenterContext.Users.FirstOrDefault(x => x.RecoverPasswordToken != null)?.RecoverPasswordToken
            };
        }

        public bool InitializeE2ETestingData()
        {
            if (Environment != EnvironmentEnum.E2e.ToString()) // ABSOLUTELY BLOCK THIS OPERATION ON ANOTHER ENVIRONMENT THAN E2E !!!!
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            CleanDb();

            _knowledgeCenterContext.Roles.AddRange(Serie.Roles);
            _knowledgeCenterContext.Agencies.AddRange(Serie.Agencies);
            _knowledgeCenterContext.ServiceLines.AddRange(Serie.ServiceLines);
            _knowledgeCenterContext.Users.AddRange(Serie.Users);

            _knowledgeCenterContext.Tags.AddRange(Serie.Tags);
            _knowledgeCenterContext.ProjectStatuses.AddRange(Serie.ProjectStatuses);
            _knowledgeCenterContext.Projects.AddRange(Serie.Projects);
            _knowledgeCenterContext.ProjectTags.AddRange(Serie.ProjectTags);
            _knowledgeCenterContext.ProjectLikes.AddRange(Serie.ProjectLikes);

            _knowledgeCenterContext.FluxPublications.AddRange(Serie.FluxPublications);
            _knowledgeCenterContext.FluxLikes.AddRange(Serie.FluxLikes);

            _knowledgeCenterContext.SaveChanges();

            return true;
        }

        private void CleanDb()
        {
            _knowledgeCenterContext.Roles.RemoveRange(_knowledgeCenterContext.Roles.ToList());
            _knowledgeCenterContext.Agencies.RemoveRange(_knowledgeCenterContext.Agencies.ToList());
            _knowledgeCenterContext.ServiceLines.RemoveRange(_knowledgeCenterContext.ServiceLines.ToList());
            _knowledgeCenterContext.Users.RemoveRange(_knowledgeCenterContext.Users.ToList());
            _knowledgeCenterContext.UserRoles.RemoveRange(_knowledgeCenterContext.UserRoles.ToList());

            _knowledgeCenterContext.Tags.RemoveRange(_knowledgeCenterContext.Tags.ToList());
            _knowledgeCenterContext.ProjectStatuses.RemoveRange(_knowledgeCenterContext.ProjectStatuses.ToList());
            _knowledgeCenterContext.Projects.RemoveRange(_knowledgeCenterContext.Projects.ToList());
            _knowledgeCenterContext.ProjectTags.RemoveRange(_knowledgeCenterContext.ProjectTags.ToList());
            _knowledgeCenterContext.ProjectLikes.RemoveRange(_knowledgeCenterContext.ProjectLikes.ToList());

            _knowledgeCenterContext.FluxPublications.RemoveRange(_knowledgeCenterContext.FluxPublications.ToList());
            _knowledgeCenterContext.FluxLikes.RemoveRange(_knowledgeCenterContext.FluxLikes.ToList());
        }

        private readonly Serie Serie = new Serie
        {
            Id = 1,
            Name = "Nominal",
            Roles = new List<Role>
            {
                new Role { Id = 1, Code = "ADMIN", Description = "Administrator" }
            },
            Agencies = new List<Agency>
            {
                new Agency { Id = 1, Name = "Biot", PostalCode = "06410" }
            },
            ServiceLines = new List<ServiceLine>
            {
                new ServiceLine { Id = 1, Name = "DTC", Description = "DTC" }
            },
            Users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Firstname = "admin",
                    Lastname = "admin",
                    Email = "admin@capgemini.com",
                    Login = "admin",
                    IsActive = true,
                    Password = "v5RG0lUZyOKtcmkjAj/bTMUv7e7XphbjjHSd3vttkrc=",
                    Salt = "5VScZv2jAGOVaTE92MAGZw==",
                    PasswordTryCount = 0,
                    AgencyId = 1,
                    ServiceLineId = 1,
                    UserRoles = new List<UserRoles> { new UserRoles { RoleId = 1, UserId = 1 } },
                    LastConnection = new DateTime(2019, 1, 1),
                    ModificationDate = new DateTime(2019, 1, 1),
                    CreationDate = new DateTime(2019, 1, 1),
                }
            },
            Tags = new List<Tag>
            {
                new Tag
                {
                    Id = 1,
                    Code = "FUN",
                    Description = "#Fun"
                }
            },
            ProjectStatuses = new List<ProjectStatus>
            {
                new ProjectStatus
                {
                    Id = 1,
                    Code = "VALIDATED",
                    Description = "Approved"
                },
                new ProjectStatus
                {
                    Id = 2,
                    Code = "WAITING",
                    Description = "Waiting for approval"
                }
            },
            Projects = new List<Project>
            {
                new Project
                {
                    Id = 1,
                    CreationDate = new DateTime(2019, 1, 1),
                    ModificationDate = new DateTime(2019, 1, 1),
                    Title = "My wonderful project!",
                    ShortDescription = "bla bla",
                    Description = "bla bla bla bla bla bla",
                    LikeAverage = 3,
                    LikeCount = 1,
                    ProjectStatusId = 1,
                    UserId = 1
                }
            },
            ProjectTags = new List<ProjectTag>
            {
                new ProjectTag
                {
                    Id = 1,
                    ProjectId = 1,
                    TagId = 1
                }
            },
            ProjectLikes = new List<ProjectLike>
            {
                new ProjectLike
                {
                    Id = 1,
                    DateCreation = new DateTime(2019, 1, 2),
                    ProjectId = 1,
                    Rate = 3,
                    UserId = 1
                }
            },
            FluxPublications = new List<Publication>
            {
                new Publication
                {
                    Id = 1,
                    CreationDate = new DateTime(2019, 2, 1),
                    ModificationDate = new DateTime(2019, 2, 1),
                    UserId = 1,
                    CategoryCode = "GREEN",
                    IsAnonymous = false,
                    Message = "Ecology = Economy ?"
                }
            },
            FluxLikes = new List<Like>
            {
                new Like
                {
                    Id = 1,
                    UserId = 1,
                    PublicationId = 1,
                    CreationDate = new DateTime(2019, 3, 1),
                    LikeCode = "heart"
                }
            }
        };
    }

    public class Serie
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Role> Roles { get; set; }
        public List<Agency> Agencies { get; set; }
        public List<ServiceLine> ServiceLines { get; set; }
        public List<User> Users { get; set; }

        public List<Project> Projects { get; set; }
        public List<ProjectLike> ProjectLikes { get; set; }
        public List<ProjectStatus> ProjectStatuses { get; set; }
        public List<ProjectTag> ProjectTags { get; set; }
        public List<Tag> Tags { get; set; }

        public List<Publication> FluxPublications { get; set; }
        public List<Like> FluxLikes { get; set; }
    }
}
