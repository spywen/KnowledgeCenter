using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers.Match
{
    /// <summary>
    ///  CustomerOffer
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/customer-offer")]
    public class CustomerOfferController : Controller
    {
        private readonly ICustomerOfferProvider _customerOfferProvider;
        
        /// <summary>
        /// Controller
        /// </summary>
        /// <param name="customerOfferProvider"></param>
        public CustomerOfferController(ICustomerOfferProvider customerOfferProvider)
        {
            _customerOfferProvider = customerOfferProvider;
        }

        /// <summary>
        /// Get all registered customerOffers
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpPost]
        public BaseResponse<BasePaginationResponse<List<CustomerOffer>>> GetFilteredCustomerOffers([FromBody] BasePaginationRequest<CustomerOfferFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<CustomerOffer>>>(_customerOfferProvider.GetFilteredCustomerOffers(query));
        }

        /// <summary>
        /// Get a customerOffer
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{customerOfferId}")]
        public BaseResponse<CustomerOffer> GetCustomerOffer(int customerOfferId)
        {
            return new BaseResponse<CustomerOffer>(_customerOfferProvider.GetCustomerOffer(customerOfferId));
        }
        
        /// <summary>
        /// Get the required skills for a given customer offer
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{customerOfferId}/skills")]
        public BaseResponse<List<CustomerOfferSkill>> GetCustomerOfferSkills(int customerOfferId)
        {
            return new BaseResponse<List<CustomerOfferSkill>>(_customerOfferProvider.GetCustomerOfferSkills(customerOfferId));
        }

        /// <summary>
        /// Create a new customerOffer
        /// </summary>
        /// <param name="customerOffer"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPost("create")]
        public BaseResponse<CustomerOffer> CreateCustomerOffer([FromBody] CustomerOffer customerOffer)
        {
            return new BaseResponse<CustomerOffer>(_customerOfferProvider.CreateCustomerOffer(customerOffer));
        }
        
        /// <summary>
        /// Update a customer offer
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <param name="customerOffer"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPut("{customerOfferId}")]
        public BaseResponse<CustomerOffer> UpdateCustomerOffer(int customerOfferId, [FromBody]CustomerOffer customerOffer)
        {
            return new BaseResponse<CustomerOffer>(_customerOfferProvider.UpdateCustomerOffer(customerOfferId, customerOffer));
        }

        /// <summary>
        /// Delete customerOffer
        /// </summary>
        /// <param name="customerOfferId"></param>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpDelete("{customerOfferId}")]
        public void DeleteCustomerOffer(int customerOfferId)
        {
            _customerOfferProvider.DeleteCustomerOffer(customerOfferId);
        }

         /// <summary>
        /// Update CustomerOffer skills
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <param name="newSkills"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPut("{customerOfferId}/skills")]
        public BaseResponse<List<CustomerOfferSkill>> UpdateCustomerOfferSkills(int customerOfferId, [FromBody] List<CustomerOfferSkill> newSkills)
        {
            return new BaseResponse<List<CustomerOfferSkill>>(_customerOfferProvider.UpdateCustomerOfferSkills(customerOfferId, newSkills));
        }

        /// <summary>
        /// Add a skill to a customerOffer
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <param name="skillToAdd"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPost("{customerOfferId}/skills")]
        public BaseResponse<CustomerOfferSkill> AddCustomerOfferSkill(int customerOfferId, [FromBody] CustomerOfferSkill skillToAdd)
        {
            return new BaseResponse<CustomerOfferSkill>(_customerOfferProvider.AddCustomerOfferSkill(customerOfferId, skillToAdd));
        }

        /// <summary>
        /// Delete a customerOffer's skill
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <param name="skillToDeleteId"></param>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpDelete("{customerOfferId}/skills/{skillToDeleteId}")]
        public void DeleteCustomerOfferSkill(int customerOfferId, int skillToDeleteId)
        {
            _customerOfferProvider.DeleteCustomerOfferSkill(customerOfferId, skillToDeleteId);
        }

        /// <summary>
        /// Update a specific customerOffer's skill level
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <param name="skillToModifyId"></param>
        /// <param name="skillToModify"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPut("{customerOfferId}/skills/{skillToModifyId}")]
        public BaseResponse<CustomerOfferSkill> UpdateCustomerOfferSkillLevel(int customerOfferId, int skillToModifyId, [FromBody] CustomerOfferSkill skillToModify)
        {
            return new BaseResponse<CustomerOfferSkill>(_customerOfferProvider.UpdateCustomerOfferSkillLevel(customerOfferId, skillToModifyId, skillToModify));
        }
    }
}