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
    /// CustomerOfferStatus controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/customer-offer-status")]
    public class CustomerOfferStatusController
    {
        private readonly ICustomerOfferStatusProvider _customerOfferStatusProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="customerOfferStatusProvider"></param>
        public CustomerOfferStatusController(ICustomerOfferStatusProvider customerOfferStatusProvider)
        {
            _customerOfferStatusProvider = customerOfferStatusProvider;
        }

        /// <summary>
        /// Get all customer status
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet]
        public BaseResponse<List<CustomerOfferStatus>> GetAllCustomerOfferStatus()
        {
            return new BaseResponse<List<CustomerOfferStatus>>(_customerOfferStatusProvider.GetAllCustomerOfferStatus());
        }

        /// <summary>
        /// Get a customer status
        /// </summary>
        /// <param name="customerOfferStatusId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{customerOfferStatusId}")]
        public BaseResponse<CustomerOfferStatus> GetCustomerOfferStatus(int customerOfferStatusId)
        {
            return new BaseResponse<CustomerOfferStatus>(_customerOfferStatusProvider.GetCustomerOfferStatus(customerOfferStatusId));
        }
    }
}