using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface ICustomerOfferProvider
    {
        CustomerOffer GetCustomerOffer(int customerOfferId);
        BasePaginationResponse<List<CustomerOffer>> GetFilteredCustomerOffers(BasePaginationRequest<CustomerOfferFilter> query);
        List<CustomerOfferSkill> UpdateCustomerOfferSkills(int customerOfferId, List<CustomerOfferSkill> newSkills);
        CustomerOfferSkill AddCustomerOfferSkill(int customerOfferId, CustomerOfferSkill skillToAdd);
        void DeleteCustomerOfferSkill(int customerOfferId, int skillToDeleteId);
        CustomerOfferSkill UpdateCustomerOfferSkillLevel(int customerOfferId, int skillToModifyId, CustomerOfferSkill skillToModify);
        CustomerOffer CreateCustomerOffer(CustomerOffer customerOfferFacade);
        void DeleteCustomerOffer(int customerOfferId);
        CustomerOffer UpdateCustomerOffer(int customerOfferId, CustomerOffer customerOfferFacade);
        List<CustomerOfferSkill> GetCustomerOfferSkills(int customerOfferId);
    }
}