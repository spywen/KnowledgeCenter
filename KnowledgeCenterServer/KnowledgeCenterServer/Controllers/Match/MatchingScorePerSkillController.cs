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
    [Route("api/match/matching-score-per-skill")]
    public class MatchingScorePerSkillController : Controller
    {
        private readonly IMatchingScorePerSkillProvider _matchingScorePerSkillProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="matchingScorePerSkillProvider"></param>
        public MatchingScorePerSkillController(IMatchingScorePerSkillProvider matchingScorePerSkillProvider)
        {
            _matchingScorePerSkillProvider = matchingScorePerSkillProvider;
        }

        /// <summary>
        /// Get all scores per skill for a given matching
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{matchingId}/all")]
        public BaseResponse<List<MatchingScorePerSkill>> GetAllMatchingScoresPerSkill(int matchingId)
        {
            return new BaseResponse<List<MatchingScorePerSkill>>(_matchingScorePerSkillProvider.GetAllMatchingScoresPerSkill(matchingId));
        }
        
        /// <summary>
        /// Get a score
        /// </summary>
        /// <param name="matchingScorePerSkillId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{matchingScorePerSkillId}")]
        public BaseResponse<MatchingScorePerSkill> GetMatchingScorePerSkill(int matchingScorePerSkillId)
        {
            return new BaseResponse<MatchingScorePerSkill>(_matchingScorePerSkillProvider.GetMatchingScorePerSkill(matchingScorePerSkillId));
        }
    }
}