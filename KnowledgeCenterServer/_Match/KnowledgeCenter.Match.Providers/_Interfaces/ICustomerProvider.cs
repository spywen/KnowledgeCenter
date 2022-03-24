using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface ICustomerProvider
    {
        BasePaginationResponse<List<Customer>> GetFilteredCustomers(BasePaginationRequest<CustomerFilter> query);
        Customer GetCustomer(int customerId);
        Customer CreateCustomer(Customer customer);
        Customer UpdateCustomer(int customerId, Customer customer);
        void DeleteCustomer(int customerId);
    }
}