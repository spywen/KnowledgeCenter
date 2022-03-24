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
    [Route("api/caplab/project")]
    [Authorize(Roles = EnumComputedRoles.NICE_COLAB)]
    public class CaplabController : Controller
    {
        private readonly IProjectProvider _projectProvider;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="projectProvider"></param>
        public CaplabController(IProjectProvider projectProvider)
        {
            _projectProvider = projectProvider;
        }

        /// <summary>
        /// Get a specific project
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        [HttpGet("{projectId}")]
        public BaseResponse<Project> GetProject(int projectId)
        {
            return new BaseResponse<Project>(_projectProvider.GetProject(projectId));
        }

        /// <summary>
        /// Delete a project
        /// </summary>
        /// <param name="projectId"></param>
        [HttpDelete("{projectId}")]
        public void DeleteProject(int projectId)
        {
            _projectProvider.DeleteProject(projectId);
        }

        /// <summary>
        /// Create a project
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public BaseResponse<Project> CreateProject([FromBody] CreateOrUpdateProject project)
        {
            return new BaseResponse<Project>(_projectProvider.CreateProject(project));
        }

        /// <summary>
        /// Update a project
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        [HttpPut("update")]
        public BaseResponse<Project> UpdateProject([FromBody] CreateOrUpdateProject project)
        {
            return new BaseResponse<Project>(_projectProvider.UpdateProject(project));
        }

        /// <summary>
        /// Get project statuses
        /// </summary>
        /// <returns></returns>
        [HttpGet("status")]
        public BaseResponse<List<ProjectStatus>> ValidateProject(int projectId)
        {
            return new BaseResponse<List<ProjectStatus>>(_projectProvider.GetProjectStatuses());
        }

        /// <summary>
        /// Update project status
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="statusId"></param>
        /// <returns></returns>
        [Authorize(Roles = EnumRoles.CAPLAB_ADMIN)]
        [HttpPatch("{projectId}/status/{statusId}")]
        public void RejectProject(int projectId, int statusId)
        {
            _projectProvider.UpdateProjectStatus(projectId, statusId);
        }

        /// <summary>
        /// Rate project
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="rate"></param>
        [HttpPatch("{projectId}/rate/{rate}")]
        public void RateProject(int projectId, int rate)
        {
            _projectProvider.RateProject(projectId, rate);
        }

        /// <summary>
        /// Get projects
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public BaseResponse<BasePaginationResponse<List<Project>>> GetProjects([FromBody] BasePaginationRequest<ProjectFilter> query)
        {
            return new BaseResponse<BasePaginationResponse<List<Project>>>(_projectProvider.GetProjects(query));
        }
    }
}