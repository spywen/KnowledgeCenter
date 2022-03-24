using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;

namespace KnowledgeCenter.Match.Providers
{
    public class CustomerOfferStatusProvider : ICustomerOfferStatusProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public CustomerOfferStatusProvider(KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public List<CustomerOfferStatus> GetAllCustomerOfferStatus()
        {
            return _knowledgeCenterContext.CustomerOffersStatus
                .Select(x => _mapper.Map<CustomerOfferStatus>(x))
                .ToList();
        }

        public CustomerOfferStatus GetCustomerOfferStatus(int customerOfferStatusId)
        {
            if (!_knowledgeCenterContext.CustomerOffersStatus.Any(x => x.Id == customerOfferStatusId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            return _mapper.Map<CustomerOfferStatus>(_knowledgeCenterContext.CustomerOffersStatus.Single(x => x.Id == customerOfferStatusId)
            );
        }
    }
}