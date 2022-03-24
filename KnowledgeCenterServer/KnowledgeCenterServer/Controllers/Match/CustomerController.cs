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
    /// Collaborator customer
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/customer")]
    public class CustomerController : Controller
    {
        private readonly ICustomerProvider _customerProvider;
        
        /// <summary>
        /// Controller
        /// </summary>
        /// <param name="customerProvider"></param>
        public CustomerController(ICustomerProvider customerProvider)
        {
            _customerProvider = customerProvider;
        }

        /// <summary>
        /// Get all registered customers
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpPost]
        public BaseResponse<BasePaginationResponse<List<Customer>>> GetFilteredCustomer([FromBody] BasePaginationRequest<CustomerFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<Customer>>>(_customerProvider.GetFilteredCustomers(query));
        }

        /// <summary>
        /// Get a customer
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{customerId}")]
        public BaseResponse<Customer> GetCustomer(int customerId)
        {
            return new BaseResponse<Customer>(_customerProvider.GetCustomer(customerId));
        }

        /// <summary>
        /// Create a new customer
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPost("create")]
        public BaseResponse<Customer> CreateCustomer([FromBody] Customer customer)
        {
            return new BaseResponse<Customer>(_customerProvider.CreateCustomer(customer));
        }
        
        /// <summary>
        /// Update a customer
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="customer"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpPut("{customerId}")]
        public BaseResponse<Customer> UpdateCustomer(int customerId, [FromBody] Customer customer)
        {
            return new BaseResponse<Customer>(_customerProvider.UpdateCustomer(customerId, customer));
        }

        /// <summary>
        /// Delete customer
        /// </summary>
        /// <param name="customerId"></param>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpDelete("{customerId}")]
        public void DeleteCustomer(int customerId)
        {
            _customerProvider.DeleteCustomer(customerId);
        }
    }
}