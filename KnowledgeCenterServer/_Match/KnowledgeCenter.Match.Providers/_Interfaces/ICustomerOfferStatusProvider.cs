using System.Collections.Generic;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface ICustomerOfferStatusProvider
    {
        List<CustomerOfferStatus> GetAllCustomerOfferStatus();
        CustomerOfferStatus GetCustomerOfferStatus(int customerOfferStatusId);
    }
}