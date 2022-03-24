using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers
{
    /// <summary>
    /// Service Line controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/serviceline")]
    public class ServiceLineController
    {
        private readonly IServiceLineProvider _serviceLineProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="serviceLineProvider"></param>
        public ServiceLineController(IServiceLineProvider serviceLineProvider)
        {
            _serviceLineProvider = serviceLineProvider;
        }

        /// <summary>
        /// Get all service lines
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public BaseResponse<List<ServiceLine>> GetAllServiceLines()
        {
            return new BaseResponse<List<ServiceLine>>(_serviceLineProvider.GetAllServiceLines());
        }

        /// <summary>
        /// Get a service line
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public BaseResponse<ServiceLine> GetServiceLine(int id)
        {
            return new BaseResponse<ServiceLine>(_serviceLineProvider.GetServiceLine(id));
        }

        /// <summary>
        /// Delete a service line
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public void DeleteServiceLine(int id)
        {
            _serviceLineProvider.DeleteServiceLine(id);
        }

        /// <summary>
        /// Create a service line
        /// </summary>
        /// <param name="serviceLine"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public BaseResponse<ServiceLine> CreateServiceLine([FromBody] ServiceLine serviceLine)
        {
            return new BaseResponse<ServiceLine>(_serviceLineProvider.CreateServiceLine(serviceLine));
        }

        /// <summary>
        /// Update a service line
        /// </summary>
        /// <param name="id"></param>
        /// <param name="serviceLine"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public BaseResponse<ServiceLine> UpdateServiceLine(int id, [FromBody] ServiceLine serviceLine)
        {
            return new BaseResponse<ServiceLine>(_serviceLineProvider.UpdateServiceLine(id, serviceLine));
        }

    }
}