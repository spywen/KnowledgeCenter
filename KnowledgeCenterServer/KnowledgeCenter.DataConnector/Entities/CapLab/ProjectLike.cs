using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.CapLab
{
    [Table("CapLab.ProjectLike")]
    public class ProjectLike
    {
        public int Id { get; set; }
        public int Rate { get; set; }
        public DateTime DateCreation { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
