using System.Collections.Generic;
using KnowledgeCenter.Flux.Contracts;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Flux.Providers._Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeCenterServer.Controllers.Flux
{
    /// <summary>
    /// Flux controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/flux/publication")]
    [Authorize(Roles = EnumComputedRoles.NICE_COLAB)]
    public class FluxController : Controller
    {
        private readonly IFluxProvider _fluxProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="fluxProvider"></param>
        public FluxController(IFluxProvider fluxProvider)
        {
            _fluxProvider = fluxProvider;
        }

        /// <summary>
        /// Create a publication
        /// </summary>
        /// <param name="publication"></param>
        /// <returns></returns>
        [HttpPost]
        public BaseResponse<Publication> CreatePublication([FromBody] CreatePublication publication)
        {
            return new BaseResponse<Publication>(_fluxProvider.CreatePublication(publication));
        }

        /// <summary>
        /// Delete a publication
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete("{id}")]
        public void DeletePublication(int id)
        {
            _fluxProvider.DeletePublication(id);
        }

        /// <summary>
        /// Like publication
        /// </summary>
        /// <param name="id"></param>
        /// <param name="likeCode"></param>
        [HttpPatch("{id}/like/{likeCode}")]
        public BaseResponse<Publication> LikePublication(int id, LikeCode likeCode)
        {
            return new BaseResponse<Publication>(_fluxProvider.LikePublication(id, likeCode));
        }

        /// <summary>
        /// Get publications
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost("all")]
        public BaseResponse<BasePaginationResponse<List<Publication>>> GetPublications([FromBody] BasePaginationRequest<PublicationFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<Publication>>>(_fluxProvider.GetPublications(query));
        }
    }
}