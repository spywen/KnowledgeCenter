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
    /// User controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly IUserProvider _userProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userProvider"></param>
        public UserController(IUserProvider userProvider)
        {
            _userProvider = userProvider;
        }

        /// <summary>
        /// Get profile of authentified user
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.USER)]
        [HttpGet("me")]
        public BaseResponse<User> Get()
        {
            return new BaseResponse<User>(_userProvider.GetConnectedUser());
        }

        /// <summary>
        /// Get profile of user, who fulfil with the given id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.ADMIN)]
        [HttpGet]
        public BaseResponse<User> Get([FromQuery]int id)
        {
            return new BaseResponse<User>(_userProvider.GetUser(id));
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.ADMIN)]
        [HttpGet("all")]
        public BaseResponse<List<User>> GetUsers()
        {
            return new BaseResponse<List<User>>(_userProvider.GetAllUsers());
        }

        /// <summary>
        /// Create a new user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public void Create([FromBody]CreateOrUpdateUser user)
        {
            _userProvider.CreateUser(user);
        }

        /// <summary>
        /// Activate account
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPatch("activate")]
        public BaseResponse<string> ActivateAccount([FromQuery]string token)
        {
            return new BaseResponse<string>(_userProvider.ActivateAccount(token));
        }

        /// <summary>
        /// Update a new user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.USER)]
        [HttpPut]
        public void Update([FromBody]CreateOrUpdateUser user)
        {
            _userProvider.UpdateUser(user);
        }

        /// <summary>
        /// Delete user
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.ADMIN)]
        [HttpDelete]
        public void Delete(int id)
        {
            _userProvider.DeleteUser(id);
        }
    }
}
