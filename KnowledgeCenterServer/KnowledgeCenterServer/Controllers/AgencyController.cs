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
    /// Agency controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/agency")]
    public class AgencyController : Controller
    {
        private readonly IAgencyProvider _agencyProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="agencyProvider"></param>
        public AgencyController(IAgencyProvider agencyProvider)
        {
            _agencyProvider = agencyProvider;
        }

        /// <summary>
        /// Get all agencies
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public BaseResponse<List<Agency>> GetAgencies()
        {
            return new BaseResponse<List<Agency>>(_agencyProvider.GetAllAgencies());
        }

        /// <summary>
        /// Get a specific agency
        /// </summary>
        /// <returns></returns>
        [HttpGet("{id}")]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public BaseResponse<Agency> Get(int id)
        {
            return new BaseResponse<Agency>(_agencyProvider.GetAgency(id));
        }

        /// <summary>
        /// Create a new agency
        /// </summary>
        /// <param name="agency"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public BaseResponse<Agency> Create([FromBody]Agency agency)
        {
            return new BaseResponse<Agency>(_agencyProvider.CreateAgency(agency));
        }

        /// <summary>
        /// Update an agency
        /// </summary>
        /// <param name="id"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public BaseResponse<Agency> Update(int id, [FromBody]Agency agency)
        {
            return new BaseResponse<Agency>(_agencyProvider.UpdateAgency(id, agency));
        }

        /// <summary>
        /// Delete an agency
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = EnumRoles.ADMIN)]
        public void Delete(int id)
        {
            _agencyProvider.DeleteAgency(id);
        }
    }
}