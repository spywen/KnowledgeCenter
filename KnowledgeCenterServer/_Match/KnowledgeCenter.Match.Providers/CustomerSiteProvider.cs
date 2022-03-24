using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using Entities = KnowledgeCenter.DataConnector.Entities.Match;
using KnowledgeCenter.Match.Providers._Interfaces;

namespace KnowledgeCenter.Match.Providers
{
    public class CustomerSiteProvider : ICustomerSiteProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public CustomerSiteProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }
        
        public BasePaginationResponse<List<CustomerSite>> GetFilteredCustomerSites(BasePaginationRequest<CustomerSiteFilter> query)
        {
            var filters = query.Filters;
            var customerSiteQuery = _knowledgeCenterContext.CustomersSites
                .Where(x => filters == null
                            ||
                                (filters.CustomerId == 0 || x.CustomerId == filters.CustomerId )
                                && (filters.Keyword == null ||
                                    x.Name.ToLower().Contains(filters.Keyword.ToLower()) ||
                                    x.Address.Contains(filters.Keyword))
                            );
            var customerSites = customerSiteQuery
                .Skip(query.Size * (query.Page - 1))
                .Take(query.Size)
                .ToList();
            var totalItems = customerSiteQuery.Count();
            return new BasePaginationResponse<List<CustomerSite>>(_mapper.Map<List<CustomerSite>>(customerSites), query, totalItems);
        }

        public CustomerSite GetCustomerSite(int customerSiteId)
        {
            if (!_knowledgeCenterContext.Customers.Any(x => x.Id == customerSiteId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.CustomersSites
                .Where(x => x.Id == customerSiteId)
                .Select(x => _mapper.Map<CustomerSite>(x))
                .SingleOrDefault();
        }

        public CustomerSite CreateCustomerSite(CustomerSite customerSiteFacade)
        {
            if (_knowledgeCenterContext.CustomersSites
                .Any(x => string.Equals(x.Name, customerSiteFacade.Name, StringComparison.CurrentCultureIgnoreCase) &&
                          x.CustomerId == customerSiteFacade.CustomerId))
            {
                throw new HandledException(ErrorCode.CUSTOMERSITE_ALREADYEXISTS);
            }
            
            var now = DateTime.Now;
            var customerSite = new Entities.CustomerSite
            {
                Name = customerSiteFacade.Name,
                CustomerId = customerSiteFacade.CustomerId,
                Address = customerSiteFacade.Address,
                Contact = customerSiteFacade.Contact,
                CreationDate = now,
                ModificationDate = now
            };

            _knowledgeCenterContext.Add(customerSite);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<CustomerSite>(customerSite);
        }

        public CustomerSite UpdateCustomerSite(int customerSiteId, CustomerSite customerSiteFacade)
        {
            var customerSite = _knowledgeCenterContext.CustomersSites.SingleOrDefault(x => x.Id == customerSiteId);
            if (customerSite == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            
            if (_knowledgeCenterContext.CustomersSites
                .Any(x => string.Equals(x.Name, customerSiteFacade.Name, StringComparison.CurrentCultureIgnoreCase) &&
                          x.CustomerId == customerSiteFacade.CustomerId))
            {
                throw new HandledException(ErrorCode.CUSTOMERSITE_ALREADYEXISTS);
            }

            customerSite.Name = customerSiteFacade.Name;
            customerSite.Address = customerSiteFacade.Address;
            customerSite.Contact = customerSiteFacade.Contact;
            customerSite.ModificationDate = DateTime.Now;

            _knowledgeCenterContext.CustomersSites.Update(customerSite);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<CustomerSite>(customerSite);
        }

        public void DeleteCustomerSite(int customerSiteId)
        {
            var customerSite = _knowledgeCenterContext.CustomersSites.SingleOrDefault(x => x.Id == customerSiteId);
            if (customerSite == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            _knowledgeCenterContext.CustomersSites.Remove(customerSite);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}