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
    /// Collaborator customer site
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/customer-site")]
    public class CustomerSiteController : Controller
    {
        private readonly ICustomerSiteProvider _customerSiteProvider;
        
        /// <summary>
        /// Controller
        /// </summary>
        /// <param name="customerSiteProvider"></param>
        public CustomerSiteController(ICustomerSiteProvider customerSiteProvider)
        {
            _customerSiteProvider = customerSiteProvider;
        }

        /// <summary>
        /// Get all sites, for the given customer
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpPost]
        public BaseResponse<BasePaginationResponse<List<CustomerSite>>> GetFilteredCustomerSites([FromBody] BasePaginationRequest<CustomerSiteFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<CustomerSite>>>(_customerSiteProvider.GetFilteredCustomerSites(query));
        }

        /// <summary>
        /// Get a customer site
        /// </summary>
        /// <param name="customerSiteId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{customerSiteId}")]
        public BaseResponse<CustomerSite> GetCustomerSite(int customerSiteId)
        {
            return new BaseResponse<CustomerSite>(_customerSiteProvider.GetCustomerSite(customerSiteId));
        }

        /// <summary>
        /// Create a new site, for the given customer
        /// </summary>
        /// <param name="customerSite"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPost("create")]
        public BaseResponse<CustomerSite> CreateCustomerSite([FromBody] CustomerSite customerSite)
        {
            return new BaseResponse<CustomerSite>(_customerSiteProvider.CreateCustomerSite(customerSite));
        }
        
        /// <summary>
        /// Update a customer site
        /// </summary>
        /// <param name="customerSiteId"></param>
        /// <param name="customerSite"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPut("{customerSiteId}")]
        public BaseResponse<CustomerSite> UpdateCustomerSite(int customerSiteId, [FromBody]CustomerSite customerSite)
        {
            return new BaseResponse<CustomerSite>(_customerSiteProvider.UpdateCustomerSite(customerSiteId, customerSite));
        }

        /// <summary>
        /// Delete customer site
        /// </summary>
        /// <param name="customerSiteId"></param>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpDelete("{customerSiteId}")]
        public void DeleteCustomerSite(int customerSiteId)
        {
            _customerSiteProvider.DeleteCustomerSite(customerSiteId);
        }
    }
}