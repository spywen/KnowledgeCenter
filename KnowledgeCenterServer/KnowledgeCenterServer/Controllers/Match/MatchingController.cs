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
    /// Matching controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/matching")]
    public class MatchingController : Controller
    {
        private readonly IMatchingProvider _matchingProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="matchingProvider"></param>
        public MatchingController(IMatchingProvider matchingProvider)
        {
            _matchingProvider = matchingProvider;
        }

        /// <summary>
        /// Get all filtered matching
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpPost]
        public BaseResponse<BasePaginationResponse<List<Matching>>> GetFilteredMatching([FromBody] BasePaginationRequest<MatchingFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<Matching>>>(_matchingProvider.GetFilteredMatching(query));
        }
        
        /// <summary>
        /// Get a matching
        /// </summary>
        /// <param name="matchingId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{matchingId}")]
        public BaseResponse<Matching> GetMatching(int matchingId)
        {
            return new BaseResponse<Matching>(_matchingProvider.GetMatching(matchingId));
        }
        
        /// <summary>
        /// Generate matching for a given customer offer
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpGet("{customerOfferId}/generate")]
        public BaseResponse<List<Matching>> GenerateMatching(int customerOfferId)
        {
            return new BaseResponse<List<Matching>>(_matchingProvider.GenerateMatching(customerOfferId));
        }
        
        /// <summary>
        /// Delete matching for a given customer offer
        /// </summary>
        /// <param name="customerOfferId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_CAM)]
        [HttpDelete("{customerOfferId}")]
        public void DeleteMatching(int customerOfferId)
        {
            _matchingProvider.DeleteMatching(customerOfferId);
        }
    }
}