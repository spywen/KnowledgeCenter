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
    public class CustomerProvider : ICustomerProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public CustomerProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }
        
        public BasePaginationResponse<List<Customer>> GetFilteredCustomers(BasePaginationRequest<CustomerFilter> query)
        {
            var keywordFilter = query.Filters != null ? query.Filters.Keyword : "";
            var customersQuery = _knowledgeCenterContext.Customers
                .Where(x => x.Name.ToLower().Contains(keywordFilter.ToLower()));
            var totalItems = customersQuery.Count();
            var customers = customersQuery
                .Skip(query.Size * (query.Page - 1))
                .Take(query.Size)
                .ToList();

            return new BasePaginationResponse<List<Customer>>(_mapper.Map<List<Customer>>(customers), query, totalItems);
        }

        public Customer GetCustomer(int customerId)
        {
            if (!_knowledgeCenterContext.Customers.Any(x => x.Id == customerId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.Customers
                .Where(x => x.Id == customerId)
                .Select(x => _mapper.Map<Customer>(x))
                .SingleOrDefault();
        }

        public Customer CreateCustomer(Customer customerFacade)
        {
            if (_knowledgeCenterContext.Customers
                .Any(x => string.Equals(x.Name, customerFacade.Name, StringComparison.CurrentCultureIgnoreCase)))
            {
                throw new HandledException(ErrorCode.CUSTOMER_ALREADYEXISTS);
            }
            
            var now = DateTime.Now;
            var customer = new Entities.Customer
            {
                Name = customerFacade.Name,
                CreationDate = now,
                ModificationDate = now
            };

            _knowledgeCenterContext.Add(customer);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<Customer>(customer);
        }

        public Customer UpdateCustomer(int customerId, Customer customerFacade)
        {
            var customer = _knowledgeCenterContext.Customers.SingleOrDefault(x => x.Id == customerId);
            if (customer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            if (_knowledgeCenterContext.Customers
                .Any(x => string.Equals(x.Name, customerFacade.Name, StringComparison.CurrentCultureIgnoreCase)))
            {
                throw new HandledException(ErrorCode.CUSTOMER_ALREADYEXISTS);
            }

            customer.Name = customerFacade.Name;
            customer.ModificationDate = DateTime.Now;

            _knowledgeCenterContext.Customers.Update(customer);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<Customer>(customer);
        }

        public void DeleteCustomer(int customerId)
        {
            var customer = _knowledgeCenterContext.Customers.SingleOrDefault(x => x.Id == customerId);
            if (customer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            var customerSites = _knowledgeCenterContext.CustomersSites
                .Where(x => x.CustomerId == customer.Id)
                .ToList();

            _knowledgeCenterContext.CustomersSites.RemoveRange(customerSites);
            _knowledgeCenterContext.Customers.Remove(customer);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}