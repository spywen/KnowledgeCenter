using System.Collections.Generic;
using KnowledgeCenter.Green.Contracts;
using KnowledgeCenter.Green.Providers._Interfaces;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers.Green
{
    /// <summary>
    /// Green controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/green/publications")]
    [Authorize(Roles = EnumComputedRoles.NICE_COLAB)]
    public class GreenController : Controller
    {
        private readonly IPublicationProvider _publicationProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="publicationProvider"></param>
        public GreenController(IPublicationProvider publicationProvider)
        {
            _publicationProvider = publicationProvider;
        }

        /// <summary>
        /// Get last publication
        /// </summary>
        /// <returns></returns>
        [HttpGet("last")]
        public BaseResponse<Publication> GetLastPublication()
        {
            return new BaseResponse<Publication>(_publicationProvider.GetLastPublication());
        }

        /// <summary>
        /// Get a specific publication
        /// </summary>
        /// <param name="publicationId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.GREEN_ADMIN)]
        [HttpGet("{publicationId}")]
        public BaseResponse<Publication> GetPublication(int publicationId)
        {
            return new BaseResponse<Publication>(_publicationProvider.GetPublication(publicationId));
        }

        /// <summary>
        /// Delete a publication
        /// </summary>
        /// <param name="publicationId"></param>
        [Authorize(Roles = EnumRoles.GREEN_ADMIN)]
        [HttpDelete("{publicationId}")]
        public void DeletePublication(int publicationId)
        {
            _publicationProvider.DeletePublication(publicationId);
        }

        /// <summary>
        /// Create a publication
        /// </summary>
        /// <param name="publication"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.GREEN_ADMIN)]
        [HttpPost("create")]
        public BaseResponse<Publication> CreatePublication([FromBody]CreateOrUpdatePublication publication)
        {
            return new BaseResponse<Publication>(_publicationProvider.CreatePublication(publication));
        }

        /// <summary>
        /// Update a publication
        /// </summary>
        /// <param name="publication"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.GREEN_ADMIN)]
        [HttpPut("update")]
        public BaseResponse<Publication> UpdatePublication([FromBody]CreateOrUpdatePublication publication)
        {
            return new BaseResponse<Publication>(_publicationProvider.UpdatePublication(publication));
        }

        /// <summary>
        /// Get publications
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.GREEN_ADMIN)]
        [HttpGet]
        public BaseResponse<List<Publication>> GetAllPublications()
        {
            return new BaseResponse<List<Publication>>(_publicationProvider.GetAllPublications());
        }

        /// <summary>
        /// Get publications types
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.GREEN_ADMIN)]
        [HttpGet("types")]
        public BaseResponse<List<PublicationType>> GetAllPublicationTypes()
        {
            return new BaseResponse<List<PublicationType>>(_publicationProvider.GetAllPublicationTypes());
        }
    }
}