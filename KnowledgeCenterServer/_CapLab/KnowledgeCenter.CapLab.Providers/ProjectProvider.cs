using AutoMapper;
using KnowledgeCenter.CapLab.Contracts;
using KnowledgeCenter.CapLab.Providers._Interfaces;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.CapLab;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Entities = KnowledgeCenter.DataConnector.Entities.CapLab;

namespace KnowledgeCenter.CapLab.Providers
{
    public class ProjectProvider : IProjectProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;
        private readonly IIdentityProvider _identityProvider;

        public ProjectProvider(KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper,
            IIdentityProvider identityProvider)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
            _identityProvider = identityProvider;
        }

        public Contracts.Project GetProject(int id)
        {
            var connectedUserId = _identityProvider.GetConnectedUserIdentity().Id;
            return _mapper.Map<Contracts.Project>(GetProjectEntity(id), opt => opt.Items["CurrentUserId"] = connectedUserId);
        }

        public void DeleteProject(int id)
        {
            var project = GetProjectEntity(id);
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            if (connectedUser.Id != project.UserId && !connectedUser.HasRole(EnumRoles.CAPLAB_ADMIN))
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            _knowledgeCenterContext.Projects.Remove(project);
            _knowledgeCenterContext.SaveChanges();
        }

        public Contracts.Project CreateProject(CreateOrUpdateProject projectFacade)
        {
            var connectedUserId = _identityProvider.GetConnectedUserIdentity().Id;
            var waitingStatus = _knowledgeCenterContext.ProjectStatuses.Single(x => x.Code == EnumProjectStatus.WAITING);
            var now = DateTime.Now;
            var project = new Entities.Project
            {
                Title = projectFacade.Title,
                ShortDescription = projectFacade.ShortDescription,
                Description = projectFacade.Description,
                Image = projectFacade.Image,
                CreationDate = now,
                ModificationDate = now,
                ProjectTags = projectFacade.TagIds?.Select(x => new Entities.ProjectTag
                {
                    TagId = x
                }).ToList(),
                UserId = connectedUserId,
                ProjectStatusId = waitingStatus.Id,
                LikeAverage = 0,
                LikeCount = 0
            };

            _knowledgeCenterContext.Projects.Add(project);
            _knowledgeCenterContext.SaveChanges();

            return GetProject(project.Id);
        }

        public Contracts.Project UpdateProject(CreateOrUpdateProject projectFacade)
        {
            var project = GetProjectEntity(projectFacade.Id);
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            if (connectedUser.Id != project.UserId && !connectedUser.HasRole(EnumRoles.CAPLAB_ADMIN))
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            project.ModificationDate = DateTime.Now;
            project.Title = projectFacade.Title;
            project.ShortDescription = projectFacade.ShortDescription;
            project.Description = projectFacade.Description;
            project.Image = projectFacade.Image;
            project.ProjectTags = projectFacade.TagIds.Select(x => new Entities.ProjectTag
            {
                TagId = x
            }).ToList();

            if (_knowledgeCenterContext.Projects.Any(x => x.Id == projectFacade.Id && x.ProjectStatus.Code == EnumProjectStatus.REJECTED))
            {
                var waitingStatus = _knowledgeCenterContext.ProjectStatuses.Single(x => x.Code == EnumProjectStatus.WAITING);
                project.ProjectStatusId = waitingStatus.Id;
            }

            _knowledgeCenterContext.Projects.Update(project);
            _knowledgeCenterContext.SaveChanges();

            return GetProject(project.Id);
        }

        public List<Contracts.ProjectStatus> GetProjectStatuses()
        {
            return _mapper.Map<List<Contracts.ProjectStatus>>(_knowledgeCenterContext.ProjectStatuses.ToList());
        }

        public void UpdateProjectStatus(int projectId, int projectStatus)
        {
            var project = GetProjectEntity(projectId);
            if (project.ProjectStatusId != projectStatus
                && project.ProjectStatus.Code == EnumProjectStatus.WAITING)
            {
                project.ApproverId = _identityProvider.GetConnectedUserIdentity().Id;
            }
            project.ProjectStatusId = projectStatus;
            _knowledgeCenterContext.SaveChanges();
        }

        public void RateProject(int id, int rate)
        {
            if (rate < 0 || rate > 5)
            {
                throw new HandledException(ErrorCode.INVALID_ACTION);
            }
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            var projectUserLike = _knowledgeCenterContext.ProjectLikes
                .SingleOrDefault(x => x.UserId == connectedUser.Id && x.ProjectId == id);

            if (projectUserLike == null)
            {
                var projectLike = new Entities.ProjectLike
                {
                    ProjectId = id,
                    UserId = connectedUser.Id,
                    DateCreation = DateTime.Now,
                    Rate = rate
                };
                _knowledgeCenterContext.ProjectLikes.Add(projectLike);
            }
            else
            {
                projectUserLike.Rate = rate;
                _knowledgeCenterContext.Update(projectUserLike);
            }

            _knowledgeCenterContext.SaveChanges();
        }

        public BasePaginationResponse<List<Contracts.Project>> GetProjects(BasePaginationRequest<ProjectFilter> query)
        {
            var projectsQuery = _knowledgeCenterContext.Projects
                .Include(x => x.User)
                .Include(x => x.ProjectStatus)
                .Include(x => x.ProjectTags)
                .ThenInclude(x => x.Tag)
                .Include(x => x.ProjectLikes)
                .Include(x => x.Approver)
                .AsQueryable();


            var connectedUserId = _identityProvider.GetConnectedUserIdentity().Id;
            if (query.Filters != null)
            {
                if (query.Filters.IsOnlyMine)
                {
                    projectsQuery = projectsQuery.Where(x => x.UserId == connectedUserId);
                }
                if (query.Filters.StatusCodes.Any())
                {
                    projectsQuery = projectsQuery.Where(x => query.Filters.StatusCodes.Contains(x.ProjectStatus.Code));
                }
                if (!string.IsNullOrEmpty(query.Filters.Keyword))
                {
                    var keyword = query.Filters.Keyword.ToLower();
                    projectsQuery = projectsQuery.Where(x => x.Description.ToLower().Contains(keyword)
                        || x.ShortDescription.ToLower().Contains(keyword)
                        || x.Title.ToLower().Contains(keyword)
                        || x.ProjectStatus.Description.ToLower().Contains(keyword)
                        || x.User.Firstname.ToLower().Contains(keyword)
                        || x.User.Lastname.ToLower().Contains(keyword)
                        || x.ProjectTags.Any(y => y.Tag.Description.ToLower().Contains(keyword)));
                }

                if (query.Filters.OrderByDescendingCreationDate)
                {
                    projectsQuery = projectsQuery
                        .OrderByDescending(x => x.CreationDate);
                }
                else
                {
                    projectsQuery = projectsQuery
                        .OrderByDescending(x => x.LikeAverage)
                        .ThenByDescending(x => x.LikeCount)
                        .ThenByDescending(x => x.CreationDate);
                }
            }

            var totalItems = projectsQuery.Count();
            var projects = projectsQuery
                .Skip(query.Size * (query.Page - 1))
                .Take(query.Size)
                .ToList();

            return new BasePaginationResponse<List<Contracts.Project>>(_mapper.Map<List<Contracts.Project>>(projects, opt => opt.Items["CurrentUserId"] = connectedUserId), query, totalItems);
        }

        private Entities.Project GetProjectEntity(int id)
        {
            if (!_knowledgeCenterContext.Projects.Any(x => x.Id == id))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.Projects
                .Include(x => x.User)
                .Include(x => x.ProjectTags)
                    .ThenInclude(x => x.Tag)
                .Include(x => x.ProjectStatus)
                .Include(x => x.ProjectLikes)
                .Include(x => x.Approver)
                .Single(x => x.Id == id);
        }
    }
}
