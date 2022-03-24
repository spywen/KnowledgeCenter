using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using User = KnowledgeCenter.DataConnector.Entities.User;

namespace KnowledgeCenter.Match.Providers
{
    public class CollaboratorProvider : ICollaboratorProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IPasswordProvider _passwordProvider;
        private readonly IMapper _mapper;

        public CollaboratorProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IPasswordProvider passwordProvider,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _passwordProvider = passwordProvider;
            _mapper = mapper;
        }

        #region Get

        public BasePaginationResponse<List<Collaborator>> GetFilteredCollaborators(BasePaginationRequest<CollaboratorFilter> query)
        {
            var filters = query.Filters;
            List<User> users;
            List<DataConnector.Entities.Match.Collaborator> collaborators;
            int totalItems;

            if (filters != null && !string.IsNullOrEmpty(filters.Keyword) && int.TryParse(filters.Keyword, out int ggid))
            {
                var collaboratorQuery = _knowledgeCenterContext.Collaborators
                    .Where(x => Convert.ToString(x.GGID).Contains(filters.Keyword));

                totalItems = collaboratorQuery.Count();
                collaborators = collaboratorQuery
                    .Skip(query.Size * (query.Page - 1))
                    .Take(query.Size)
                    .ToList();

                var collaboratorIds = collaborators.Select(x => x.Id).ToList();
                users = _knowledgeCenterContext.Users
                    .Include(x => x.Agency)
                    .Include(x => x.ServiceLine)
                    .Where(x => collaboratorIds.Contains(x.Id)
                                && (filters.RoleId == 0 || x.UserRoles.Any(role => role.RoleId == filters.RoleId))
                                && (filters.RoleCode == "" || x.UserRoles.Any(role => role.Role.Code == filters.RoleCode))
                                && (filters.AgencyId == 0 || x.AgencyId == filters.AgencyId)
                                && (filters.ServiceLineId == 0 || x.ServiceLineId == filters.ServiceLineId))
                    .ToList();
            }
            else
            {
                var userQuery = _knowledgeCenterContext.Users
                    .Include(x => x.Agency)
                    .Include(x => x.ServiceLine)
                    .Where(x => filters == null
                                || (
                                    (filters.Keyword == null ||
                                     (x.Firstname.ToLower().Contains(filters.Keyword.ToLower()) ||
                                      x.Lastname.ToLower().Contains(filters.Keyword.ToLower()) ||
                                      x.Email.ToLower().Contains(filters.Keyword.ToLower())))
                                    && (filters.RoleId == 0 || x.UserRoles.Any(role => role.RoleId == filters.RoleId))
                                    && (filters.RoleCode == "" || x.UserRoles.Any(role => role.Role.Code == filters.RoleCode))
                                    && (filters.AgencyId == 0 || x.AgencyId == filters.AgencyId)
                                    && (filters.ServiceLineId == 0 || x.ServiceLineId == filters.ServiceLineId)
                                ));

                totalItems = userQuery.Count();
                var a = userQuery.ToList();
                users = userQuery
                    .Skip(query.Size * (query.Page - 1))
                    .Take(query.Size)
                    .ToList();

                var userIds = users.Select(y => y.Id).ToList();
                collaborators = _knowledgeCenterContext.Collaborators
                    .Where(x => userIds.Contains(x.Id))
                    .ToList();
            }

            return new BasePaginationResponse<List<Collaborator>>(_mapper.Map<List<Collaborator>>(users, opt => opt.Items[_MappingsParameters.Collaborators] = collaborators), query, totalItems);
        }

        public Collaborator GetCollaborator(int collaboratorId)
        {
            if (!_knowledgeCenterContext.Users.Any(x => x.Id == collaboratorId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            var user = _knowledgeCenterContext.Users
                .Include(x => x.Agency)
                .Include(x => x.ServiceLine)
                .Single(x => x.Id == collaboratorId);

            var collaboratorFound = _knowledgeCenterContext.Collaborators
                .Include(x => x.CollaboratorSkills)
                .ThenInclude(x => x.Skill)
                .ThenInclude(x => x.ServiceLine)
                .Include(x => x.CollaboratorSkills)
                .ThenInclude(x => x.SkillLevel)
                .SingleOrDefault(x => x.Id == collaboratorId);

            return _mapper.Map<Collaborator>(user, opt => opt.Items[_MappingsParameters.Collaborators] = collaboratorFound);
        }

        #endregion

        #region Skills

        public List<CollaboratorSkill> UpdateCollaboratorSkills(int collaboratorId, List<CollaboratorSkill> newSkills)
        {
            var collaborator = _knowledgeCenterContext.Collaborators
                .Include(x => x.CollaboratorSkills)
                .SingleOrDefault(x => x.Id == collaboratorId);

            if (collaborator == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (newSkills.GroupBy(x => x.SkillId)
                .Select(x => new {Value = x.Key, Count = x.Count()})
                .Any(x => x.Count > 1))
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            var oldSkills = collaborator.CollaboratorSkills.ToList();
            var skillsToDelete = oldSkills.Where(x => !newSkills.Select(w => w.SkillId).Contains(x.SkillId)).ToList();
            var skillsToAdd = newSkills.Where(x => !oldSkills.Select(w => w.SkillId).Contains(x.SkillId)).ToList();
            var skillsToModify = newSkills.Where(x => oldSkills.Any(y => x.SkillId == y.SkillId)).ToList();

            // Add skills
            skillsToAdd.ForEach(x =>
            {
                collaborator.CollaboratorSkills.Add(new DataConnector.Entities.Match.CollaboratorSkill
                {
                    SkillId = x.SkillId,
                    SkillLevelId = x.SkillLevelId
                });
            });

            // Delete skills
            skillsToDelete.ForEach(x =>
            {
                var currentSkill = collaborator.CollaboratorSkills.First(y => y.SkillId == x.SkillId);
                collaborator.CollaboratorSkills.Remove(currentSkill);
            });

            // Update skills
            skillsToModify.ForEach(x => { collaborator.CollaboratorSkills.First(y => y.SkillId == x.SkillId).SkillLevelId = x.SkillLevelId; });

            _knowledgeCenterContext.SaveChanges();
            return GetCollaboratorSkills(collaboratorId);
        }

        public CollaboratorSkill AddCollaboratorSkill(int collaboratorId, CollaboratorSkill skillToAdd)
        {
            var collaborator = _knowledgeCenterContext.Collaborators
                .Include(x => x.CollaboratorSkills)
                .SingleOrDefault(x => x.Id == collaboratorId);

            if (collaborator == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (collaborator.CollaboratorSkills.Any(x => x.SkillId == skillToAdd.SkillId))
            {
                throw new HandledException(ErrorCode.COLLABORATOR_ALREADY_HAS_SKILL);
            }

            collaborator.CollaboratorSkills.Add(new DataConnector.Entities.Match.CollaboratorSkill
            {
                SkillId = skillToAdd.SkillId,
                SkillLevelId = skillToAdd.SkillLevelId
            });

            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<CollaboratorSkill>(
                _knowledgeCenterContext.CollaboratorSkills
                    .Include(x => x.Skill)
                    .ThenInclude(x => x.ServiceLine)
                    .Include(x => x.SkillLevel)
                    .Single(x => x.CollaboratorId == collaboratorId && x.SkillId == skillToAdd.SkillId)
            );
        }

        public void DeleteCollaboratorSkill(int collaboratorId, int skillToDeleteId)
        {
            var collaborator = _knowledgeCenterContext.Collaborators
                .Include(x => x.CollaboratorSkills)
                .SingleOrDefault(x => x.Id == collaboratorId);

            if (collaborator == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            var skillToDelete = collaborator.CollaboratorSkills.First(x => x.SkillId == skillToDeleteId);
            _knowledgeCenterContext.Remove(skillToDelete);
            _knowledgeCenterContext.SaveChanges();
        }

        public CollaboratorSkill UpdateCollaboratorSkillLevel(int collaboratorId, int skillToModifyId, CollaboratorSkill skillToModify)
        {
            var collaborator = _knowledgeCenterContext.Collaborators
                .Include(x => x.CollaboratorSkills)
                .SingleOrDefault(x => x.Id == collaboratorId);

            if (collaborator == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            collaborator.CollaboratorSkills.First(x => x.SkillId == skillToModifyId).SkillLevelId = skillToModify.SkillLevelId;

            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<CollaboratorSkill>(
                _knowledgeCenterContext.CollaboratorSkills
                    .Include(x => x.Skill)
                    .ThenInclude(x => x.ServiceLine)
                    .Include(x => x.SkillLevel)
                    .Single(x => x.CollaboratorId == collaboratorId && x.SkillId == skillToModify.SkillId)
            );
        }

        public List<CollaboratorSkill> GetCollaboratorSkills(int collaboratorId)
        {
            if (!_knowledgeCenterContext.Users.Any(x => x.Id == collaboratorId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            return _knowledgeCenterContext.CollaboratorSkills
                .Where(x => x.CollaboratorId == collaboratorId)
                .Include(x => x.Skill)
                .ThenInclude(x => x.ServiceLine)
                .Include(x => x.SkillLevel)
                .Include(x => x.Collaborator)
                .Select(x => _mapper.Map<CollaboratorSkill>(x))
                .ToList();
        }

        #endregion

        #region CRUD

        public Collaborator CreateCollaborator(CreateOrUpdateCollaborator collaboratorFacade)
        {
            var relativeUser = _knowledgeCenterContext.Users
                .SingleOrDefault(x => string.Equals(x.Email.ToLower(), collaboratorFacade.Email.ToLower(), StringComparison.CurrentCultureIgnoreCase));

            if (relativeUser != null)
            {
                throw new HandledException(ErrorCode.COLLABORATOR_ALREADYEXISTS_EMAIL, new string[] {$"{relativeUser.Firstname} {relativeUser.Lastname}"});
            }

            var collaboratorWithSameGgid = _knowledgeCenterContext.Collaborators
                .SingleOrDefault(x => x.GGID == collaboratorFacade.GGID);

            if (collaboratorWithSameGgid != null)
            {
                var user = _knowledgeCenterContext.Users
                    .SingleOrDefault(x => x.Id == collaboratorWithSameGgid.Id);

                throw new HandledException(ErrorCode.COLLABORATOR_ALREADYEXISTS_GGID, new string[] {$"{user.Firstname} {user.Lastname}"});
            }

            var password = _passwordProvider.GenerateNewSaltedPassword(collaboratorFacade.GGID.ToString());
            var now = DateTime.Now;
            var userCreated = _knowledgeCenterContext.Users.Add(new User
            {
                Firstname = collaboratorFacade.Firstname,
                Lastname = collaboratorFacade.Lastname,
                Email = collaboratorFacade.Email,
                Login = collaboratorFacade.Email,
                CreationDate = now,
                ModificationDate = now,
                LastConnection = now,
                IsActive = true,
                PasswordTryCount = 0,
                Password = password.PasswordHashed,
                Salt = password.Salt,
                AgencyId = collaboratorFacade.AgencyId,
                ServiceLineId = collaboratorFacade.ServiceLineId
            });
            _knowledgeCenterContext.SaveChanges();

            var collaborator = new DataConnector.Entities.Match.Collaborator
            {
                Id = userCreated.Entity.Id,
                GGID = collaboratorFacade.GGID
            };
            _knowledgeCenterContext.Collaborators.Add(collaborator);
            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<Collaborator>(collaborator);
        }

        public void DeleteCollaborator(int collaboratorId)
        {
            var foundCollaborator = _knowledgeCenterContext.Collaborators
                .Include(x => x.CollaboratorSkills)
                .SingleOrDefault(x => x.Id == collaboratorId);

            if (foundCollaborator is null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            _knowledgeCenterContext.CollaboratorSkills.RemoveRange(foundCollaborator.CollaboratorSkills);
            _knowledgeCenterContext.Collaborators.Remove(foundCollaborator);
            _knowledgeCenterContext.SaveChanges();
        }

        public Collaborator UpdateCollaborator(CreateOrUpdateCollaborator collaboratorFacade)
        {
            var collaboratorWithSameEmail = _knowledgeCenterContext.Users
                .SingleOrDefault(x =>
                    string.Equals(x.Email.ToLower(), collaboratorFacade.Email.ToLower(), StringComparison.CurrentCultureIgnoreCase) &&
                    x.Id != collaboratorFacade.Id
                );

            if (collaboratorWithSameEmail != null)
            {
                throw new HandledException(ErrorCode.COLLABORATOR_ALREADYEXISTS_EMAIL, new string[] {$"{collaboratorWithSameEmail.Firstname} {collaboratorWithSameEmail.Lastname}"});
            }

            var collaboratorWithSameGgid = _knowledgeCenterContext.Collaborators
                .SingleOrDefault(x => x.GGID == collaboratorFacade.GGID);

            if (collaboratorWithSameGgid != null)
            {
                var user = _knowledgeCenterContext.Users
                    .SingleOrDefault(x => x.Id == collaboratorWithSameGgid.Id);

                throw new HandledException(ErrorCode.COLLABORATOR_ALREADYEXISTS_GGID, new string[] {$"{user.Firstname} {user.Lastname}"});
            }

            var foundCollaborator = _knowledgeCenterContext.Collaborators
                .SingleOrDefault(x => x.Id == collaboratorFacade.Id);

            if (foundCollaborator is null)
            {
                foundCollaborator = new DataConnector.Entities.Match.Collaborator
                {
                    Id = collaboratorFacade.Id,
                    GGID = collaboratorFacade.GGID
                };
                _knowledgeCenterContext.Collaborators.Add(foundCollaborator);
            }
            else
            {
                foundCollaborator.GGID = collaboratorFacade.GGID;
                _knowledgeCenterContext.Collaborators.Update(foundCollaborator);
            }

            var foundUser = _knowledgeCenterContext.Users
                .Single(x => x.Id == foundCollaborator.Id);

            foundUser.Firstname = collaboratorFacade.Firstname;
            foundUser.Lastname = collaboratorFacade.Lastname;

            foundUser.Email = collaboratorFacade.Email;
            foundUser.ModificationDate = DateTime.Now;
            foundUser.AgencyId = collaboratorFacade.AgencyId;
            foundUser.ServiceLineId = collaboratorFacade.ServiceLineId;
            _knowledgeCenterContext.Users.Update(foundUser);

            _knowledgeCenterContext.SaveChanges();

            return GetCollaborator(foundCollaborator.Id);
        }

        #endregion
    }
}