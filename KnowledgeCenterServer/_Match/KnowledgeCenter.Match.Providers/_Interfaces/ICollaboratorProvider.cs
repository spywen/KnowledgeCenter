using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface ICollaboratorProvider
    {
        Collaborator GetCollaborator(int collaboratorId);
        BasePaginationResponse<List<Collaborator>> GetFilteredCollaborators(BasePaginationRequest<CollaboratorFilter> query);
        List<CollaboratorSkill> UpdateCollaboratorSkills(int collaboratorId, List<CollaboratorSkill> newSkills);
        CollaboratorSkill AddCollaboratorSkill(int collaboratorId, CollaboratorSkill skillToAdd);
        void DeleteCollaboratorSkill(int collaboratorId, int skillToDeleteId);
        CollaboratorSkill UpdateCollaboratorSkillLevel(int collaboratorId, int skillToModifyId, CollaboratorSkill skillToModify);
        Collaborator CreateCollaborator(CreateOrUpdateCollaborator collaboratorFacade);
        void DeleteCollaborator(int collaboratorId);
        Collaborator UpdateCollaborator(CreateOrUpdateCollaborator collaboratorFacade);
    }
}