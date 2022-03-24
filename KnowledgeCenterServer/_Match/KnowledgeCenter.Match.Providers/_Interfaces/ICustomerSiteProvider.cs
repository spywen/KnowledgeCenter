using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface ICustomerSiteProvider
    {
        BasePaginationResponse<List<CustomerSite>> GetFilteredCustomerSites(BasePaginationRequest<CustomerSiteFilter> query);
        CustomerSite GetCustomerSite(int customerSiteId);
        CustomerSite CreateCustomerSite(CustomerSite customerSite);
        CustomerSite UpdateCustomerSite(int customerSiteId, CustomerSite customerSite);
        void DeleteCustomerSite(int customerSiteId);
    }
}