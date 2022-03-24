using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.CapLab
{
    [Table("CapLab.ProjectStatus")]
    public class ProjectStatus
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }

    public class EnumProjectStatus
    {
        public const string WAITING = "WAITING";
        public const string VALIDATED = "VALIDATED";
        public const string REJECTED = "REJECTED";
        public const string INPROGRESS = "INPROGRESS";
        public const string FINISHED = "FINISHED";
    }
}
