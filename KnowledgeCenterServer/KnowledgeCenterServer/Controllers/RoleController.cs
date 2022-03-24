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
    /// Role controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/role")]
    [Authorize(Roles = EnumRoles.ADMIN)]
    public class RoleController : Controller
    {
        private readonly IRoleProvider _roleProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="roleProvider"></param>
        public RoleController(IRoleProvider roleProvider)
        {
            _roleProvider = roleProvider;
        }

        /// <summary>
        /// Get all roles
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public BaseResponse<List<Role>> GetAllRoles()
        {
            return new BaseResponse<List<Role>>(_roleProvider.GetAllRoles());
        }

        /// <summary>
        /// Get user role
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public BaseResponse<List<Role>> GetRoles(int id)
        {
            return new BaseResponse<List<Role>>(_roleProvider.GetRoles(id));
        }

        /// <summary>
        /// Update user roles
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newRoleIds"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public BaseResponse<List<Role>> UpdateRoles(int id, [FromBody] List<int> newRoleIds)
        {
            return new BaseResponse<List<Role>>(_roleProvider.UpdateRoles(id, newRoleIds));
        }
    }
}
