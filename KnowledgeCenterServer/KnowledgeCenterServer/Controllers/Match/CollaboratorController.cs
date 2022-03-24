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
    /// Collaborator controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/match/collaborator")]
    public class CollaboratorController : Controller
    {
        private readonly ICollaboratorProvider _collaboratorProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="collaboratorProvider"></param>
        public CollaboratorController(ICollaboratorProvider collaboratorProvider)
        {
            _collaboratorProvider = collaboratorProvider;
        }

        /// <summary>
        /// Get a specific collaborator
        /// </summary>
        /// <param name="collaboratorId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpGet("{collaboratorId}")]
        public BaseResponse<Collaborator> GetCollaborator(int collaboratorId)
        {
            return new BaseResponse<Collaborator>(_collaboratorProvider.GetCollaborator(collaboratorId));
        }

        /// <summary>
        /// Get all collaborators who fulfil filters
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumComputedRoles.MATCH_USER)]
        [HttpPost]
        public BaseResponse<BasePaginationResponse<List<Collaborator>>> GetFilteredCollaborators([FromBody] BasePaginationRequest<CollaboratorFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<Collaborator>>>(_collaboratorProvider.GetFilteredCollaborators(query));
        }

        /// <summary>
        /// Update collaborator skills
        /// </summary>
        /// <param name="collaboratorId"></param>
        /// <param name="newSkills"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpPut("{collaboratorId}/skills")]
        public BaseResponse<List<CollaboratorSkill>> UpdateCollaboratorSkills(int collaboratorId, [FromBody] List<CollaboratorSkill> newSkills)
        {
            return new BaseResponse<List<CollaboratorSkill>>(_collaboratorProvider.UpdateCollaboratorSkills(collaboratorId, newSkills));
        }

        /// <summary>
        /// Add a skill to a collaborator
        /// </summary>
        /// <param name="collaboratorId"></param>
        /// <param name="skillToAdd"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpPost("{collaboratorId}/skills")]
        public BaseResponse<CollaboratorSkill> AddCollaboratorSkill(int collaboratorId, [FromBody] CollaboratorSkill skillToAdd)
        {
            return new BaseResponse<CollaboratorSkill>(_collaboratorProvider.AddCollaboratorSkill(collaboratorId, skillToAdd));
        }
        
        /// <summary>
        /// Delete a collaborator's skill
        /// </summary>
        /// <param name="collaboratorId"></param>
        /// <param name="skillToDeleteId"></param>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpDelete("{collaboratorId}/skills/{skillToDeleteId}")]
        public void DeleteCollaboratorSkill(int collaboratorId, int skillToDeleteId)
        {
            _collaboratorProvider.DeleteCollaboratorSkill(collaboratorId, skillToDeleteId);
        }

        /// <summary>
        /// Update a specific skill's level
        /// </summary>
        /// <param name="collaboratorId"></param>
        /// <param name="skillToModifyId"></param>
        /// <param name="skillToModify"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpPut("{collaboratorId}/skills/{skillToModifyId}")]
        public BaseResponse<CollaboratorSkill> UpdateCollaboratorSkillLevel(int collaboratorId, int skillToModifyId, [FromBody] CollaboratorSkill skillToModify)
        {
            return new BaseResponse<CollaboratorSkill>(_collaboratorProvider.UpdateCollaboratorSkillLevel(collaboratorId, skillToModifyId, skillToModify));
        }

        /// <summary>
        /// Create a collaborator
        /// </summary>
        /// <param name="collaborator"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpPost("create")]
        public BaseResponse<Collaborator> CreateCollaborator([FromBody] CreateOrUpdateCollaborator collaborator)
        {
            return new BaseResponse<Collaborator>(_collaboratorProvider.CreateCollaborator(collaborator));
        }

        /// <summary>
        /// Update a collaborator
        /// </summary>
        /// <param name="collaborator"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpPut]
        public BaseResponse<Collaborator> UpdateCollaborator([FromBody] CreateOrUpdateCollaborator collaborator)
        {
            return new BaseResponse<Collaborator>(_collaboratorProvider.UpdateCollaborator(collaborator));
        }

        /// <summary>
        /// Delete a collaborator
        /// </summary>
        /// <param name="collaboratorId"></param>
        [Authorize(Roles = EnumRoles.MATCH_RM)]
        [HttpDelete("{collaboratorId}")]
        public void DeleteCollaborator(int collaboratorId)
        {
            _collaboratorProvider.DeleteCollaborator(collaboratorId);
        }
    }
}