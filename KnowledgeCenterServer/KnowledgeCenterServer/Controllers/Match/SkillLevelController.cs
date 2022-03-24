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
    /// SkillLevel controller
    /// </summary>
    [Produces("application/json")]
    [Route("/api/match/skill-level")]
    public class SkillLevelController
    {
        private readonly ISkillLevelProvider _skillLevelProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="skillLevelProvider"></param>
        public SkillLevelController(ISkillLevelProvider skillLevelProvider)
        {
            _skillLevelProvider = skillLevelProvider;
        }

        /// <summary>
        /// Get all skill levels
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet]
        public BaseResponse<List<SkillLevel>> GetAllSkillLevels()
        {
            return new BaseResponse<List<SkillLevel>>(_skillLevelProvider.GetAllSkillLevels());
        }

        /// <summary>
        /// Get a specific skill level
        /// </summary>
        /// <param name="skillLevelId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{skillLevelId}")]
        public BaseResponse<SkillLevel> GetSkillLevel(int skillLevelId)
        {
            return new BaseResponse<SkillLevel>(_skillLevelProvider.GetSkillLevel(skillLevelId));
        }
        
        /// <summary>
        /// Create a new skill level
        /// </summary>
        /// <param name="skillLevel"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_ADMIN)]
        [HttpPost]
        public BaseResponse<SkillLevel> CreateSkillLevel([FromBody] SkillLevel skillLevel)
        {
            return new BaseResponse<SkillLevel>(_skillLevelProvider.CreateSkillLevel(skillLevel));
        }

        /// <summary>
        /// Update a skill level
        /// </summary>
        /// <param name="skillLevelId"></param>
        /// <param name="skillLevel"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_ADMIN)]
        [HttpPut("{skillLevelId}")]
        public BaseResponse<SkillLevel> UpdateSkillLevel(int skillLevelId, [FromBody] SkillLevel skillLevel)
        {
            return new BaseResponse<SkillLevel>(_skillLevelProvider.UpdateSkillLevel(skillLevelId, skillLevel));
        }

        /// <summary>
        /// Delete a skill level
        /// </summary>
        /// <param name="skillLevelId"></param>
        [Authorize(Roles = EnumRoles.MATCH_ADMIN)]
        [HttpDelete("{skillLevelId}")]
        public void DeleteSkillLevel(int skillLevelId)
        {
            _skillLevelProvider.DeleteSkillLevel(skillLevelId);
        }
    }
}