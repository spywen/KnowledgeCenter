using KnowledgeCenter.CapLab.Contracts;
using KnowledgeCenter.Common;
using System.Collections.Generic;

namespace KnowledgeCenter.CapLab.Providers._Interfaces
{
    public interface IProjectProvider
    {
        Project GetProject(int id);

        void DeleteProject(int id);

        Project CreateProject(CreateOrUpdateProject projectFacade);

        Project UpdateProject(CreateOrUpdateProject projectFacade);

        List<ProjectStatus> GetProjectStatuses();

        void UpdateProjectStatus(int projectId, int projectStatus);

        void RateProject(int id, int rate);

        BasePaginationResponse<List<Project>> GetProjects(BasePaginationRequest<ProjectFilter> query);
    }
}
