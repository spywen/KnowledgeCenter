using System.Collections.Generic;
using KnowledgeCenter.CapLab.Contracts;
using KnowledgeCenter.CapLab.Providers._Interfaces;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers.CapLab
{
    /// <summary>
    /// Project controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/caplab/tag")]
    [Authorize(Roles = EnumComputedRoles.NICE_COLAB)]
    public class TagController : Controller
    {
        private readonly ITagProvider _tagProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="tagProvider"></param>
        public TagController(ITagProvider tagProvider)
        {
            _tagProvider = tagProvider;
        }

        /// <summary>
        /// Get all tags
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public BaseResponse<List<Tag>> GetAllTags()
        {
            return new BaseResponse<List<Tag>>(_tagProvider.GetAllTags());
        }
    }
}