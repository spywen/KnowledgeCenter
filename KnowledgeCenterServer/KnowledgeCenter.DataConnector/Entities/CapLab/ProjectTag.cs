using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.CapLab
{
    [Table("CapLab.ProjectTag")]
    public class ProjectTag
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}
