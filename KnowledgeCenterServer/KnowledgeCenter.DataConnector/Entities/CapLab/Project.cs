using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.CapLab
{
    [Table("CapLab.Project")]
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ProjectStatusId { get; set; }
        public ProjectStatus ProjectStatus { get; set; }
        public ICollection<ProjectTag> ProjectTags { get; set; }
        public ICollection<ProjectLike> ProjectLikes { get; set; }
        public decimal LikeAverage { get; set; }
        public int LikeCount { get; set; }
        public int? ApproverId { get; set; }
        public User Approver { get; set; }
    }
}
