using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;
using Entities = KnowledgeCenter.DataConnector.Entities.Match;

namespace KnowledgeCenter.Match.Providers
{
    public class CustomerOfferProvider : ICustomerOfferProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;
        private readonly IMatchingProvider _matchingProvider;

        public CustomerOfferProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper,
            IMatchingProvider matchingProvider)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
            _matchingProvider = matchingProvider;
        }

        #region Get

        public BasePaginationResponse<List<CustomerOffer>> GetFilteredCustomerOffers(
            BasePaginationRequest<CustomerOfferFilter> query)
        {
            var filters = query.Filters;
            var noDateProvidedValue = new DateTime(0001, 01, 01);

            var customerOfferQuery = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerSite)
                .ThenInclude(x => x.Customer)
                .Include(x => x.CustomerAccountManager)
                .ThenInclude(x => x.Agency)
                .Include(x => x.CustomerOfferStatus)
                .Include(x => x.CustomerSite)
                .ThenInclude(x => x.Customer)
                .Where(x => filters == null ||
                            (filters.Keyword == null || (x.CustomerAccountManager.Firstname.ToLower().Contains(filters.Keyword.ToLower()) ||
                             x.CustomerAccountManager.Lastname.ToLower().Contains(filters.Keyword.ToLower()) ||
                             x.CustomerSite.Name.ToLower().Contains(filters.Keyword.ToLower()) ||
                             x.CustomerSite.Customer.Name.ToLower().Contains(filters.Keyword.ToLower()) ||
                             x.JobTitle.ToLower().Contains(filters.Keyword.ToLower()))) &&
                            (filters.CustomerId == 0 || x.CustomerSite.Customer.Id == filters.CustomerId) &&
                            (filters.AgencyId == 0 || x.CustomerAccountManager.Agency.Id == filters.AgencyId) &&
                            (filters.CreationDateStart == noDateProvidedValue || x.CreationDate >= filters.CreationDateStart) &&
                            (filters.CreationDateEnd == noDateProvidedValue || x.CreationDate <= filters.CreationDateEnd) &&
                            (filters.CustomerAccountManagerId == 0 || x.CustomerAccountManager.Id == filters.CustomerAccountManagerId) &&
                            (filters.CustomerOfferStatusId == 0 || x.CustomerOfferStatus.Id == filters.CustomerOfferStatusId) &&
                            (filters.JobTitle == null || x.JobTitle.ToLower().Contains(filters.JobTitle.ToLower()))
                )
                .OrderByDescending(x => x.CreationDate);

            var customerOffers = customerOfferQuery
                .Skip(query.Size * (query.Page - 1))
                .Take(query.Size)
                .ToList();
            var totalItems = customerOfferQuery.Count();

            return new BasePaginationResponse<List<CustomerOffer>>(_mapper.Map<List<CustomerOffer>>(customerOffers),
                query, totalItems);
        }

        public CustomerOffer GetCustomerOffer(int customerOfferId)
        {
            if (!_knowledgeCenterContext.CustomerOffers.Any(x => x.Id == customerOfferId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            return _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferStatus)
                .Include(x => x.CustomerAccountManager)
                .ThenInclude(x => x.Agency)
                .Include(x => x.CustomerSite)
                .ThenInclude(x => x.Customer)
                .Include(x => x.CustomerOfferSkills)
                .ThenInclude(x => x.Skill)
                .ThenInclude(x => x.ServiceLine)
                .Include(x => x.CustomerOfferSkills)
                .ThenInclude(x => x.SkillLevel)
                .Where(x => x.Id == customerOfferId)
                .Select(x => _mapper.Map<CustomerOffer>(x))
                .SingleOrDefault();
        }

        #endregion

        #region Skills

        public List<CustomerOfferSkill> UpdateCustomerOfferSkills(int customerOfferId, List<CustomerOfferSkill> newSkills)
        {
            var customerOffer = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferSkills)
                .SingleOrDefault(x => x.Id == customerOfferId);

            if (customerOffer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (newSkills.GroupBy(x => x.SkillId)
                    .Select(x => new {Value = x.Key, Count = x.Count()})
                    .Any(x => x.Count > 1) ||
                newSkills.GroupBy(x => x.SkillPriority)
                    .Select(x => new {Value = x.Key, Count = x.Count()})
                    .Any(x => x.Count > 1))
            {
                throw new HandledException(ErrorCode.INVALID_ACTION);
            }

            var oldSkills = customerOffer.CustomerOfferSkills.ToList();
            var skillsToDelete = oldSkills.Where(x => !newSkills.Select(w => w.SkillId).Contains(x.SkillId)).ToList();
            var skillsToAdd = newSkills.Where(x => !oldSkills.Select(w => w.SkillId).Contains(x.SkillId)).ToList();
            var skillsToModify = newSkills.Where(x => oldSkills.Any(y => x.SkillId == y.SkillId)).ToList();

            // Add skills
            skillsToAdd.ForEach(x =>
            {
                customerOffer.CustomerOfferSkills.Add(new DataConnector.Entities.Match.CustomerOfferSkill
                {
                    SkillId = x.SkillId,
                    SkillLevelId = x.SkillLevelId,
                    SkillPriority = x.SkillPriority
                });
            });

            // Delete skills
            skillsToDelete.ForEach(x =>
            {
                var currentSkill = customerOffer.CustomerOfferSkills.First(y => y.SkillId == x.SkillId);
                customerOffer.CustomerOfferSkills.Remove(currentSkill);
            });

            // Update skills
            skillsToModify.ForEach(x =>
            {
                var skillToModify = customerOffer.CustomerOfferSkills.First(y => y.SkillId == x.SkillId);
                skillToModify.SkillLevelId = x.SkillLevelId;
                skillToModify.SkillPriority = x.SkillPriority;
            });

            _knowledgeCenterContext.SaveChanges();
            return GetCustomerOfferSkills(customerOfferId);
        }

        public CustomerOfferSkill AddCustomerOfferSkill(int customerOfferId, CustomerOfferSkill skillToAdd)
        {
            var customerOffer = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferSkills)
                .SingleOrDefault(x => x.Id == customerOfferId);

            if (customerOffer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (customerOffer.CustomerOfferSkills.Any(x => x.SkillId == skillToAdd.SkillId))
            {
                throw new HandledException(ErrorCode.CUSTOMEROFFER_ALREADY_HAS_SKILL);
            }

            if (skillToAdd.SkillPriority <= 0)
            {
                throw new HandledException(ErrorCode.CUSTOMEROFFERSKILL_INVALID_PRIORITY);
            }

            if (customerOffer.CustomerOfferSkills.Any(x => x.SkillPriority == skillToAdd.SkillPriority))
            {
                throw new HandledException(ErrorCode.CUSTOMEROFFERSKILL_PRIORITY_ALREADY_ASSIGNED);
            }

            customerOffer.CustomerOfferSkills.Add(new DataConnector.Entities.Match.CustomerOfferSkill
            {
                SkillId = skillToAdd.SkillId,
                SkillLevelId = skillToAdd.SkillLevelId,
                SkillPriority = skillToAdd.SkillPriority
            });

            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<CustomerOfferSkill>(
                _knowledgeCenterContext.CustomerOfferSkills
                    .Include(x => x.Skill)
                    .ThenInclude(x => x.ServiceLine)
                    .Include(x => x.SkillLevel)
                    .Single(x => x.CustomerOfferId == customerOfferId && x.SkillId == skillToAdd.SkillId)
            );
        }

        public void DeleteCustomerOfferSkill(int customerOfferId, int skillToDeleteId)
        {
            var customerOffer = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferSkills)
                .SingleOrDefault(x => x.Id == customerOfferId);

            if (customerOffer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            
            _matchingProvider.DeleteMatching(customerOfferId);

            var skillToDelete = customerOffer.CustomerOfferSkills.First(x => x.SkillId == skillToDeleteId);
            _knowledgeCenterContext.Remove(skillToDelete);
            
            foreach (var customerOfferCustomerOfferSkill in customerOffer.CustomerOfferSkills)
            {
                if (customerOfferCustomerOfferSkill.SkillPriority > skillToDelete.SkillPriority) customerOfferCustomerOfferSkill.SkillPriority -= 1;
            }
            
            _knowledgeCenterContext.Update(customerOffer);
            _knowledgeCenterContext.SaveChanges();
        }

        public CustomerOfferSkill UpdateCustomerOfferSkillLevel(int customerOfferId, int skillToModifyId,
            CustomerOfferSkill skillToModify)
        {
            var customerOffer = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferSkills)
                .SingleOrDefault(x => x.Id == customerOfferId);

            if (customerOffer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            customerOffer.CustomerOfferSkills.First(x => x.SkillId == skillToModifyId).SkillLevelId =
                skillToModify.SkillLevelId;

            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<CustomerOfferSkill>(
                _knowledgeCenterContext.CustomerOfferSkills
                    .Include(x => x.Skill)
                    .ThenInclude(x => x.ServiceLine)
                    .Include(x => x.SkillLevel)
                    .Single(x => x.CustomerOfferId == customerOfferId && x.SkillId == skillToModify.SkillId)
            );
        }

        public List<CustomerOfferSkill> GetCustomerOfferSkills(int customerOfferId)
        {
            if (!_knowledgeCenterContext.CustomerOffers.Any(x => x.Id == customerOfferId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            return _knowledgeCenterContext.CustomerOfferSkills
                .Where(x => x.CustomerOfferId == customerOfferId)
                .Include(x => x.Skill)
                .ThenInclude(x => x.ServiceLine)
                .Include(x => x.SkillLevel)
                .Include(x => x.CustomerOffer)
                .Select(x => _mapper.Map<CustomerOfferSkill>(x))
                .OrderBy(x => x.SkillPriority)
                .ToList();
        }

        #endregion

        #region CRUD

        public CustomerOffer CreateCustomerOffer(CustomerOffer customerOfferFacade)
        {
            var now = DateTime.Now;

            if (DateTime.Compare(customerOfferFacade.MissionEndDate, new DateTime()) != 0 && customerOfferFacade.MissionEndDate < customerOfferFacade.MissionStartDate)
            {
                throw new HandledException(ErrorCode.CUSTOMEROFFER_MISSIONENDDATE_EARLIERTHAN_MISSIONSSTARTDATE);
            }

            if (!_knowledgeCenterContext.CustomerOffersStatus.Any(x => x.Id == customerOfferFacade.CustomerOfferStatusId) ||
                !_knowledgeCenterContext.Users.Any(x => x.Id == customerOfferFacade.CustomerAccountManagerId) ||
                !_knowledgeCenterContext.CustomersSites.Any(x => x.Id == customerOfferFacade.CustomerSiteId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            var customerOffer = new Entities.CustomerOffer
            {
                JobTitle = customerOfferFacade.JobTitle,
                Requester = customerOfferFacade.Requester,
                CreationDate = now,
                ModificationDate = now,
                MissionStartDate = customerOfferFacade.MissionStartDate,
                MissionEndDate = customerOfferFacade.MissionEndDate,
                MobilityRequired = customerOfferFacade.MobilityRequired,
                OnSite = customerOfferFacade.OnSite,
                WorkFromHome = customerOfferFacade.WorkFromHome,
                CustomerOfferStatusId = customerOfferFacade.CustomerOfferStatusId,
                Description = customerOfferFacade.Description,
                CustomerAccountManagerId = customerOfferFacade.CustomerAccountManagerId,
                CustomerSiteId = customerOfferFacade.CustomerSiteId
            };

            _knowledgeCenterContext.Add(customerOffer);
            _knowledgeCenterContext.SaveChanges();
            return GetCustomerOffer(customerOffer.Id);
        }

        public void DeleteCustomerOffer(int customerOfferId)
        {
            var foundCustomerOffer = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferSkills)
                .SingleOrDefault(x => x.Id == customerOfferId);

            if (foundCustomerOffer is null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (_knowledgeCenterContext.Matching.Any(x => x.CustomerOfferId == customerOfferId))
            {
                _matchingProvider.DeleteMatching(customerOfferId);
            }

            _knowledgeCenterContext.CustomerOfferSkills.RemoveRange(foundCustomerOffer.CustomerOfferSkills);
            _knowledgeCenterContext.CustomerOffers.Remove(foundCustomerOffer);
            _knowledgeCenterContext.SaveChanges();
        }

        public CustomerOffer UpdateCustomerOffer(int customerOfferId, CustomerOffer customerOfferFacade)
        {
            var customerOffer = _knowledgeCenterContext.CustomerOffers.SingleOrDefault(x => x.Id == customerOfferId);
            if (customerOffer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            customerOffer.CreationDate = customerOfferFacade.CreationDate;
            customerOffer.ModificationDate = DateTime.UtcNow;
            customerOffer.JobTitle = customerOfferFacade.JobTitle;
            customerOffer.Requester = customerOfferFacade.Requester;
            customerOffer.MissionStartDate = customerOfferFacade.MissionStartDate;
            customerOffer.MissionEndDate = customerOfferFacade.MissionEndDate;
            customerOffer.MobilityRequired = customerOfferFacade.MobilityRequired;
            customerOffer.OnSite = customerOfferFacade.OnSite;
            customerOffer.WorkFromHome = customerOfferFacade.WorkFromHome;
            customerOffer.CustomerOfferStatusId = customerOfferFacade.CustomerOfferStatusId;
            customerOffer.Description = customerOfferFacade.Description;
            customerOffer.CustomerAccountManagerId = customerOfferFacade.CustomerAccountManagerId;
            customerOffer.CustomerSiteId = customerOfferFacade.CustomerSiteId;

            _knowledgeCenterContext.SaveChanges();

            return GetCustomerOffer(customerOffer.Id);
        }

        #endregion
    }
}