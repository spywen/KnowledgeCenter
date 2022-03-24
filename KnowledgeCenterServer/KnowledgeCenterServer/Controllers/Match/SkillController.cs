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
    /// Skill controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/skill")]
    public class SkillController : Controller
    {
        private readonly ISkillProvider _skillProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="skillProvider"></param>
        public SkillController(ISkillProvider skillProvider)
        {
            _skillProvider = skillProvider;
        }

        /// <summary>
        /// Get all existing skills
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet]
        public BaseResponse<List<Skill>> GetAllSkills()
        {
            return new BaseResponse<List<Skill>>(_skillProvider.GetAllSkills());
        }

        /// <summary>
        /// Get a specific skill
        /// </summary>
        /// <param name="skillId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{skillId}")]
        public BaseResponse<Skill> GetSkill(int skillId)
        {
            return new BaseResponse<Skill>(_skillProvider.GetSkill(skillId));
        }

        /// <summary>
        /// Create a new skill
        /// </summary>
        /// <param name="skill"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_ADMIN)]
        [HttpPost]
        public BaseResponse<Skill> CreateSkill([FromBody] Skill skill)
        {
            return new BaseResponse<Skill>(_skillProvider.CreateSkill(skill));
        }

        /// <summary>
        /// Update a skill
        /// </summary>
        /// <param name="skillId"></param>
        /// <param name="skill"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_ADMIN)]
        [HttpPut("{skillId}")]
        public BaseResponse<Skill> UpdateSkill(int skillId, [FromBody] Skill skill)
        {
            return new BaseResponse<Skill>(_skillProvider.UpdateSkill(skillId, skill));
        }

        /// <summary>
        /// Delete a skill
        /// </summary>
        /// <param name="skillId"></param>
        [Authorize(Roles = EnumRoles.MATCH_ADMIN)]
        [HttpDelete("{skillId}")]
        public void Delete(int skillId)
        {
            _skillProvider.DeleteSkill(skillId);
        }
    }
}