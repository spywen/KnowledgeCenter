using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Common.Providers
{
    public class AgencyProvider : IAgencyProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public AgencyProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public Agency CreateAgency(Agency agencyFacade)
        {
            if (_knowledgeCenterContext.Agencies.Any(x => x.Name.ToUpper() == agencyFacade.Name.ToUpper()
                                                       || x.PostalCode.ToUpper() == agencyFacade.PostalCode.ToUpper()))
            {
                throw new HandledException(ErrorCode.AGENCY_ALREADYEXISTS);
            }

            var agency = new Entities.Agency
            {
                Name = agencyFacade.Name,
                PostalCode = agencyFacade.PostalCode
            };

            _knowledgeCenterContext.Agencies.Add(agency);
            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<Agency>(agency);
        }

        public Agency UpdateAgency(int id, Agency agencyFacade)
        {
            var agency = _knowledgeCenterContext.Agencies.SingleOrDefault(x => x.Id == id);
            if (agency == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            agency.Name = agencyFacade.Name;
            agency.PostalCode = agencyFacade.PostalCode;

            _knowledgeCenterContext.Agencies.Update(agency);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<Agency>(agency);
        }

        public List<Agency> GetAllAgencies()
        {
            return _knowledgeCenterContext.Agencies
                .Select(x => _mapper.Map<Agency>(x))
                .ToList();
        }

        public Agency GetAgency(int id)
        {
            var agency = _knowledgeCenterContext.Agencies
                .Where(x => x.Id == id)
                .Select(x => _mapper.Map<Agency>(x))
                .SingleOrDefault();
            if (agency == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return agency;
        }

        public void DeleteAgency(int id)
        {
            var isUserLinkedToThisAgency = _knowledgeCenterContext.Users.Any(x => x.AgencyId.Equals(id));
            if (isUserLinkedToThisAgency)
            {
                throw new HandledException(ErrorCode.AGENCY_LINKEDWITHUSER);
            }
            var agency = _knowledgeCenterContext.Agencies.SingleOrDefault(x => x.Id == id);
            if (agency == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            _knowledgeCenterContext.Agencies.Remove(agency);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}